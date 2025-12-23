
import React, { useState, useEffect } from 'react';
import { 
  LayoutGrid, BarChart3, Calendar as CalendarIcon, Home, Loader2, AlertCircle, RefreshCw, Users, Plus, UserPlus
} from 'lucide-react';
import { Session, Athlete } from './types';
import { sessionService } from './services/sessionService';
import { athleteService } from './services/athleteService';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { Reports } from './components/Reports';
import { AddScheduleModal } from './components/AddScheduleModal';
import { SessionDetailModal } from './components/SessionDetailModal';
import { Modal } from './components/Modal';

export default function App() {
  const [view, setView] = useState<'dashboard' | 'calendar' | 'reports'>('dashboard');
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAthleteModalOpen, setIsAthleteModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [newAthleteName, setNewAthleteName] = useState('');

  // İlk yükleme: Sporcuları getir
  const loadInitialData = async () => {
    setLoading(true);
    try {
      const athleteList = await athleteService.getAll();
      setAthletes(athleteList);
      if (athleteList.length > 0) {
        setSelectedAthlete(athleteList[0]);
      }
      setError(null);
    } catch (err: any) {
      setError("Bağlantı hatası: Sporcular yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  // Seçili sporcu değişince dersleri yükle
  useEffect(() => {
    if (selectedAthlete) {
      fetchSessions();
    } else {
      setSessions([]);
    }
  }, [selectedAthlete]);

  const fetchSessions = async () => {
    if (!selectedAthlete) return;
    try {
      const data = await sessionService.getByAthlete(selectedAthlete.id);
      setSessions(data);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleAddAthlete = async () => {
    if (!newAthleteName.trim()) return;
    try {
      const created = await athleteService.create(newAthleteName);
      setAthletes(prev => [...prev, created]);
      setSelectedAthlete(created);
      setNewAthleteName('');
      setIsAthleteModalOpen(false);
    } catch (err) {
      alert("Sporcu eklenirken hata oluştu.");
    }
  };

  const handleDeleteAthlete = async (id: string) => {
    if (!confirm("Sporcuyu ve tüm derslerini silmek istediğinize emin misiniz?")) return;
    try {
      await athleteService.delete(id);
      const remaining = athletes.filter(a => a.id !== id);
      setAthletes(remaining);
      setSelectedAthlete(remaining.length > 0 ? remaining[0] : null);
    } catch (err) {
      alert("Sporcu silinemedi.");
    }
  };

  const handleUpdateSession = async (updated: Session) => {
    try {
      await sessionService.update(updated);
      setSessions(prev => prev.map(s => s.id === updated.id ? updated : s));
    } catch (err) {
      alert("Güncelleme hatası.");
    }
  };

  const handleDeleteSession = async (id: string) => {
    try {
      await sessionService.delete(id);
      setSessions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      alert("Silme hatası.");
    }
  };

  const handleAddSessions = async (newOnes: any[]) => {
    if (!selectedAthlete) return;
    try {
      await sessionService.createBulk(selectedAthlete.id, newOnes);
      await fetchSessions();
    } catch (err) {
      alert("Program ekleme hatası.");
    }
  };

  if (loading && athletes.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-pilates-600 mb-4" size={40} />
        <p className="text-slate-500 font-medium">Veriler Yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer flex-shrink-0" onClick={() => setView('dashboard')}>
            <div className="w-10 h-10 bg-pilates-600 rounded-xl flex items-center justify-center text-white shadow-lg">
              <LayoutGrid size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight hidden sm:block">Pilates<span className="text-pilates-600">Takip</span></h1>
          </div>

          {/* Sporcu Seçici */}
          <div className="flex-1 max-w-xs">
            <div className="relative group">
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                value={selectedAthlete?.id || ''}
                onChange={(e) => {
                  const athlete = athletes.find(a => a.id === e.target.value);
                  if (athlete) setSelectedAthlete(athlete);
                }}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-sm font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-pilates-500 appearance-none cursor-pointer"
              >
                {athletes.length === 0 && <option value="">Sporcu Yok</option>}
                {athletes.map(a => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
              <button 
                onClick={() => setIsAthleteModalOpen(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-pilates-600 hover:bg-white rounded-lg transition-colors"
                title="Yeni Sporcu Ekle"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <NavItem active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<Home size={18} />} label="Ana Sayfa" />
            <NavItem active={view === 'calendar'} onClick={() => setView('calendar')} icon={<CalendarIcon size={18} />} label="Takvim" />
            <NavItem active={view === 'reports'} onClick={() => setView('reports')} icon={<BarChart3 size={18} />} label="Raporlar" />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-8">
        {error ? (
          <div className="bg-red-50 border border-red-200 p-6 rounded-2xl text-center">
            <AlertCircle className="text-red-500 mx-auto mb-3" size={32} />
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={loadInitialData} className="bg-red-600 text-white px-4 py-2 rounded-lg">Tekrar Dene</button>
          </div>
        ) : !selectedAthlete ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <Users size={40} />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Henüz Sporcu Yok</h2>
            <p className="text-slate-500 mb-6 max-w-md">Programları takip edebilmek için önce bir sporcu eklemelisiniz.</p>
            <button 
              onClick={() => setIsAthleteModalOpen(true)}
              className="bg-pilates-600 text-white px-8 py-3 rounded-2xl font-bold shadow-lg flex items-center gap-2"
            >
              <UserPlus size={20} /> İlk Sporcuyu Ekle
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

      {/* Modal: Sporcu Ekleme */}
      <Modal isOpen={isAthleteModalOpen} onClose={() => setIsAthleteModalOpen(false)} title="Yeni Sporcu Ekle">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Sporcu Adı Soyadı</label>
            <input 
              type="text" 
              value={newAthleteName}
              onChange={(e) => setNewAthleteName(e.target.value)}
              placeholder="Örn: Ayşe Yılmaz"
              className="w-full p-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-pilates-500"
              autoFocus
            />
          </div>
          <div className="flex justify-between items-center gap-3 pt-2">
            {selectedAthlete && (
              <button 
                onClick={() => handleDeleteAthlete(selectedAthlete.id)}
                className="text-red-500 text-sm font-bold hover:underline"
              >
                Mevcut Sporcuyu Sil
              </button>
            )}
            <div className="flex gap-2 ml-auto">
              <button onClick={() => setIsAthleteModalOpen(false)} className="px-4 py-2 text-slate-500 font-bold">Vazgeç</button>
              <button onClick={handleAddAthlete} className="px-6 py-2 bg-pilates-600 text-white rounded-xl font-bold">Kaydet</button>
            </div>
          </div>
        </div>
      </Modal>

      <AddScheduleModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddSessions} />
      <SessionDetailModal 
        session={selectedSession} 
        isOpen={!!selectedSession} 
        onClose={() => setSelectedSession(null)} 
        onUpdate={handleUpdateSession} 
        onDelete={handleDeleteSession} 
      />
    </div>
  );
}

function NavItem({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-white text-pilates-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
    >
      {icon} <span className="hidden md:inline">{label}</span>
    </button>
  );
}
