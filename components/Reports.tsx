import React, { useMemo, useState } from 'react';
import { Session, SessionStatus } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { STATUS_LABELS, MONTH_NAMES } from '../constants';
import { parseDateISO } from '../utils/dateHelper';
import { Filter } from 'lucide-react';

interface ReportsProps {
  sessions: Session[];
}

export const Reports: React.FC<ReportsProps> = ({ sessions }) => {
  const [filterMonth, setFilterMonth] = useState<string>('all'); // 'all' or '2024-1'

  // Extract available months for dropdown
  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    sessions.forEach(s => {
      const d = parseDateISO(s.date);
      months.add(`${d.getFullYear()}-${d.getMonth()}`);
    });
    // Sort reverse chronological
    return Array.from(months).sort().reverse().map(m => {
      const [year, monthIndex] = m.split('-').map(Number);
      return {
        value: m,
        label: `${MONTH_NAMES[monthIndex]} ${year}`
      };
    });
  }, [sessions]);

  // Filter sessions based on selection
  const filteredSessions = useMemo(() => {
    if (filterMonth === 'all') return sessions;
    const [year, month] = filterMonth.split('-').map(Number);
    return sessions.filter(s => {
      const d = parseDateISO(s.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [sessions, filterMonth]);
  
  const stats = useMemo(() => {
    const total = filteredSessions.length;
    const attended = filteredSessions.filter(s => s.status === SessionStatus.ATTENDED).length;
    const missed = filteredSessions.filter(s => s.status === SessionStatus.MISSED).length;
    const cancelled = filteredSessions.filter(s => s.status === SessionStatus.INSTRUCTOR_CANCELLED).length;
    const scheduled = filteredSessions.filter(s => s.status === SessionStatus.SCHEDULED).length;
    
    // Attendance rate excludes future scheduled classes from denominator if looking at history
    const pastSessions = attended + missed + cancelled;
    const rate = pastSessions > 0 ? Math.round((attended / pastSessions) * 100) : 0;

    return { total, attended, missed, cancelled, scheduled, rate };
  }, [filteredSessions]);

  const pieData = [
    { name: STATUS_LABELS[SessionStatus.ATTENDED], value: stats.attended, color: '#22c55e' }, // Green
    { name: STATUS_LABELS[SessionStatus.MISSED], value: stats.missed, color: '#ef4444' }, // Red
    { name: STATUS_LABELS[SessionStatus.INSTRUCTOR_CANCELLED], value: stats.cancelled, color: '#f97316' }, // Orange
    { name: STATUS_LABELS[SessionStatus.SCHEDULED], value: stats.scheduled, color: '#94a3b8' }, // Slate
  ].filter(d => d.value > 0);

  // Monthly Activity - Always show trend for context, or just for selected month
  // If 'all' is selected, show trend. If month selected, maybe show daily breakdown? 
  // For simplicity, let's keep the bar chart showing the history trend regardless of filter, 
  // OR show only the selected month. Let's keep it showing the Trend based on ALL sessions to provide context.
  const historyData = useMemo(() => {
    // We use 'sessions' (all) instead of 'filteredSessions' here to show context 
    // unless user specifically wants to filter chart. 
    // Let's allow the chart to reflect the filter if it's 'all', otherwise it shows just that month (1 bar).
    // Actually, usually charts show trends. Let's stick to showing the last 6 months trend always.
    
    const data: Record<string, { name: string, attended: number, total: number }> = {};
    
    // Use ALL sessions for the bar chart context
    sessions.forEach(s => {
      const d = parseDateISO(s.date);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!data[key]) {
        data[key] = { 
          name: `${MONTH_NAMES[d.getMonth()]}`, 
          attended: 0, 
          total: 0 
        };
      }
      data[key].total += 1;
      if (s.status === SessionStatus.ATTENDED) {
        data[key].attended += 1;
      }
    });

    return Object.values(data).sort((a,b) => {
        // Simple hacky sort by month index in name isn't great if years differ, 
        // but the object values insertion order usually preserves date order if inserted sequentially.
        // Let's just take the slice.
        return 0;
    }).slice(-6); 
  }, [sessions]);

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
           Raporlar & İstatistikler
        </h2>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter size={18} className="text-gray-400" />
          <select 
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-pilates-500 focus:border-pilates-500 block w-full sm:w-48 p-2.5 outline-none"
          >
            <option value="all">Tüm Zamanlar</option>
            {availableMonths.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">{stats.total}</span>
          <span className="text-sm text-gray-500">Toplam Ders</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-green-600">{stats.attended}</span>
          <span className="text-sm text-gray-500">Katılım</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-red-500">{stats.missed}</span>
          <span className="text-sm text-gray-500">Gidilmeyen</span>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-pilates-600">%{stats.rate}</span>
          <span className="text-sm text-gray-500">Katılım Oranı</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[350px]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
             {filterMonth === 'all' ? 'Genel' : 'Seçili Ay'} Durum Dağılımı
          </h3>
          {pieData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">Bu aralıkta veri yok</div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[350px]">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Genel Aylık Trend (Son 6 Ay)</h3>
          {historyData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={historyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: '#f8fafc'}}
                    contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  />
                  <Bar dataKey="total" name="Toplam" fill="#e2e8f0" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="attended" name="Katılım" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">Veri yok</div>
          )}
        </div>
      </div>
    </div>
  );
};