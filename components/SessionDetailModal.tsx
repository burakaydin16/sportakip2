import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Session, SessionStatus } from '../types';
import { CheckCircle2, XCircle, AlertTriangle, CalendarClock, Trash2, Clock } from 'lucide-react';

interface SessionDetailModalProps {
  session: Session | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updated: Session) => void;
  onDelete: (id: string) => void;
}

export const SessionDetailModal: React.FC<SessionDetailModalProps> = ({ session, isOpen, onClose, onUpdate, onDelete }) => {
  const [reschedule, setReschedule] = useState({ active: false, date: '', time: '' });

  useEffect(() => {
    if (session) setReschedule({ active: false, date: session.date, time: session.time });
  }, [session, isOpen]);

  if (!session) return null;

  const handleStatus = (status: SessionStatus) => {
    onUpdate({ ...session, status });
    onClose();
  };

  const handleReschedule = () => {
    onUpdate({ 
      ...session, 
      date: reschedule.date, 
      time: reschedule.time, 
      originalDate: session.date,
      status: SessionStatus.SCHEDULED 
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ders Yönetimi">
      <div className="space-y-6">
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
          <div className="text-slate-500 text-xs font-bold uppercase mb-1">Mevcut Randevu</div>
          <div className="text-lg font-bold text-slate-800">
            {new Date(session.date).toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </div>
          <div className="flex items-center gap-2 text-slate-600 font-semibold mt-1">
            <Clock size={16} /> {session.time} • {session.duration} dk
          </div>
        </div>

        {!reschedule.active ? (
          <div className="grid grid-cols-1 gap-3">
            <ActionButton 
              onClick={() => handleStatus(SessionStatus.ATTENDED)} 
              color="green" icon={<CheckCircle2 size={20}/>} label="Katıldım" 
              active={session.status === SessionStatus.ATTENDED}
            />
            <ActionButton 
              onClick={() => handleStatus(SessionStatus.MISSED)} 
              color="red" icon={<XCircle size={20}/>} label="Gidemedim" 
              active={session.status === SessionStatus.MISSED}
            />
            <ActionButton 
              onClick={() => handleStatus(SessionStatus.INSTRUCTOR_CANCELLED)} 
              color="orange" icon={<AlertTriangle size={20}/>} label="Hoca Gelmedi / İptal" 
              active={session.status === SessionStatus.INSTRUCTOR_CANCELLED}
            />
            <button 
              onClick={() => setReschedule({ ...reschedule, active: true })}
              className="mt-2 w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-500 hover:bg-slate-50 hover:border-pilates-300 hover:text-pilates-600 transition-all font-bold flex items-center justify-center gap-2"
            >
              <CalendarClock size={20} /> Bu Dersi Ertele
            </button>
          </div>
        ) : (
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 space-y-4 animate-scale-up">
            <h4 className="font-bold text-blue-800 flex items-center gap-2"><CalendarClock size={18}/> Yeni Tarih & Saat</h4>
            <div className="grid grid-cols-2 gap-3">
              <input type="date" value={reschedule.date} onChange={e => setReschedule({...reschedule, date: e.target.value})} className="p-3 rounded-xl border-blue-200 border bg-white outline-none focus:ring-2 focus:ring-blue-400" />
              <input type="time" value={reschedule.time} onChange={e => setReschedule({...reschedule, time: e.target.value})} className="p-3 rounded-xl border-blue-200 border bg-white outline-none focus:ring-2 focus:ring-blue-400" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setReschedule({...reschedule, active: false})} className="flex-1 py-2.5 bg-white text-blue-600 rounded-xl font-bold border border-blue-200">Vazgeç</button>
              <button onClick={handleReschedule} className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-bold">Tarihi Kaydır</button>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center border-t border-slate-100 pt-4">
          <button onClick={() => { if(confirm("Silinsin mi?")) onDelete(session.id); onClose(); }} className="text-red-500 hover:text-red-700 font-bold flex items-center gap-1">
            <Trash2 size={16} /> Dersi Sil
          </button>
          <button onClick={onClose} className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold">Kapat</button>
        </div>
      </div>
    </Modal>
  );
};

function ActionButton({ color, icon, label, onClick, active }: any) {
  const colors: any = {
    green: active ? 'bg-green-600 text-white' : 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
    red: active ? 'bg-red-600 text-white' : 'bg-red-50 text-red-700 hover:bg-red-100 border-red-200',
    orange: active ? 'bg-orange-600 text-white' : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-orange-200',
  };
  return (
    <button onClick={onClick} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all font-bold ${colors[color]}`}>
      {icon} <span>{label}</span>
    </button>
  );
}