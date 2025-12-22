import React, { useState } from 'react';
import { Modal } from './Modal';
import { DAYS_OF_WEEK, DayOfWeekOption } from '../types';
import { generateRecurringDates, formatDateISO, addDays } from '../utils/dateHelper';
import { CalendarDays, Clock, RefreshCw, Timer } from 'lucide-react';

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSessions: { date: string; time: string; duration: number }[]) => void;
}

export const AddScheduleModal: React.FC<AddScheduleModalProps> = ({ isOpen, onClose, onSave }) => {
  const [startDate, setStartDate] = useState(formatDateISO(new Date()));
  // Default end date 1 month later
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
    if (selectedDays.length === 0) {
      alert("Lütfen en az bir gün seçin.");
      return;
    }
    const dates = generateRecurringDates(startDate, endDate, selectedDays);
    const sessions = dates.map(date => ({ date, time, duration }));
    onSave(sessions);
    onClose();
    // Reset form slightly
    setSelectedDays([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Yeni Ders Programı Ekle">
      <div className="space-y-6">
        
        {/* Date Range */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <CalendarDays size={16} /> Tarih Aralığı
          </label>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Başlangıç</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pilates-400 outline-none"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Bitiş</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pilates-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Time & Duration */}
        <div className="flex gap-4">
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Clock size={16} /> Saat
            </label>
            <input 
              type="time" 
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pilates-400 outline-none"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
              <Timer size={16} /> Süre (dk)
            </label>
            <input 
              type="number" 
              min="15"
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-pilates-400 outline-none"
            />
          </div>
        </div>

        {/* Days Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
            <RefreshCw size={16} /> Tekrar Eden Günler
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DAYS_OF_WEEK.map((day: DayOfWeekOption) => (
              <button
                key={day.value}
                onClick={() => toggleDay(day.value)}
                className={`text-sm py-2 px-1 rounded-lg transition-all ${
                  selectedDays.includes(day.value)
                    ? 'bg-pilates-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {day.label}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            İptal
          </button>
          <button 
            onClick={handleSave}
            className="px-6 py-2 bg-pilates-600 text-white rounded-lg hover:bg-pilates-700 transition-colors shadow-lg shadow-pilates-200 font-medium"
          >
            Programı Oluştur
          </button>
        </div>
      </div>
    </Modal>
  );
};