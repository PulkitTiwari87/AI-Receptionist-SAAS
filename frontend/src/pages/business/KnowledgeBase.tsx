import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Plus, Trash2 } from 'lucide-react';

const KnowledgeBase = () => {
  const [faqs, setFaqs] = useState([
    { question: 'What are your hours of operation?', answer: 'We are open Monday through Friday from 9 AM to 5 PM.' },
    { question: 'Where are you located?', answer: 'Our main office is at 123 Health Way, Wellness City, TX 75001.' },
    { question: 'Do you accept insurance?', answer: 'Yes, we accept most major insurance providers including BlueCross, Aetna, and Cigna.' }
  ]);

  const [businessInfo, setBusinessInfo] = useState({
    description: 'We are a premier chiropractic clinic dedicated to holistic wellness and pain relief.',
    services: 'Spinal Adjustment, Massage Therapy, Physical Rehabilitation, Acupuncture'
  });

  const [saved, setSaved] = useState(false);

  const handleAddFaq = () => {
    setFaqs([...faqs, { question: '', answer: '' }]);
  };

  const handleRemoveFaq = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleFaqChange = (index: number, field: 'question' | 'answer', value: string) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    setFaqs(newFaqs);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
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
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all ${
            saved
              ? 'bg-emerald-600 text-white'
              : 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100'
          }`}
        >
          <Save className="w-4 h-4" />
          {saved ? 'Saved!' : 'Save Changes'}
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
                    value={faq.question}
                    onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                    className={faqInputClass}
                    placeholder="E.g., Do you offer walk-in appointments?"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                    AI Answer
                  </label>
                  <textarea
                    value={faq.answer}
                    onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
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
