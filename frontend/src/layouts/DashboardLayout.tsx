import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import Avatar from '../components/Avatar';
import {
  LayoutDashboard, Users, Settings, LogOut, BookOpen,
  Calendar, PhoneCall, ChevronDown, Sun, Moon
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const accentMap: Record<string, string> = {
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  purple: 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  rose: 'bg-rose-50 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
};

const DashboardLayout = () => {
  const { user, logout } = useAuthStore();
  const { mode, accent, setMode } = useThemeStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [profileOpen, setProfileOpen] = useState(false);

  const adminNav = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Businesses', path: '/admin/businesses', icon: Users },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  const businessNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Call Logs', path: '/dashboard/calls', icon: PhoneCall },
    { name: 'Appointments', path: '/dashboard/appointments', icon: Calendar },
    { name: 'Knowledge Base', path: '/dashboard/knowledge-base', icon: BookOpen },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const navigation = user?.role === 'SUPER_ADMIN' ? adminNav : businessNav;
  const activeAccent = accentMap[accent] || accentMap.blue;

  const isActive = (path: string) =>
    location.pathname === path || (path !== '/dashboard' && path !== '/admin' && location.pathname.startsWith(path));

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const pageName = (() => {
    const seg = location.pathname.split('/').filter(Boolean);
    const last = seg[seg.length - 1];
    if (!last || last === 'dashboard' || last === 'admin') return 'Dashboard';
    return last.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  })();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col flex-shrink-0">
        {/* Logo */}
        <Link to="/" className="h-16 flex items-center px-6 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center mr-3 shadow-sm">
            <PhoneCall className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-sm">ReceptionistAI</span>
          {user?.role === 'SUPER_ADMIN' && (
            <span className="ml-auto text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full font-semibold">Admin</span>
          )}
        </Link>

        {/* Nav */}
        <div className="flex-1 py-5 px-3 space-y-1 overflow-y-auto">
          {navigation.map(item => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <Link key={item.name} to={item.path}
                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active ? activeAccent : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-white'
                }`}>
                <Icon className={`w-5 h-5 mr-3 flex-shrink-0 ${active ? '' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* User profile */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-700">
          <div className="relative">
            <button onClick={() => setProfileOpen(!profileOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <Avatar size="sm" />
              <div className="flex-1 text-left min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user?.firstName} {user?.lastName}</p>
                <p className="text-xs text-slate-400 truncate">{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Business Owner'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {profileOpen && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden z-20">
                  <Link to={user?.role === 'SUPER_ADMIN' ? '/admin/settings' : '/dashboard/settings'}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    <Settings className="w-4 h-4 text-slate-400" /> Settings & Profile
                  </Link>
                  <button onClick={() => { setMode(mode === 'dark' ? 'light' : 'dark'); setProfileOpen(false); }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                    {mode === 'dark' ? <Sun className="w-4 h-4 text-slate-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
                    {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  <div className="border-t border-slate-100 dark:border-slate-700" />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors">
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center px-8">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">{pageName}</h1>
        </header>
        <div className="flex-1 overflow-auto p-6 lg:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
