import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getDaysInMonth, getFirstDayOfMonth, formatDateISO, isSameDay } from '../utils/dateHelper';
import { Session, SessionStatus } from '../types';
import { STATUS_COLORS, MONTH_NAMES } from '../constants';

interface CalendarViewProps {
  sessions: Session[];
  onSessionClick: (session: Session) => void;
  onOpenAdd: () => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ sessions, onSessionClick, onOpenAdd }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const count = getDaysInMonth(year, month);
    const start = getFirstDayOfMonth(year, month);
    const offset = start === 0 ? 6 : start - 1;

    const arr = [];
    for (let i = 0; i < offset; i++) arr.push(null);
    for (let i = 1; i <= count; i++) arr.push(new Date(year, month, i));
    return arr;
  }, [currentDate]);

  const changeMonth = (val: number) => {
    const d = new Date(currentDate);
    d.setMonth(d.getMonth() + val);
    setCurrentDate(d);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-4">
          <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100"><ChevronLeft size={20} /></button>
          <h2 className="text-xl font-bold text-slate-800 min-w-[150px] text-center">
            {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 rounded-lg transition-colors border border-slate-100"><ChevronRight size={20} /></button>
        </div>
        <button 
          onClick={onOpenAdd}
          className="w-full sm:w-auto bg-pilates-600 hover:bg-pilates-700 text-white px-6 py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-pilates-100 transition-all active:scale-95"
        >
          <Plus size={20} /> Program Oluştur
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <div className="grid grid-cols-7 bg-slate-50/50 border-b border-slate-100">
          {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(d => (
            <div key={d} className="py-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            if (!day) return <div key={`empty-${i}`} className="h-28 sm:h-36 bg-slate-50/30 border-b border-r border-slate-100/50" />;
            
            const iso = formatDateISO(day);
            const daySessions = sessions.filter(s => s.date === iso);
            const isToday = isSameDay(day, new Date());

            return (
              <div key={iso} className={`h-28 sm:h-36 border-b border-r border-slate-100 p-2 transition-all hover:bg-slate-50/80 relative group ${isToday ? 'bg-blue-50/30' : ''}`}>
                <div className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-lg mb-1 ${isToday ? 'bg-pilates-600 text-white shadow-md shadow-pilates-100' : 'text-slate-600'}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1 overflow-y-auto max-h-[calc(100%-2rem)] no-scrollbar">
                  {daySessions.map(s => (
                    <button
                      key={s.id}
                      onClick={() => onSessionClick(s)}
                      className={`w-full text-left text-[10px] sm:text-xs p-1.5 rounded-lg border font-bold truncate transition-all hover:scale-[1.02] ${STATUS_COLORS[s.status]}`}
                    >
                      {s.time} Pilates
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};