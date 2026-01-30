
import React, { useState } from 'react';
import { useApp } from '../App';
import { User as UserIcon, BookOpen, ChevronRight, Check } from 'lucide-react';

const LoginPage: React.FC = () => {
  const { t, login } = useApp();
  const [name, setName] = useState('');
  const [examType, setExamType] = useState<'Basic' | 'Senior'>('Basic');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      login({ name, examType });
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/40 rotate-12">
            <BookOpen size={40} />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight">EDU TRICKER</h2>
            <p className="text-gray-500 font-medium">Your Gateway to RSMSSB Success</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-gray-100 dark:border-slate-800 shadow-xl space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">
              {t('enterName')}
            </label>
            <div className="relative">
              <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">
              {t('selectExam')}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExamType('Basic')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  examType === 'Basic' 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                    : 'border-gray-50 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-gray-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${examType === 'Basic' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-transparent'}`}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-xs font-black uppercase tracking-tighter">Basic</span>
              </button>
              <button
                type="button"
                onClick={() => setExamType('Senior')}
                className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  examType === 'Senior' 
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600' 
                    : 'border-gray-50 dark:border-slate-800 bg-gray-50 dark:bg-slate-800 text-gray-400'
                }`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${examType === 'Senior' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-transparent'}`}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span className="text-xs font-black uppercase tracking-tighter">Senior</span>
              </button>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all mt-4"
          >
            {t('startPreparation')} <ChevronRight size={18} />
          </button>
        </form>

        <p className="text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest">
          No Password Required • Local First Secure Sync
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
