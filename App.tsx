import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, ChevronRight, Plus, LayoutGrid, BarChart3, 
  Calendar as CalendarIcon, Home
} from 'lucide-react';
import { 
  getDaysInMonth, getFirstDayOfMonth, formatDateISO, parseDateISO, isSameDay, addDays 
} from './utils/dateHelper';
import { Session, SessionStatus } from './types';
import { STATUS_COLORS, MONTH_NAMES } from './constants';
import { saveSessions, getSessions } from './services/storageService';
import { AddScheduleModal } from './components/AddScheduleModal';
import { SessionDetailModal } from './components/SessionDetailModal';
import { Reports } from './components/Reports';
import { Dashboard } from './components/Dashboard';

// Generate UUID simple helper
const generateId = () => Math.random().toString(36).substr(2, 9);

export default function App() {
  // --- State ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [sessions, setSessions] = useState<Session[]>([]);
  // Changed default view to 'dashboard'
  const [view, setView] = useState<'dashboard' | 'calendar' | 'reports'>('dashboard');
  
  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // --- Effects ---
  useEffect(() => {
    const loaded = getSessions();
    setSessions(loaded);
  }, []);

  useEffect(() => {
    saveSessions(sessions);
  }, [sessions]);

  // --- Calendar Logic ---
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    
    // 0=Sun, 1=Mon. Adjust so Mon=0, Sun=6 for array index
    let firstDayIndex = getFirstDayOfMonth(year, month);
    // Standard JS Day: Sun=0, Mon=1...Sat=6.
    // We want Mon as first column.
    // If Sun(0) -> 6. If Mon(1) -> 0.
    const startOffset = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const days = [];
    // Padding for prev month
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    // Days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  }, [currentDate]);

  // --- Handlers ---
  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleAddSessions = (newSessionsData: { date: string; time: string; duration: number }[]) => {
    const newSessions: Session[] = newSessionsData.map(s => ({
      id: generateId(),
      date: s.date,
      time: s.time,
      duration: s.duration,
      status: SessionStatus.SCHEDULED
    }));
    setSessions(prev => [...prev, ...newSessions]);
  };

  const handleUpdateSession = (updated: Session) => {
    setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const handleDeleteSession = (id: string) => {
    setSessions(prev => prev.filter(s => s.id !== id));
  };

  const handleSessionClick = (session: Session) => {
    setSelectedSession(session);
    setIsDetailModalOpen(true);
  };

  // --- Render Helpers ---
  const renderCalendarDay = (date: Date | null, index: number) => {
    if (!date) return <div key={`empty-${index}`} className="h-24 md:h-32 bg-gray-50/50 border-b border-r border-gray-100" />;

    const isoDate = formatDateISO(date);
    const daySessions = sessions.filter(s => s.date === isoDate);
    const isToday = isSameDay(date, new Date());

    return (
      <div key={isoDate} className={`min-h-[6rem] md:h-32 border-b border-r border-gray-100 p-2 transition-colors hover:bg-slate-50 relative group ${isToday ? 'bg-blue-50/30' : 'bg-white'}`}>
        <div className="flex justify-between items-start mb-1">
          <span className={`text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-pilates-600 text-white' : 'text-gray-700'}`}>
            {date.getDate()}
          </span>
          {/* Mobile indicator dot if small screen */}
          {daySessions.length > 0 && (
             <div className="md:hidden w-2 h-2 rounded-full bg-pilates-500"></div>
          )}
        </div>
        
        <div className="space-y-1 hidden md:block overflow-y-auto max-h-[5.5rem] no-scrollbar">
          {daySessions.sort((a,b) => a.time.localeCompare(b.time)).map(session => (
            <button
              key={session.id}
              onClick={(e) => { e.stopPropagation(); handleSessionClick(session); }}
              className={`w-full text-left text-xs px-2 py-1 rounded border truncate transition-all hover:shadow-md ${STATUS_COLORS[session.status]}`}
            >
              <span className="font-bold opacity-75 mr-1">{session.time}</span>
              <span>
                 {session.status === SessionStatus.INSTRUCTOR_CANCELLED ? 'İptal' : 'Pilates'}
              </span>
            </button>
          ))}
        </div>

        {/* Mobile View: Just show count or basic list */}
        <div className="md:hidden mt-1 space-y-1">
           {daySessions.map(session => (
              <div 
                key={session.id} 
                onClick={() => handleSessionClick(session)}
                className={`w-full h-2 rounded-full ${STATUS_COLORS[session.status].split(' ')[0]}`}
              />
           ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800">
      
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => setView('dashboard')}>
            <div className="w-8 h-8 bg-pilates-600 rounded-lg flex items-center justify-center text-white cursor-pointer">
              <LayoutGrid size={20} />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pilates-700 to-pilates-500 cursor-pointer">
              PilatesTakip
            </h1>
          </div>
          
          <div className="flex bg-gray-100 p-1 rounded-lg overflow-x-auto">
            <button 
              onClick={() => setView('dashboard')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${view === 'dashboard' ? 'bg-white shadow text-pilates-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Home size={16} /> <span className="hidden sm:inline">Ana Sayfa</span>
            </button>
            <button 
              onClick={() => setView('calendar')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${view === 'calendar' ? 'bg-white shadow text-pilates-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <CalendarIcon size={16} /> <span className="hidden sm:inline">Takvim</span>
            </button>
            <button 
              onClick={() => setView('reports')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-2 transition-all whitespace-nowrap ${view === 'reports' ? 'bg-white shadow text-pilates-700' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <BarChart3 size={16} /> <span className="hidden sm:inline">Raporlar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6">
        
        {view === 'dashboard' && (
          <Dashboard 
            sessions={sessions}
            onNavigate={setView}
            onSessionClick={handleSessionClick}
          />
        )}

        {view === 'calendar' && (
          <div className="space-y-6 animate-fade-in">
            {/* Calendar Header */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-4 bg-white p-1 rounded-xl shadow-sm border border-gray-100">
                <button 
                  onClick={() => handleMonthChange('prev')}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-lg font-semibold w-32 text-center text-gray-800">
                  {MONTH_NAMES[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button 
                  onClick={() => handleMonthChange('next')}
                  className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="w-full sm:w-auto px-5 py-2.5 bg-pilates-600 hover:bg-pilates-700 text-white rounded-xl shadow-lg shadow-pilates-200 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Plus size={20} />
                <span>Program Oluştur</span>
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              {/* Day Headers */}
              <div className="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
                {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                  <div key={day} className="py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Days */}
              <div className="grid grid-cols-7">
                {calendarDays.map((day, i) => renderCalendarDay(day, i))}
              </div>
            </div>

            {/* Legend for Mobile mainly, but good for all */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500 justify-center sm:justify-start">
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-green-500"></div> Katıldım</div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-red-500"></div> Gidemedim</div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-orange-500"></div> Hoca İptal</div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-gray-300"></div> Planlı</div>
            </div>
          </div>
        )}

        {view === 'reports' && (
          <Reports sessions={sessions} />
        )}
      </main>

      {/* Modals */}
      <AddScheduleModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        onSave={handleAddSessions}
      />

      <SessionDetailModal 
        isOpen={isDetailModalOpen}
        onClose={() => { setIsDetailModalOpen(false); setSelectedSession(null); }}
        session={selectedSession}
        onUpdate={handleUpdateSession}
        onDelete={handleDeleteSession}
      />

    </div>
  );
}