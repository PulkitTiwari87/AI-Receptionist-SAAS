import { motion } from 'framer-motion';
import { Users, Building2, TrendingUp, PhoneCall } from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    { name: 'Total Businesses', value: '142', icon: Building2, trend: '+12%' },
    { name: 'Active AI Agents', value: '138', icon: PhoneCall, trend: '+8%' },
    { name: 'Monthly Revenue', value: '$42,500', icon: TrendingUp, trend: '+15%' },
    { name: 'Total Calls Handled', value: '12,450', icon: Users, trend: '+22%' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 bg-pastel-blue rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-blue-900" />
                </div>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  {stat.trend}
                </span>
              </div>
              <h3 className="text-sm font-medium text-slate-500">{stat.name}</h3>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Client Signups</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="py-3 px-4 text-sm font-medium text-slate-500">Business Name</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500">Industry</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500">Plan</th>
                <th className="py-3 px-4 text-sm font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Elite Chiropractic', industry: 'Chiropractor', plan: 'PRO', status: 'ACTIVE' },
                { name: 'Sunrise Real Estate', industry: 'Real Estate', plan: 'BASIC', status: 'TRIAL' },
                { name: 'The Golden Spoon', industry: 'Restaurant', plan: 'ENTERPRISE', status: 'ACTIVE' },
              ].map((client, index) => (
                <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50">
                  <td className="py-3 px-4 text-sm font-medium text-slate-900">{client.name}</td>
                  <td className="py-3 px-4 text-sm text-slate-600">{client.industry}</td>
                  <td className="py-3 px-4">
                    <span className="text-xs font-medium bg-pastel-purple text-purple-900 px-2 py-1 rounded-full">
                      {client.plan}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      client.status === 'ACTIVE' ? 'bg-pastel-green text-green-900' : 'bg-pastel-yellow text-yellow-900'
                    }`}>
                      {client.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
