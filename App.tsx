import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, BarChart3, Calendar as CalendarIcon, Home, Loader2, AlertCircle, RefreshCw
} from 'lucide-react';
import { Session } from './types';
import { sessionService } from './services/sessionService';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { Reports } from './components/Reports';
import { AddScheduleModal } from './components/AddScheduleModal';
import { SessionDetailModal } from './components/SessionDetailModal';

export default function App() {
  const [view, setView] = useState<'dashboard' | 'calendar' | 'reports'>('dashboard');
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await sessionService.getAll();
      setSessions(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Bağlantı hatası.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdate = async (updated: Session) => {
    try {
      await sessionService.update(updated);
      setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
    } catch (err) {
      alert("Güncellenirken bir hata oluştu.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await sessionService.delete(id);
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("Silinirken bir hata oluştu.");
    }
  };

  const handleAdd = async (newOnes: any[]) => {
    try {
      await sessionService.createBulk(newOnes);
      await fetchData();
    } catch (err) {
      alert("Eklenirken bir hata oluştu.");
    }
  };

  if (loading && sessions.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-pilates-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Veritabanına bağlanılıyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('dashboard')}>
            <div className="w-10 h-10 bg-pilates-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-pilates-200">
              <LayoutGrid size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">Pilates<span className="text-pilates-600">Takip</span></h1>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 bg-slate-100 p-1 rounded-xl">
            <NavItem active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<Home size={18} />} label="Ana Sayfa" />
            <NavItem active={view === 'calendar'} onClick={() => setView('calendar')} icon={<CalendarIcon size={18} />} label="Takvim" />
            <NavItem active={view === 'reports'} onClick={() => setView('reports')} icon={<BarChart3 size={18} />} label="Raporlar" />
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center">
            <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
            <h3 className="text-red-800 font-bold text-lg">Bağlantı Sorunu</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchData} className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
              <RefreshCw size={18} /> Yeniden Dene
            </button>
          </div>
        ) : (
          <>
            {view === 'dashboard' && <Dashboard sessions={sessions} onNavigate={setView} onSessionClick={setSelectedSession} />}
            {view === 'calendar' && <CalendarView sessions={sessions} onSessionClick={setSelectedSession} onOpenAdd={() => setIsAddModalOpen(true)} />}
            {view === 'reports' && <Reports sessions={sessions} />}
          </>
        )}
      </main>

      {/* Modals */}
      <AddScheduleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAdd} />
      <SessionDetailModal 
        session={selectedSession} 
        isOpen={!!selectedSession} 
        onClose={() => setSelectedSession(null)} 
        onUpdate={handleUpdate} 
        onDelete={handleDelete} 
      />
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${active ? 'bg-white text-pilates-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
    >
      {icon} <span className="hidden md:inline">{label}</span>
    </button>
  );
}