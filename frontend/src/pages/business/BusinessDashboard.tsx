import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PhoneCall, Calendar, Clock, BarChart2, Loader2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';

const BusinessDashboard = () => {
  const { user, token } = useAuthStore();
  const [data, setData] = useState({
    calls: [],
    appointments: [],
    stats: { totalCalls: 0, appointmentsCount: 0, handledRate: '0%', afterHours: 0 },
    loading: true
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [callsRes, aptsRes] = await Promise.all([
          api.get('/api/calls', token || undefined),
          api.get('/api/appointments', token || undefined)
        ]);

        if (callsRes.ok && aptsRes.ok) {
          const calls = await callsRes.json();
          const appointments = await aptsRes.json();
          
          setData({
            calls,
            appointments,
            stats: {
              totalCalls: calls.length,
              appointmentsCount: appointments.length,
              handledRate: calls.length > 0 ? `${Math.round((calls.filter((c: any) => c.status === 'completed').length / calls.length) * 100)}%` : '0%',
              afterHours: calls.filter((c: any) => {
                const hour = new Date(c.createdAt).getHours();
                return hour < 9 || hour > 17;
              }).length
            },
            loading: false
          });
        }
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        setData(d => ({ ...d, loading: false }));
      }
    };
    fetchDashboardData();
  }, [token]);

  const stats = [
    { name: 'Total Calls', value: data.stats.totalCalls.toString(), icon: PhoneCall, trend: '+0%' },
    { name: 'Appointments Booked', value: data.stats.appointmentsCount.toString(), icon: Calendar, trend: '+0%' },
    { name: 'AI Handle Rate', value: data.stats.handledRate, icon: BarChart2, trend: '+0%' },
    { name: 'After-Hours Calls', value: data.stats.afterHours.toString(), icon: Clock, trend: '+0%' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.firstName}!</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what your AI Receptionist has been doing today.</p>
      </div>

      {data.loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
          <p className="text-slate-500 font-medium">Analyzing your business data...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                    stat.trend.startsWith('+')
                      ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 dark:text-emerald-400'
                      : 'text-rose-600 bg-rose-50 dark:bg-rose-900/30 dark:text-rose-400'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.name}</h3>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{stat.value}</p>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {data.calls.length === 0 ? (
              <p className="py-8 text-center text-slate-400">No recent calls.</p>
            ) : data.calls.slice(0, 5).map((call: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{call.customerName || call.customerPhone}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{call.summary?.substring(0, 30) || 'Incoming Call'} • {new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${
                  call.status === 'completed'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400'
                }`}>
                  {call.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Upcoming Appointments</h2>
          <div className="space-y-3">
            {data.appointments.length === 0 ? (
              <p className="py-8 text-center text-slate-400">No appointments scheduled.</p>
            ) : data.appointments.slice(0, 5).map((apt: any, index: number) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400">
                    {new Date(apt.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                  <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{apt.time}</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white text-sm">{apt.customerName}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{apt.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDashboard;
