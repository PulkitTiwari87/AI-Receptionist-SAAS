import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Search, Filter, Clock, Download } from 'lucide-react';

interface CallLog {
  id: number;
  caller: string;
  phone: string;
  direction: 'inbound' | 'outbound' | 'missed';
  intent: string;
  duration: string;
  outcome: string;
  time: string;
  date: string;
  transcript: string;
}

const mockCalls: CallLog[] = [
  { id: 1, caller: 'Sarah Johnson', phone: '+1 (555) 123-4567', direction: 'inbound', intent: 'Book Appointment', duration: '2m 14s', outcome: 'Appointment Booked', time: '10:42 AM', date: '2026-05-06', transcript: 'Caller asked to schedule a chiropractic appointment. AI successfully booked slot for Thursday 2PM.' },
  { id: 2, caller: 'Michael Smith', phone: '+1 (555) 987-6543', direction: 'inbound', intent: 'Pricing Inquiry', duration: '1m 45s', outcome: 'Resolved', time: '09:15 AM', date: '2026-05-06', transcript: 'Caller asked about service pricing. AI provided full pricing breakdown.' },
  { id: 3, caller: 'Unknown', phone: '+1 (555) 456-7890', direction: 'missed', intent: 'N/A', duration: '0s', outcome: 'Missed', time: '08:30 AM', date: '2026-05-06', transcript: '' },
  { id: 4, caller: 'Emily Davis', phone: '+1 (555) 234-5678', direction: 'inbound', intent: 'Reschedule', duration: '3m 02s', outcome: 'Transferred to Staff', time: '04:10 PM', date: '2026-05-05', transcript: 'Caller requested to reschedule. AI transferred to front desk staff for manual handling.' },
  { id: 5, caller: 'David Lee', phone: '+1 (555) 876-5432', direction: 'inbound', intent: 'After-hours Inquiry', duration: '1m 55s', outcome: 'Appointment Booked', time: '07:45 PM', date: '2026-05-05', transcript: 'After-hours call handled by AI. Caller wanted to know about weekend hours and booked a Monday slot.' },
  { id: 6, caller: 'Laura Chen', phone: '+1 (555) 321-9876', direction: 'inbound', intent: 'FAQs / Insurance', duration: '4m 20s', outcome: 'Resolved', time: '02:30 PM', date: '2026-05-04', transcript: 'Caller had questions about insurance coverage. AI explained accepted providers.' },
];

const CallLogs = () => {
  const [search, setSearch] = useState('');
  const [directionFilter, setDirectionFilter] = useState('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const directionIcon = (dir: string) => {
    if (dir === 'inbound') return <PhoneIncoming className="w-4 h-4 text-emerald-500" />;
    if (dir === 'outbound') return <PhoneOutgoing className="w-4 h-4 text-blue-500" />;
    return <PhoneMissed className="w-4 h-4 text-rose-500" />;
  };

  const outcomeStyle = (outcome: string) => {
    if (outcome.includes('Booked')) return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
    if (outcome === 'Resolved') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    if (outcome === 'Missed') return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
    return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
  };

  const filtered = mockCalls.filter(c => {
    const matchSearch = c.caller.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) || c.intent.toLowerCase().includes(search.toLowerCase());
    const matchDir = directionFilter === 'All' || c.direction === directionFilter.toLowerCase();
    return matchSearch && matchDir;
  });

  const stats = [
    { label: 'Total Calls', value: mockCalls.length, icon: Phone, color: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30' },
    { label: 'AI Resolved', value: mockCalls.filter(c => c.outcome === 'Resolved' || c.outcome === 'Appointment Booked').length, icon: PhoneIncoming, color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30' },
    { label: 'Missed Calls', value: mockCalls.filter(c => c.direction === 'missed').length, icon: PhoneMissed, color: 'text-rose-600 bg-rose-100 dark:bg-rose-900/30' },
    { label: 'Avg Duration', value: '2m 36s', icon: Clock, color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' },
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
          <select value={directionFilter} onChange={e => setDirectionFilter(e.target.value)}
            className="pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-800 dark:border-slate-700 dark:text-white">
            {['All', 'Inbound', 'Outbound', 'Missed'].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Calls list */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 dark:text-slate-500">No calls found.</div>
        ) : filtered.map((call, i) => (
          <div key={call.id}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
              onClick={() => setExpandedId(expandedId === call.id ? null : call.id)}
              className="flex items-center gap-4 px-6 py-4 border-b border-slate-100 dark:border-slate-700 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                {directionIcon(call.direction)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{call.caller}</p>
                <p className="text-xs text-slate-400 truncate">{call.phone} · {call.intent}</p>
              </div>
              <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
                <Clock className="w-3 h-3" /> {call.duration}
              </div>
              <div className="text-xs text-slate-400 hidden md:block">{call.date} {call.time}</div>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${outcomeStyle(call.outcome)}`}>
                {call.outcome}
              </span>
            </motion.div>
            {expandedId === call.id && call.transcript && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="px-6 py-4 bg-slate-50 dark:bg-slate-900/40 border-b border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">AI Call Summary</p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{call.transcript}</p>
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CallLogs;
