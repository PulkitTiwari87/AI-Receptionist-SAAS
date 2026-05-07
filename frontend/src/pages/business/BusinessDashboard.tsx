import { motion } from 'framer-motion';
import { PhoneCall, Calendar, Clock, BarChart2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const BusinessDashboard = () => {
  const { user } = useAuthStore();

  const stats = [
    { name: 'Calls Today', value: '42', icon: PhoneCall, trend: '+5%' },
    { name: 'Appointments Booked', value: '12', icon: Calendar, trend: '+15%' },
    { name: 'AI Handle Rate', value: '95%', icon: BarChart2, trend: '+2%' },
    { name: 'After-Hours Calls', value: '8', icon: Clock, trend: '-1%' },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome back, {user?.firstName}!</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Here's what your AI Receptionist has been doing today.</p>
      </div>

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
                <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-pink-600 dark:text-pink-400" />
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Calls */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Recent Calls</h2>
          <div className="space-y-3">
            {[
              { caller: '+1 (555) 123-4567', time: '10:42 AM', intent: 'Booking Appointment', status: 'Resolved' },
              { caller: '+1 (555) 987-6543', time: '09:15 AM', intent: 'Pricing Inquiry', status: 'Resolved' },
              { caller: '+1 (555) 456-7890', time: '08:30 AM', intent: 'Reschedule', status: 'Transferred to Staff' },
            ].map((call, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm">{call.caller}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{call.intent} • {call.time}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  call.status === 'Resolved'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
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
            {[
              { client: 'Sarah Johnson', time: '02:00', service: 'Initial Consultation' },
              { client: 'Michael Smith', time: '03:30', service: 'Follow-up' },
              { client: 'Emily Davis', time: '04:15', service: 'Standard Session' },
            ].map((apt, index) => (
              <div key={index} className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold uppercase text-blue-600 dark:text-blue-400">Today</span>
                  <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{apt.time}</span>
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{apt.client}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{apt.service}</p>
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
