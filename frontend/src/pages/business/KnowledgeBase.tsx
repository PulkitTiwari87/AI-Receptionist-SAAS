import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2, Loader2, CheckCircle } from 'lucide-react';
import { api } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

interface KnowledgeItem {
  _id?: string;
  title: string;
  content: string;
  category: string;
}

const KnowledgeBase = () => {
  const { token } = useAuthStore();
  const [faqs, setFaqs] = useState<KnowledgeItem[]>([]);
  const [businessInfo, setBusinessInfo] = useState({
    description: '',
    services: ''
  });
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bizRes, faqRes] = await Promise.all([
          api.get('/api/business/profile', token || undefined),
          api.get('/api/knowledge', token || undefined)
        ]);

        if (bizRes.ok) {
          const bizData = await bizRes.json();
          setBusinessInfo({
            description: bizData.description || '',
            services: bizData.services || ''
          });
        }

        if (faqRes.ok) {
          const faqData = await faqRes.json();
          setFaqs(faqData.filter((i: any) => i.category === 'faq').map((i: any) => ({
            _id: i._id,
            title: i.title,
            content: i.content,
            category: i.category
          })));
        }
      } catch (err) {
        console.error('Failed to fetch knowledge data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleAddFaq = () => {
    setFaqs([...faqs, { title: '', content: '', category: 'faq' }]);
  };

  const handleRemoveFaq = async (index: number) => {
    const item = faqs[index];
    if (item._id) {
      try {
        await api.delete(`/api/knowledge/${item._id}`, token || undefined);
      } catch (err) {
        console.error('Failed to delete FAQ:', err);
      }
    }
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: 'title' | 'content', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index] = { ...newFaqs[index], [field]: value };
    setFaqs(newFaqs);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Save business info
      await api.patch('/api/business/profile', businessInfo, token || undefined);

      // Save FAQs (simplified: delete and re-save or individual updates)
      // For this prototype, we'll just save them individually if they changed
      await Promise.all(faqs.map(faq => {
        if (faq._id) {
          return api.put(`/api/knowledge/${faq._id}`, faq, token || undefined);
        } else {
          return api.post('/api/knowledge', faq, token || undefined);
        }
      }));

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Failed to save knowledge base:', err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-300 outline-none resize-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors";
  const faqInputClass = "w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-300 outline-none bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors";

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Knowledge Base</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Train your AI Receptionist by updating this information.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
          } ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : saved ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {loading ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </div>

      {/* Core Business Context */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 space-y-5">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Core Business Context</h2>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Business Description</label>
          <textarea
            className={`${inputClass} h-24`}
            value={businessInfo.description}
            onChange={(e) => setBusinessInfo({ ...businessInfo, description: e.target.value })}
            placeholder="Describe your business in a few sentences..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Services Offered</label>
          <textarea
            className={`${inputClass} h-24`}
            value={businessInfo.services}
            onChange={(e) => setBusinessInfo({ ...businessInfo, services: e.target.value })}
            placeholder="List your main services..."
          />
        </div>
      </div>

      {/* FAQs */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">Frequently Asked Questions</h2>
          <button
            onClick={handleAddFaq}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" /> Add FAQ
          </button>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-900/50 relative"
            >
              <button
                onClick={() => handleRemoveFaq(index)}
                className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="space-y-4 pr-8">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                    Question {index + 1}
                  </label>
                  <input
                    type="text"
                    value={faq.title}
                    onChange={(e) => handleFaqChange(index, 'title', e.target.value)}
                    className={faqInputClass}
                    placeholder="E.g., Do you offer walk-in appointments?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                    AI Answer
                  </label>
                  <textarea
                    value={faq.content}
                    onChange={(e) => handleFaqChange(index, 'content', e.target.value)}
                    className={`${faqInputClass} resize-none h-20`}
                    placeholder="Provide the exact answer the AI should give..."
                  />
                </div>
              </div>
            </motion.div>
          ))}

          {faqs.length === 0 && (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500">
              <p className="text-sm">No FAQs yet. Click "Add FAQ" to get started.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default KnowledgeBase;
