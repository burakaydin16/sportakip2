
import React, { useState } from 'react';
import { Modal } from './Modal';
import { DAYS_OF_WEEK, DayOfWeekOption } from '../types';
import { generateRecurringDates, formatDateISO, addDays } from '../utils/dateHelper';
import { CalendarDays, Clock, RefreshCw, Timer, Calendar as SingleCalendarIcon, Layers } from 'lucide-react';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSessions: { date: string; time: string; duration: number }[]) => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ isOpen, onClose, onSave }) => {
  const [mode, setMode] = useState<'single' | 'recurring'>('recurring');
  const [singleDate, setSingleDate] = useState(formatDateISO(new Date()));
  const [startDate, setStartDate] = useState(formatDateISO(new Date()));
  const [endDate, setEndDate] = useState(formatDateISO(addDays(new Date(), 30))); 
  const [time, setTime] = useState('18:00');
  const [duration, setDuration] = useState(50);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  const toggleDay = (dayValue: number) => {
    setSelectedDays(prev => 
      prev.includes(dayValue) 
        ? prev.filter(d => d !== dayValue) 
        : [...prev, dayValue]
    );
  };

  const handleSave = () => {
    if (mode === 'single') {
      onSave([{ date: singleDate, time, duration }]);
    } else {
      if (selectedDays.length === 0) {
        alert("Lütfen en az bir gün seçin.");
        return;
      }
      const dates = generateRecurringDates(startDate, endDate, selectedDays);
      if (dates.length === 0) {
        alert("Seçilen tarih aralığında uygun gün bulunamadı.");
        return;
      }
      const sessions = dates.map(date => ({ date, time, duration }));
      onSave(sessions);
    }
    onClose();
    // Reset form
    setSelectedDays([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Ders Ekle">
      <div className="space-y-6">
        
        {/* Mode Toggle */}
        <div className="flex p-1 bg-slate-100 rounded-xl">
          <button 
            onClick={() => setMode('single')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'single' ? 'bg-white text-pilates-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <SingleCalendarIcon size={16} /> Tek Ders
          </button>
          <button 
            onClick={() => setMode('recurring')}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${mode === 'recurring' ? 'bg-white text-pilates-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Layers size={16} /> Program
          </button>
        </div>

        {/* Conditional Date Selection */}
        {mode === 'single' ? (
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
              <CalendarDays size={16} className="text-pilates-500" /> Ders Tarihi
            </label>
            <input 
              type="date" 
              value={singleDate} 
              onChange={(e) => setSingleDate(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-pilates-500 outline-none bg-slate-50 font-medium"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                <CalendarDays size={16} className="text-pilates-500" /> Tarih Aralığı
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 ml-1">Başlangıç</span>
                  <input 
                    type="date" 
                    value={startDate} 
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-pilates-500 outline-none bg-slate-50 font-medium text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 ml-1">Bitiş</span>
                  <input 
                    type="date" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-pilates-500 outline-none bg-slate-50 font-medium text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
                <RefreshCw size={16} className="text-pilates-500" /> Tekrar Eden Günler
              </label>
              <div className="grid grid-cols-4 gap-2">
                {DAYS_OF_WEEK.map((day: DayOfWeekOption) => (
                  <button
                    key={day.value}
                    onClick={() => toggleDay(day.value)}
                    className={`text-xs py-2.5 rounded-xl font-bold transition-all border ${
                      selectedDays.includes(day.value)
                        ? 'bg-pilates-600 border-pilates-600 text-white shadow-md shadow-pilates-100'
                        : 'bg-white border-slate-100 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {day.label.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Time & Duration */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
              <Clock size={16} className="text-pilates-500" /> Saat
            </label>
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-pilates-500 outline-none bg-slate-50 font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 flex items-center gap-2">
              <Timer size={16} className="text-pilates-500" /> Süre (dk)
            </label>
            <input 
              type="number" 
              min="15"
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full border border-slate-200 rounded-xl p-3 focus:ring-2 focus:ring-pilates-500 outline-none bg-slate-50 font-medium"
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 text-slate-500 font-bold hover:bg-slate-50 rounded-xl transition-colors"
          >
            Vazgeç
          </button>
          <button 
            onClick={handleSave}
            className="px-8 py-2.5 bg-pilates-600 text-white rounded-xl hover:bg-pilates-700 transition-all shadow-lg shadow-pilates-100 font-bold"
          >
            {mode === 'single' ? 'Dersi Kaydet' : 'Programı Oluştur'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
