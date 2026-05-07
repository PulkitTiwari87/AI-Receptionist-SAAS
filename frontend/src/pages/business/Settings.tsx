import { useState } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../../components/Avatar';
import {
  User, Lock, Bell, Palette, Sun, Moon, Monitor,
  Shield, CheckCircle2, Eye, EyeOff, Save
} from 'lucide-react';

type Tab = 'profile' | 'security' | 'appearance' | 'notifications';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { user, updateUser } = useAuthStore();
  const { mode, setMode } = useThemeStore();

  // Profile state
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    email: user?.email || '', phone: '', company: '', jobTitle: '', bio: '',
    timezone: 'America/New_York',
  });
  const [profileSaved, setProfileSaved] = useState(false);

  // Password state
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showPass, setShowPass] = useState({ current: false, newPass: false, confirm: false });
  const [passError, setPassError] = useState('');
  const [passSaved, setPassSaved] = useState(false);

  // Notifications state
  const [notifications, setNotifications] = useState({
    emailCalls: true, emailAppointments: true, emailWeeklyReport: false,
    smsAlerts: true, pushCalls: true, pushAppointments: true,
  });


  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Persist first/last name changes to the auth store
    updateUser({ firstName: profile.firstName, lastName: profile.lastName, email: profile.email });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    if (passwords.newPass.length < 8) { setPassError('Password must be at least 8 characters.'); return; }
    if (passwords.newPass !== passwords.confirm) { setPassError('Passwords do not match.'); return; }
    setPassSaved(true);
    setPasswords({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPassSaved(false), 3000);
  };

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your profile, security, and preferences.</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              return (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                  }`}>
                  <Icon className="w-4 h-4" /> {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <motion.div key={activeTab} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 overflow-hidden">

            {/* ---- PROFILE TAB ---- */}
            {activeTab === 'profile' && (
              <form onSubmit={handleProfileSave}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Profile Information</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Update your personal details and public information.</p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <Avatar size="xl" editable />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{profile.firstName} {profile.lastName}</p>
                      <p className="text-sm text-slate-500">{user?.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Business Owner'}</p>
                      <p className="text-xs text-slate-400 mt-1">Click the camera icon to upload a photo (max 2MB)</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'First Name', key: 'firstName', placeholder: 'John' },
                      { label: 'Last Name', key: 'lastName', placeholder: 'Doe' },
                    ].map(field => (
                      <div key={field.key}>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{field.label}</label>
                        <input value={(profile as any)[field.key]}
                          onChange={e => setProfile(p => ({ ...p, [field.key]: e.target.value }))}
                          className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white"
                          placeholder={field.placeholder} />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address</label>
                    <input value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} type="email"
                      className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
                      <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white"
                        placeholder="+1 (555) 000-0000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Job Title</label>
                      <input value={profile.jobTitle} onChange={e => setProfile(p => ({ ...p, jobTitle: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white"
                        placeholder="Business Owner" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Timezone</label>
                    <select value={profile.timezone} onChange={e => setProfile(p => ({ ...p, timezone: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm bg-white dark:bg-slate-700 dark:text-white focus:ring-2 focus:ring-blue-300 outline-none">
                      <option value="America/New_York">Eastern Time (US & Canada)</option>
                      <option value="America/Chicago">Central Time (US & Canada)</option>
                      <option value="America/Denver">Mountain Time (US & Canada)</option>
                      <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
                      <option value="Europe/London">London</option>
                      <option value="Asia/Kolkata">India Standard Time</option>
                    </select>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
                  {profileSaved && (
                    <span className="flex items-center gap-2 text-emerald-600 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
                    </span>
                  )}
                  <button type="submit"
                    className="ml-auto flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Save className="w-4 h-4" /> Save Changes
                  </button>
                </div>
              </form>
            )}

            {/* ---- SECURITY TAB ---- */}
            {activeTab === 'security' && (
              <form onSubmit={handlePasswordSave}>
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Security Settings</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your password and account security.</p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Your account is secure</p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Last password change: Never. We recommend changing your password regularly.</p>
                    </div>
                  </div>

                  {[
                    { label: 'Current Password', key: 'current' },
                    { label: 'New Password', key: 'newPass' },
                    { label: 'Confirm New Password', key: 'confirm' },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">{field.label}</label>
                      <div className="relative">
                        <input type={(showPass as any)[field.key] ? 'text' : 'password'}
                          value={(passwords as any)[field.key]}
                          onChange={e => setPasswords(p => ({ ...p, [field.key]: e.target.value }))}
                          className={`w-full px-3 py-2.5 pr-10 border rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white ${passError ? 'border-rose-400 dark:border-rose-600' : 'border-slate-200 dark:border-slate-600'}`}
                          placeholder="••••••••" />
                        <button type="button" onClick={() => setShowPass(s => ({ ...s, [field.key]: !(s as any)[field.key] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {(showPass as any)[field.key] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  ))}

                  {passError && <p className="text-rose-500 text-sm">{passError}</p>}
                  {passSaved && <p className="text-emerald-600 text-sm flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />Password changed successfully!</p>}
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-700">
                  <button type="submit"
                    className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Lock className="w-4 h-4" /> Update Password
                  </button>
                </div>
              </form>
            )}

            {/* ---- APPEARANCE TAB ---- */}
            {activeTab === 'appearance' && (
              <div>
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Appearance</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Customize how your dashboard looks and feels.</p>
                </div>
                <div className="p-6 space-y-8">
                  {/* Theme Mode */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Theme Mode</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: 'light', label: 'Light', icon: Sun },
                        { value: 'dark', label: 'Dark', icon: Moon },
                        { value: 'system', label: 'System', icon: Monitor },
                      ].map(opt => {
                        const Icon = opt.icon;
                        return (
                          <button key={opt.value} onClick={() => setMode(opt.value as any)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                              mode === opt.value
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-slate-200 dark:border-slate-600 hover:border-slate-300'
                            }`}>
                            <Icon className={`w-5 h-5 ${mode === opt.value ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'}`} />
                            <span className={`text-sm font-medium ${mode === opt.value ? 'text-blue-700 dark:text-blue-400' : 'text-slate-600 dark:text-slate-400'}`}>
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>


                </div>
              </div>
            )}

            {/* ---- NOTIFICATIONS TAB ---- */}
            {activeTab === 'notifications' && (
              <div>
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Notification Preferences</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose what you want to be notified about.</p>
                </div>
                <div className="p-6 space-y-6">
                  {[
                    { section: 'Email Notifications', items: [
                      { key: 'emailCalls', label: 'New call summaries', desc: 'Receive a summary after every AI-handled call' },
                      { key: 'emailAppointments', label: 'Appointment confirmations', desc: 'Get notified when the AI books an appointment' },
                      { key: 'emailWeeklyReport', label: 'Weekly analytics report', desc: 'A weekly summary of call volume and performance' },
                    ]},
                    { section: 'Push Notifications', items: [
                      { key: 'pushCalls', label: 'Incoming call alerts', desc: 'Real-time push notification for incoming calls' },
                      { key: 'pushAppointments', label: 'Appointment reminders', desc: 'Get reminded 30 minutes before appointments' },
                    ]},
                    { section: 'SMS Alerts', items: [
                      { key: 'smsAlerts', label: 'Critical alerts via SMS', desc: 'Receive SMS for missed calls and urgent issues' },
                    ]},
                  ].map(section => (
                    <div key={section.section}>
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">{section.section}</h3>
                      <div className="space-y-3">
                        {section.items.map(item => (
                          <div key={item.key} className="flex items-start justify-between gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <div>
                              <p className="text-sm font-medium text-slate-900 dark:text-white">{item.label}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                            </div>
                            <button onClick={() => setNotifications(n => ({ ...n, [item.key]: !(n as any)[item.key] }))}
                              className={`flex-shrink-0 w-11 h-6 rounded-full transition-all relative ${(notifications as any)[item.key] ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-600'}`}>
                              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all ${(notifications as any)[item.key] ? 'left-5' : 'left-0.5'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-6 border-t border-slate-100 dark:border-slate-700">
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                    <Save className="w-4 h-4" /> Save Preferences
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
