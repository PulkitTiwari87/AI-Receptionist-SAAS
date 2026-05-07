import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Phone, Calendar, Globe, Shield, Zap, CheckCircle2, 
  ChevronRight, Star, Building2, Stethoscope, UtensilsCrossed, Menu, X
} from 'lucide-react';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6 } }),
};

const Landing = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const features = [
    { icon: Phone, title: 'AI Voice Receptionist', desc: 'Answers every call 24/7, speaks naturally, and handles inquiries just like a real receptionist — powered by RetellAI.' },
    { icon: Calendar, title: 'Smart Appointment Booking', desc: 'Automatically schedules, confirms, and sends reminders. Syncs with Google Calendar in real time.' },
    { icon: Globe, title: 'Multi-Language Support', desc: 'Your AI speaks the language of your customers. Support for dozens of languages out of the box for global reach.' },
    { icon: Shield, title: 'Editable Knowledge Base', desc: 'Business owners can update the AI\'s knowledge — services, pricing, FAQs — anytime, no tech skills needed.' },
    { icon: Zap, title: 'After-Hours Automation', desc: 'Never miss a lead. Enable after-hours AI for an extra $49/month and keep your business running around the clock.' },
    { icon: Building2, title: 'Multi-Tenant Dashboard', desc: 'Manage hundreds of client businesses from one clean operator dashboard. Built to scale from day one.' },
  ];

  const industries = [
    { icon: Stethoscope, name: 'Chiropractor Clinics', color: 'bg-blue-50 border-blue-200', iconColor: 'text-blue-600', items: ['Patient intake & scheduling', 'Insurance FAQs', 'After-care follow-ups', 'New patient onboarding'] },
    { icon: Building2, name: 'Real Estate', color: 'bg-purple-50 border-purple-200', iconColor: 'text-purple-600', items: ['Property inquiry handling', 'Showing scheduling', 'Lead qualification', 'Agent routing'] },
    { icon: UtensilsCrossed, name: 'Restaurants', color: 'bg-rose-50 border-rose-200', iconColor: 'text-rose-600', items: ['Reservation management', 'Hours & menu info', 'Special event bookings', 'Waitlist management'] },
  ];

  const plans = [
    { name: 'Starter', price: 195, color: 'border-slate-200', badge: '', features: ['1 AI Voice Agent', 'Up to 500 calls/month', 'Appointment Scheduling', 'Basic Knowledge Base', 'Email Support'] },
    { name: 'Professional', price: 295, color: 'border-blue-400 ring-2 ring-blue-300', badge: 'Most Popular', features: ['3 AI Voice Agents', 'Up to 2,000 calls/month', 'Advanced Scheduling', 'Full Knowledge Base Editor', 'Multi-language Support', 'Priority Support'] },
    { name: 'Enterprise', price: 395, color: 'border-slate-200', badge: '', features: ['Unlimited AI Agents', 'Unlimited calls', 'Custom AI Flows', 'CRM Integrations', 'White-label Ready', 'Dedicated Account Manager'] },
  ];

  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 text-lg">ReceptionistAI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
            <a href="#industries" className="hover:text-slate-900 transition-colors">Industries</a>
            <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')} className="text-sm font-medium text-slate-700 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors">Sign In</button>
            <button onClick={() => navigate('/register')} className="text-sm font-medium bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors">Get Started Free</button>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg hover:bg-slate-100">
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 space-y-3">
            <a href="#features" className="block text-sm text-slate-600">Features</a>
            <a href="#industries" className="block text-sm text-slate-600">Industries</a>
            <a href="#pricing" className="block text-sm text-slate-600">Pricing</a>
            <button onClick={() => navigate('/register')} className="w-full bg-slate-900 text-white text-sm py-2.5 rounded-lg font-medium mt-2">Get Started</button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-white pt-24 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_center,_var(--tw-gradient-stops))] from-blue-100/60 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-6">
              <Zap className="w-3 h-3" /> Powered by RetellAI + OpenAI
            </span>
          </motion.div>
          <motion.h1 custom={1} initial="hidden" animate="visible" variants={fadeUp} className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
            Your Business Deserves an <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-700">AI Receptionist</span> That Never Sleeps
          </motion.h1>
          <motion.p custom={2} initial="hidden" animate="visible" variants={fadeUp} className="text-xl text-slate-500 max-w-2xl mx-auto mb-10">
            Handle every call, book appointments automatically, and grow your business — 24/7, in any language, with zero missed opportunities.
          </motion.p>
          <motion.div custom={3} initial="hidden" animate="visible" variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="px-8 py-4 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group">
              Start Free Today <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/login')} className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all">
              View Demo Dashboard
            </button>
          </motion.div>

          {/* Social proof */}
          <motion.div custom={4} initial="hidden" animate="visible" variants={fadeUp} className="mt-16 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
            <div className="flex -space-x-2">
              {['bg-blue-400','bg-green-400','bg-pink-400','bg-purple-400','bg-yellow-400'].map((c,i) => (
                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white ${c}`} />
              ))}
            </div>
            <span className="font-medium text-slate-600">Trusted by <strong>100+</strong> businesses across 3 industries</span>
            <div className="flex items-center gap-1 text-yellow-400">
              {[...Array(5)].map((_,i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              <span className="text-slate-500 ml-1">4.9/5</span>
            </div>
          </motion.div>
        </div>

        {/* Hero visual */}
        <motion.div custom={5} initial="hidden" animate="visible" variants={fadeUp} className="max-w-4xl mx-auto px-6 mt-20">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="bg-slate-900 px-6 py-3 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="ml-4 text-xs text-slate-400 font-mono">AI Receptionist — Live Call</span>
            </div>
            <div className="p-8 bg-gradient-to-br from-slate-50 to-blue-50">
              <div className="space-y-4 max-w-2xl mx-auto">
                {[
                  { role: 'caller', msg: 'Hi, I\'d like to schedule a chiropractic appointment for my back pain.' },
                  { role: 'ai', msg: 'Of course! I\'d be happy to help. We have openings this Thursday at 2 PM or Friday at 10 AM. Which works better for you?' },
                  { role: 'caller', msg: 'Thursday at 2 PM sounds great.' },
                  { role: 'ai', msg: 'Perfect! I\'ve booked you for Thursday at 2:00 PM. You\'ll receive a confirmation text shortly. Is there anything else I can help you with?' },
                ].map((m, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: m.role === 'ai' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 + i * 0.3 }} className={`flex ${m.role === 'ai' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm ${m.role === 'ai' ? 'bg-blue-500 text-white rounded-br-sm' : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-bl-sm'}`}>
                      {m.role === 'ai' && <span className="text-blue-200 text-xs font-semibold block mb-1">🤖 AI Receptionist</span>}
                      {m.msg}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Everything your business needs</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">One platform. Every call answered. Every appointment booked. Every opportunity captured.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className="p-6 rounded-2xl border border-slate-100 hover:border-blue-200 hover:shadow-lg transition-all group cursor-default">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-5 group-hover:bg-blue-100 transition-colors">
                    <Icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg mb-2">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section id="industries" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Built for your industry</h2>
            <p className="text-lg text-slate-500 max-w-xl mx-auto">Pre-trained templates for every business type. Set up in minutes, not months.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  className={`p-8 rounded-2xl border-2 ${ind.color} bg-white hover:shadow-xl transition-all`}>
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center">
                      <Icon className={`w-6 h-6 ${ind.iconColor}`} />
                    </div>
                    <h3 className="font-bold text-slate-900 text-lg">{ind.name}</h3>
                  </div>
                  <ul className="space-y-3">
                    {ind.items.map((item, j) => (
                      <li key={j} className="flex items-center gap-3 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Live in 3 simple steps</h2>
            <p className="text-lg text-slate-500">From signup to your first AI call in under 15 minutes.</p>
          </div>
          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { step: '01', title: 'Register & Choose a Plan', desc: 'Sign up and pick the subscription that fits your business size and call volume.' },
              { step: '02', title: 'Customize Your AI', desc: 'Edit your AI\'s knowledge base — services, hours, pricing, FAQs — all from your dashboard.' },
              { step: '03', title: 'Go Live & Grow', desc: 'Connect your business phone number and let the AI handle every call automatically.' },
            ].map((s, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 text-white font-extrabold text-xl flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-200">
                  {s.step}
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-slate-500">No hidden fees. Cancel anytime. Add after-hours AI for just $49/month extra.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, i) => (
              <motion.div key={i} custom={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                className={`bg-white rounded-2xl border-2 ${plan.color} p-8 flex flex-col relative`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-full">{plan.badge}</span>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-1">{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">${plan.price}</span>
                  <span className="text-slate-400 mb-1">/month</span>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map((feat, j) => (
                    <li key={j} className="flex items-center gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate('/register')}
                  className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${plan.badge ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-200' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                  Get Started
                </button>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-slate-400 text-sm mt-8">All plans include a 14-day free trial. No credit card required.</p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            Ready to never miss a call again?
          </motion.h2>
          <motion.p custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-blue-200 text-lg mb-10 max-w-xl mx-auto">
            Join hundreds of businesses already growing with AI-powered reception. Start your free 14-day trial today.
          </motion.p>
          <motion.div custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => navigate('/register')} className="px-10 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl flex items-center justify-center gap-2 group">
              Start Free Trial <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => navigate('/login')} className="px-10 py-4 bg-white/10 text-white font-semibold rounded-xl border border-white/20 hover:bg-white/20 transition-all">
              Sign In to Dashboard
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <Phone className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-white">ReceptionistAI</span>
          </div>
          <p className="text-slate-500 text-sm">© 2026 ReceptionistAI. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
