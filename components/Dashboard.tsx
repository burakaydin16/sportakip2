import React, { useMemo } from 'react';
import { Session, SessionStatus } from '../types';
import { STATUS_COLORS } from '../constants';
import { formatDateISO, parseDateISO } from '../utils/dateHelper';
import { ArrowRight, LayoutDashboard, CheckCircle2, CalendarDays, TrendingUp, Quote, Clock, Calendar } from 'lucide-react';

interface DashboardProps {
  sessions: Session[];
  onNavigate: (view: 'calendar' | 'reports') => void;
  onSessionClick: (session: Session) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ sessions, onNavigate, onSessionClick }) => {
  const todayISO = formatDateISO(new Date());

  const stats = useMemo(() => {
    const total = sessions.length;
    const attended = sessions.filter(s => s.status === SessionStatus.ATTENDED).length;
    const missed = sessions.filter(s => s.status === SessionStatus.MISSED).length;
    const cancelled = sessions.filter(s => s.status === SessionStatus.INSTRUCTOR_CANCELLED).length;
    
    const pastSessions = attended + missed + cancelled;
    const rate = pastSessions > 0 ? Math.round((attended / pastSessions) * 100) : 0;

    return { total, attended, rate };
  }, [sessions]);

  const upcomingSessions = useMemo(() => {
    // Filter sessions that are today or in the future
    return sessions
      .filter(s => s.date >= todayISO && s.status === SessionStatus.SCHEDULED)
      .sort((a, b) => {
        if (a.date !== b.date) return a.date.localeCompare(b.date);
        return a.time.localeCompare(b.time);
      })
      .slice(0, 3); // Take top 3
  }, [sessions, todayISO]);

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-pilates-800 to-pilates-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h2 className="text-3xl font-bold">Hoş Geldin!</h2>
          <p className="text-pilates-100 max-w-md">
            Pilates yolculuğunda bugün harika bir gün. Programını kontrol et ve hedeflerine ulaş.
          </p>
          <button 
            onClick={() => onNavigate('calendar')}
            className="mt-4 inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl transition-all font-medium"
          >
            Takvime Git <ArrowRight size={18} />
          </button>
        </div>
        <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-md border border-white/20">
          <LayoutDashboard size={48} className="text-white/80" />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-green-100 p-3 rounded-xl text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span className="text-3xl font-bold text-gray-800">{stats.attended}</span>
            <p className="text-sm text-gray-500 font-medium">Tamamlanan Ders</p>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-blue-100 p-3 rounded-xl text-blue-600">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="text-3xl font-bold text-gray-800">%{stats.rate}</span>
            <p className="text-sm text-gray-500 font-medium">Katılım Oranı</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="bg-purple-100 p-3 rounded-xl text-purple-600">
            <CalendarDays size={24} />
          </div>
          <div>
            <span className="text-3xl font-bold text-gray-800">{stats.total}</span>
            <p className="text-sm text-gray-500 font-medium">Toplam Planlanan</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Classes */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Calendar size={20} className="text-pilates-600"/> Yaklaşan Dersler
            </h3>
            {upcomingSessions.length > 0 && (
              <button 
                onClick={() => onNavigate('calendar')}
                className="text-sm text-pilates-600 hover:text-pilates-700 font-medium hover:underline"
              >
                Tümünü Gör
              </button>
            )}
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {upcomingSessions.length > 0 ? (
              <div className="divide-y divide-gray-50">
                {upcomingSessions.map(session => (
                  <div 
                    key={session.id} 
                    onClick={() => onSessionClick(session)}
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-pilates-50 text-pilates-600 w-12 h-12 rounded-xl flex flex-col items-center justify-center border border-pilates-100 font-bold">
                        <span className="text-xs uppercase">{new Date(session.date).toLocaleDateString('tr-TR', { weekday: 'short' })}</span>
                        <span className="text-lg leading-none">{new Date(session.date).getDate()}</span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">Pilates Dersi</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                           <span className="flex items-center gap-1"><Clock size={14}/> {session.time}</span>
                           <span>•</span>
                           <span>{session.duration || 50} dk</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-gray-300 group-hover:text-pilates-500 transition-colors">
                      <ArrowRight size={20} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400 flex flex-col items-center gap-2">
                <CalendarDays size={32} className="opacity-50" />
                <p>Yaklaşan planlı dersin yok.</p>
                <button 
                  onClick={() => onNavigate('calendar')} 
                  className="text-pilates-600 font-medium hover:underline mt-1"
                >
                  Takvimden ekle
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Daily Motivation */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <Quote size={20} className="text-orange-500"/> Günün İpucu
          </h3>
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-2xl border border-orange-100 h-full flex flex-col justify-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Quote size={80} className="text-orange-900" />
            </div>
            <p className="text-gray-700 italic font-medium relative z-10 text-lg leading-relaxed">
              "Değişim vücudun hareketiyle olur, zihnin iyileşmesiyle başlar. Nefesine odaklan ve her harekette güçlendiğini hisset."
            </p>
            <div className="mt-4 pt-4 border-t border-orange-200/50">
              <span className="text-sm text-orange-800 font-semibold block">- Joseph Pilates</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};