import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, User, Stethoscope } from 'lucide-react';

interface Appointment {
  id: number;
  client: string;
  date: string;
  time: string;
  service: string;
  status: string;
  phone: string;
  notes: string;
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
  const [form, setForm] = useState({
    client: '', date: '', time: '', service: services[0],
    phone: '', notes: '', status: 'Pending'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.client.trim()) e.client = 'Client name is required';
    if (!form.date) e.date = 'Date is required';
    if (!form.time) e.time = 'Time is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onAdd({ id: Date.now(), ...form });
    setForm({ client: '', date: '', time: '', service: services[0], phone: '', notes: '', status: 'Pending' });
    setErrors({});
    onClose();
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
                    <input name="client" value={form.client} onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600 ${errors.client ? 'border-red-400' : 'border-slate-200'}`}
                      placeholder="Sarah Johnson" />
                  </div>
                  {errors.client && <p className="text-red-500 text-xs mt-1">{errors.client}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone *</label>
                  <input name="phone" value={form.phone} onChange={handleChange}
                    className={`w-full px-3 py-2.5 border rounded-lg text-sm focus:ring-2 focus:ring-blue-300 outline-none dark:bg-slate-700 dark:text-white dark:border-slate-600 ${errors.phone ? 'border-red-400' : 'border-slate-200'}`}
                    placeholder="+1 (555) 123-4567" />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
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
                  <select name="service" value={form.service} onChange={handleChange}
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
                <button type="submit"
                  className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  Book Appointment
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
