import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Calendar as CalendarIcon, Clock, Search, Filter, Trash2, Loader2 } from 'lucide-react';
import AddAppointmentModal from '../../components/AddAppointmentModal';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

interface Appointment {
  _id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
}

const Appointments = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuthStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await api.get('/api/appointments', token || undefined);
        if (res.ok) {
          const data = await res.json();
          setAppointments(data);
        }
      } catch (err) {
        console.error('Failed to fetch appointments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [token]);

  const handleAdd = (apt: Appointment) => setAppointments(prev => [apt, ...prev]);
  
  const handleDelete = async (id: string) => {
    try {
      const res = await api.delete(`/api/appointments/${id}`, token || undefined);
      if (res.ok) {
        setAppointments(prev => prev.filter(a => a._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete appointment:', err);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const res = await api.patch(`/api/appointments/${id}`, { status }, token || undefined);
      if (res.ok) {
        setAppointments(prev => prev.map(a => a._id === id ? { ...a, status } : a));
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const filtered = appointments.filter(a => {
    const matchSearch = (a.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      (a.type || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statusConfig: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    completed: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    cancelled: 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
    'no-show': 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
  };

  return (
    <div className="space-y-6">
      <AddAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAdd} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Appointments</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your schedule and AI-booked appointments.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-none">
          <Plus className="w-4 h-4" /> New Appointment
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total', count: appointments.length, color: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200' },
          { label: 'Scheduled', count: appointments.filter(a => a.status === 'scheduled').length, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' },
          { label: 'Completed', count: appointments.filter(a => a.status === 'completed').length, color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' },
          { label: 'Cancelled', count: appointments.filter(a => a.status === 'cancelled').length, color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300' },
        ].map((s) => (
          <div key={s.label} className={`p-4 rounded-xl ${s.color} flex items-center justify-between`}>
            <span className="text-sm font-medium">{s.label}</span>
            <span className="text-2xl font-bold">{s.count}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            placeholder="Search by client or service..." />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white">
            {['All', 'scheduled', 'completed', 'cancelled', 'no-show'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date & Time</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Service</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-16 text-center text-slate-400 dark:text-slate-500">
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                    <p>Loading appointments...</p>
                  </div>
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} className="py-16 text-center text-slate-400 dark:text-slate-500">No appointments found.</td></tr>
              ) : filtered.map((apt, i) => (
                <motion.tr key={apt._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  className="border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {apt.customerName[0]}
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white text-sm">{apt.customerName}</p>
                        <p className="text-xs text-slate-400">{apt.customerPhone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CalendarIcon className="w-4 h-4 text-slate-400" /> {new Date(apt.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mt-1">
                      <Clock className="w-4 h-4 text-slate-400" /> {apt.time}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-sm text-slate-600 dark:text-slate-400">{apt.type}</td>
                  <td className="py-4 px-6">
                    <select value={apt.status}
                      onChange={e => handleStatusChange(apt._id, e.target.value)}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border-0 cursor-pointer ${statusConfig[apt.status] || 'bg-slate-100'} focus:ring-2 focus:ring-blue-300 outline-none capitalize`}>
                      {['scheduled', 'completed', 'cancelled', 'no-show'].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button onClick={() => handleDelete(apt._id)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
