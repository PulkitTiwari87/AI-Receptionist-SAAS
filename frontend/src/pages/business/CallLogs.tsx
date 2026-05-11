import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneIncoming, PhoneMissed, Search, Filter, Clock, Download, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

interface CallLog {
  _id: string;
  customerPhone: string;
  customerName?: string;
  duration: number;
  status: string;
  transcript?: string;
  summary?: string;
  sentiment?: string;
  recordingUrl?: string;
  createdAt: string;
}

const CallLogs = () => {
  const { token } = useAuthStore();
  const [calls, setCalls] = useState<CallLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalls = async () => {
      try {
        const res = await api.get('/api/calls', token || undefined);
        if (res.ok) {
          const data = await res.json();
          setCalls(data);
        }
      } catch (err) {
        console.error('Failed to fetch call logs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCalls();
  }, [token]);

  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const outcomeStyle = (outcome: string) => {
    if (outcome.includes('Booked')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (outcome === 'Resolved') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    if (outcome === 'Missed') return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  };

  const filtered = calls.filter(c => {
    const matchSearch = (c.customerName || '').toLowerCase().includes(search.toLowerCase()) ||
      c.customerPhone.includes(search) || (c.summary || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || c.status === statusFilter.toLowerCase();
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: 'Total Calls', value: calls.length, icon: Phone, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    { label: 'Completed', value: calls.filter(c => c.status === 'completed').length, icon: PhoneIncoming, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Missed', value: calls.filter(c => c.status === 'missed').length, icon: PhoneMissed, color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30' },
    { label: 'Avg Duration', value: formatDuration(calls.length > 0 ? calls.reduce((acc, c) => acc + c.duration, 0) / calls.length : 0), icon: Clock, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Call Logs</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Review all calls handled by your AI Receptionist.</p>
        </div>
        <button className="flex items-center gap-2 text-sm font-medium border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5">
              <div className={`w-10 h-10 rounded-xl ${s.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white"
            placeholder="Search caller, intent..." />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white capitalize">
            {['All', 'completed', 'missed', 'transferred', 'voicemail'].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Calls list */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        {loading ? (
          <div className="py-24 flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-slate-500">Loading call logs...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500">No calls found.</div>
        ) : filtered.map((call, i) => (
          <div key={call._id}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              onClick={() => setExpandedId(expandedId === call._id ? null : call._id)}
              className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                {call.status === 'completed' ? <PhoneIncoming className="w-4 h-4 text-emerald-500" /> : <PhoneMissed className="w-4 h-4 text-rose-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{call.customerName || 'Unknown Caller'}</p>
                <p className="text-xs text-slate-400 truncate">{call.customerPhone} · {call.summary || 'No summary'}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" /> {formatDuration(call.duration)}
              </div>
              <div className="text-xs text-slate-400 hidden md:block">{new Date(call.createdAt).toLocaleString()}</div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 capitalize ${outcomeStyle(call.status)}`}>
                {call.status}
              </span>
            </motion.div>
            {expandedId === call._id && (call.transcript || call.summary) && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {call.summary && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">AI Summary</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{call.summary}</p>
                    </div>
                  )}
                  {call.transcript && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Transcript Snippet</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">"{call.transcript.substring(0, 200)}..."</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallLogs;
