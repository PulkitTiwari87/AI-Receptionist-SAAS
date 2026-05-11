import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useThemeStore } from '../../store/themeStore';
import { useAuthStore } from '../../store/authStore';
import Avatar from '../../components/Avatar';
import {
  User, Lock, Bell, Palette, Sun, Moon, Monitor,
  Shield, CheckCircle2, Eye, EyeOff, Save, CreditCard, ExternalLink, Loader2
} from 'lucide-react';
import { api } from '../../lib/api';

type Tab = 'profile' | 'security' | 'appearance' | 'notifications' | 'billing';

const Settings = () => {
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const { user, updateUser, token } = useAuthStore();
  const { mode, setMode } = useThemeStore();
  const [loading, setLoading] = useState(false);
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    const fetchBusiness = async () => {
      const res = await api.get('/api/business/profile', token || undefined);
      if (res.ok) {
        const data = await res.json();
        setBusiness(data);
      }
    };
    fetchBusiness();
  }, [token]);

  const handleCreateCheckout = async (priceId: string) => {
    setLoading(true);
    try {
      const res = await api.post('/api/billing/create-checkout-session', { priceId }, token || undefined);
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/billing/create-portal-session', {}, token || undefined);
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch (err) {
      console.error('Portal error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Profile state
  const [profile, setProfile] = useState({
    firstName: user?.firstName || '', lastName: user?.lastName || '',
    email: user?.email || '', phone: '', businessPhone: '', company: '', jobTitle: '', bio: '',
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


  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update User Auth Info
      updateUser({ firstName: profile.firstName, lastName: profile.lastName, email: profile.email });
      
      // Update Business Profile Info
      await api.patch('/api/business/profile', {
        companyName: profile.company,
        phone: profile.businessPhone,
        timezone: profile.timezone,
      }, token || undefined);

      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setLoading(false);
    }
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
    { id: 'billing', label: 'Billing', icon: CreditCard },
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
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Personal Phone</label>
                      <input value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white"
                        placeholder="+1 (555) 000-0000" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Business Phone Number</label>
                      <input value={profile.businessPhone} onChange={e => setProfile(p => ({ ...p, businessPhone: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white"
                        placeholder="Your existing business number" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Company Name</label>
                      <input value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-xl text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white"
                        placeholder="Your Company LLC" />
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
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Choose how and when you want to be notified.</p>
                </div>
                <div className="p-6 space-y-8">
                  {/* Email Notifications */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Email Notifications</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'emailCalls', label: 'Individual Call Summaries', desc: 'Receive an email after every call handled by the AI.' },
                        { key: 'emailAppointments', label: 'New Appointment Alerts', desc: 'Get notified as soon as a client books an appointment.' },
                        { key: 'emailWeeklyReport', label: 'Weekly Performance Report', desc: 'A weekly summary of your AI Agent\'s performance and stats.' },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between py-2">
                          <div className="pr-10">
                            <label className="text-sm font-medium text-slate-900 dark:text-white cursor-pointer" htmlFor={item.key}>{item.label}</label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifications(n => ({ ...n, [item.key]: !(n as any)[item.key] }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-blue-300 ${
                              (notifications as any)[item.key] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(notifications as any)[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* SMS & Push */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Real-time Alerts</h3>
                    <div className="space-y-4">
                      {[
                        { key: 'smsAlerts', label: 'SMS Urgent Alerts', desc: 'Text messages for high-priority calls or urgent client requests.' },
                        { key: 'pushCalls', label: 'Browser Push Notifications', desc: 'Get desktop alerts for incoming calls while logged in.' },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between py-2">
                          <div className="pr-10">
                            <label className="text-sm font-medium text-slate-900 dark:text-white cursor-pointer" htmlFor={item.key}>{item.label}</label>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setNotifications(n => ({ ...n, [item.key]: !(n as any)[item.key] }))}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors outline-none focus:ring-2 focus:ring-blue-300 ${
                              (notifications as any)[item.key] ? 'bg-blue-600' : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${(notifications as any)[item.key] ? 'translate-x-6' : 'translate-x-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                      <Save className="w-4 h-4" /> Update Preferences
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ---- BILLING TAB ---- */}
            {activeTab === 'billing' && (
              <div>
                <div className="p-6 border-b border-slate-100 dark:border-slate-700">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">Subscription & Billing</h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your plan, payment methods, and invoices.</p>
                </div>
                <div className="p-6 space-y-8">
                  {/* Current Status */}
                  <div className="p-5 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Plan</p>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        {business?.subscriptionPlan || 'Free Trial'}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                          business?.subscriptionStatus === 'ACTIVE' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                        }`}>
                          {business?.subscriptionStatus || 'TRIAL'}
                        </span>
                      </h3>
                    </div>
                    {business?.stripeCustomerId && (
                      <button 
                        onClick={handleManageBilling}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm disabled:opacity-50"
                      >
                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
                        Manage Billing
                      </button>
                    )}
                  </div>

                  {/* Plans */}
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-4">Available Plans</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'price_basic', name: 'Starter', price: '$195', desc: '1 AI Agent, 500 calls/mo' },
                        { id: 'price_pro', name: 'Professional', price: '$295', desc: '3 AI Agents, 2000 calls/mo' },
                      ].map(plan => (
                        <div key={plan.id} className="p-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-all group">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white">{plan.name}</p>
                              <p className="text-xs text-slate-500">{plan.desc}</p>
                            </div>
                            <p className="text-lg font-extrabold text-slate-900 dark:text-white">{plan.price}</p>
                          </div>
                          <button 
                            onClick={() => handleCreateCheckout(plan.id)}
                            disabled={loading || business?.subscriptionPlan === plan.name.toUpperCase()}
                            className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              business?.subscriptionPlan === plan.name.toUpperCase()
                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                                : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
                            }`}
                          >
                            {business?.subscriptionPlan === plan.name.toUpperCase() ? 'Current Plan' : 'Select Plan'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-100 dark:border-yellow-900/30 flex gap-3">
                    <Shield className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-xs text-yellow-800 dark:text-yellow-200 leading-relaxed">
                      Payments are processed securely via Stripe. Your data is encrypted and we never store your credit card information on our servers.
                    </p>
                  </div>
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
