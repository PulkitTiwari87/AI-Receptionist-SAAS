import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Stethoscope, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { useAuthStore } from '../store/authStore';

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

interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (apt: Appointment) => void;
}

const services = [
  'Initial Consultation', 'Follow-up Session', 'Standard Session',
  'Property Viewing', 'Reservation', 'Massage Therapy',
  'Spinal Adjustment', 'Physical Rehabilitation'
];

const AddAppointmentModal = ({ isOpen, onClose, onAdd }: AddAppointmentModalProps) => {
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    customerName: '', date: '', time: '', type: services[0],
    customerPhone: '', notes: '', status: 'scheduled'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.customerName.trim()) e.customerName = 'Client name is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.time) e.time = 'Time is required';
    if (!form.customerPhone.trim()) e.customerPhone = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      const res = await api.post('/api/appointments', form, token || undefined);
      if (res.ok) {
        const newApt = await res.json();
        onAdd(newApt);
        setForm({ customerName: '', date: '', time: '', type: services[0], customerPhone: '', notes: '', status: 'scheduled' });
        setErrors({});
        onClose();
      }
    } catch (err) {
      console.error('Failed to book appointment:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    if (errors[e.target.name]) setErrors(er => ({ ...er, [e.target.name]: '' }));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">New Appointment</h2>
                  <p className="text-xs text-slate-500">Fill in the details below</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Client Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input name="customerName" value={form.customerName} onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600 ${errors.customerName ? 'border-red-400' : 'border-slate-200'}`}
                      placeholder="Sarah Johnson" />
                  </div>
                  {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone *</label>
                  <input name="customerPhone" value={form.customerPhone} onChange={handleChange}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600 ${errors.customerPhone ? 'border-red-400' : 'border-slate-200'}`}
                    placeholder="+1 (555) 123-4567" />
                  {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Date *</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input name="date" type="date" value={form.date} onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600 ${errors.date ? 'border-red-400' : 'border-slate-200'}`} />
                  </div>
                  {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Time *</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input name="time" type="time" value={form.time} onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600 ${errors.time ? 'border-red-400' : 'border-slate-200'}`} />
                  </div>
                  {errors.time && <p className="text-red-500 text-xs mt-1">{errors.time}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Service</label>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select name="type" value={form.type} onChange={handleChange}
                    className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600">
                    {services.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notes</label>
                <textarea name="notes" value={form.notes} onChange={handleChange} rows={3}
                  className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none resize-none dark:bg-slate-700 dark:text-white dark:border-slate-600"
                  placeholder="Any special notes or requirements..." />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={onClose}
                  className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700">
                  Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Book Appointment'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddAppointmentModal;
