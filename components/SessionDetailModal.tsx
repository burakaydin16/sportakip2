import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Session, SessionStatus } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, CalendarClock, Clock } from 'lucide-react';

interface SessionDetailModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedSession: Session) => void;
  onDelete: (id: string) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ 
  session, isOpen, onClose, onUpdate, onDelete 
}) => {
  const [status, setStatus] = useState<SessionStatus>(SessionStatus.SCHEDULED);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [rescheduleTime, setRescheduleTime] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);

  useEffect(() => {
    if (session) {
      setStatus(session.status);
      setRescheduleDate(session.date);
      setRescheduleTime(session.time);
      setIsRescheduling(false);
    }
  }, [session, isOpen]);

  if (!session) return null;

  const handleSave = () => {
    let updated = { ...session, status };
    
    // Logic for rescheduling: we move the date/time of THIS session
    if (isRescheduling) {
      // If we are moving it, save the original date if not already saved
      if (!updated.originalDate) {
        updated.originalDate = updated.date;
      }
      
      updated.date = rescheduleDate;
      updated.time = rescheduleTime;
      // Rescheduling usually implies it is now "Scheduled" for the new time, resetting previous missed/cancelled status
      updated.status = SessionStatus.SCHEDULED; 
    }

    onUpdate(updated);
    onClose();
  };

  const handleDelete = () => {
    if (confirm("Bu dersi silmek istediğinize emin misiniz?")) {
      onDelete(session.id);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ders Detayları">
      <div className="space-y-6">
        
        {/* Info Banner */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex flex-col gap-1">
           <span className="text-sm text-slate-500 font-medium">Mevcut Zaman</span>
           <div className="text-xl font-bold text-slate-800">
             {new Date(session.date).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long'})}
           </div>
           <div className="flex items-center gap-3 text-lg text-slate-600 font-medium">
             <span>{session.time}</span>
             <span className="text-slate-300">|</span>
             <span className="flex items-center gap-1 text-base"><Clock size={16}/> {session.duration || 50} dk</span>
           </div>
           {session.originalDate && (
             <div className="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-100">
               Ertelenmiş Ders (Eski Tarih: {session.originalDate})
             </div>
           )}
        </div>

        {/* Actions Grid */}
        {!isRescheduling && (
          <div className="space-y-3">
             <label className="text-sm font-semibold text-gray-700 block">Durum İşaretle</label>
             <div className="grid grid-cols-1 gap-2">
                <button 
                  onClick={() => setStatus(SessionStatus.ATTENDED)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${status === SessionStatus.ATTENDED ? 'bg-green-50 border-green-500 ring-1 ring-green-500' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className={`p-2 rounded-full ${status === SessionStatus.ATTENDED ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="font-medium text-gray-700">Derse Katıldım</span>
                </button>

                <button 
                  onClick={() => setStatus(SessionStatus.MISSED)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${status === SessionStatus.MISSED ? 'bg-red-50 border-red-500 ring-1 ring-red-500' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className={`p-2 rounded-full ${status === SessionStatus.MISSED ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <XCircle size={18} />
                  </div>
                  <span className="font-medium text-gray-700">Gidemedim</span>
                </button>

                <button 
                  onClick={() => setStatus(SessionStatus.INSTRUCTOR_CANCELLED)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${status === SessionStatus.INSTRUCTOR_CANCELLED ? 'bg-orange-50 border-orange-500 ring-1 ring-orange-500' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                   <div className={`p-2 rounded-full ${status === SessionStatus.INSTRUCTOR_CANCELLED ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <AlertTriangle size={18} />
                  </div>
                  <span className="font-medium text-gray-700">Hoca İptal Etti / Gelmedi</span>
                </button>
             </div>
             
             <div className="border-t border-gray-100 my-4 pt-4">
               <button 
                  onClick={() => setIsRescheduling(true)}
                  className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 flex justify-center items-center gap-2 font-medium"
               >
                 <CalendarClock size={18} />
                 Bu Dersi Ertele / Taşı
               </button>
             </div>
          </div>
        )}

        {/* Reschedule View */}
        {isRescheduling && (
          <div className="space-y-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
             <h3 className="font-semibold text-blue-900 flex items-center gap-2">
               <CalendarClock size={18} /> Yeni Tarih Seç
             </h3>
             <p className="text-xs text-blue-600">
               Bu işlem sadece seçili dersi yeni bir tarihe kaydırır.
             </p>
             <div className="space-y-3">
               <div>
                 <label className="text-xs text-blue-700 mb-1 block">Yeni Tarih</label>
                 <input 
                   type="date" 
                   value={rescheduleDate}
                   onChange={(e) => setRescheduleDate(e.target.value)}
                   className="w-full border border-blue-200 rounded-lg p-2"
                 />
               </div>
               <div>
                 <label className="text-xs text-blue-700 mb-1 block">Yeni Saat</label>
                 <input 
                   type="time" 
                   value={rescheduleTime}
                   onChange={(e) => setRescheduleTime(e.target.value)}
                   className="w-full border border-blue-200 rounded-lg p-2"
                 />
               </div>
               <div className="flex gap-2 pt-2">
                 <button 
                   onClick={() => setIsRescheduling(false)}
                   className="flex-1 py-2 bg-white text-blue-700 border border-blue-200 rounded-lg hover:bg-blue-50 text-sm"
                 >
                   Vazgeç
                 </button>
                 {/* Save happens in main footer */}
               </div>
             </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-2">
          <button 
            onClick={handleDelete}
            className="text-red-500 text-sm hover:underline px-2"
          >
            Sil
          </button>
          <div className="flex gap-3">
            <button 
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Kapat
            </button>
            <button 
              onClick={handleSave}
              className="px-6 py-2 bg-pilates-600 text-white rounded-lg hover:bg-pilates-700 shadow-md shadow-pilates-200"
            >
              Kaydet
            </button>
          </div>
        </div>

      </div>
    </Modal>
  );
};