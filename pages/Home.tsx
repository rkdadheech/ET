
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Search, 
  Bell, 
  Clock, 
  Zap, 
  Book, 
  FileText, 
  BarChart, 
  Sparkles, 
  MessageCircle, 
  X, 
  Send, 
  Loader2, 
  Calendar as CalendarIcon, 
  ShieldCheck,
  AlertTriangle,
  ChevronRight,
  Globe,
  Copy,
  Check
} from 'lucide-react';
import { useApp } from '../App';
import { GoogleGenAI } from "@google/genai";
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { t, lang, user } = useApp();
  const navigate = useNavigate();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isFetchingDate, setIsFetchingDate] = useState(true);
  const [officialSource, setOfficialSource] = useState<string | null>(null);
  const [activeNotifications, setActiveNotifications] = useState<string[]>([]);

  // Check for upcoming reminders (3 days before)
  useEffect(() => {
    const checkReminders = () => {
      const savedReminders = JSON.parse(localStorage.getItem('examReminders') || '[]');
      if (savedReminders.length === 0) return;

      if (daysLeft !== null && daysLeft <= 3 && daysLeft >= 0) {
        setActiveNotifications(['RSMSSB Computer Instructor Exam is in less than 3 days! Check your calendar.']);
      }
    };
    if (!isFetchingDate) checkReminders();
  }, [daysLeft, isFetchingDate]);

  useEffect(() => {
    const fetchExamDate = async () => {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "RSMSSB Computer Instructor 2024-25 exam date. Return YYYY-MM-DD.",
          config: { tools: [{ googleSearch: {} }] },
        });
        const dateMatch = response.text?.match(/\d{4}-\d{2}-\d{2}/);
        if (dateMatch) {
          const diff = Math.ceil((new Date(dateMatch[0]).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
          setDaysLeft(diff > 0 ? diff : 0);
          setOfficialSource(response.candidates?.[0]?.groundingMetadata?.groundingChunks?.[0]?.web?.uri || null);
        } else setDaysLeft(42);
      } catch (e) { setDaysLeft(42); }
      finally { setIsFetchingDate(false); }
    };
    fetchExamDate();
  }, []);

  const handleAskAi = useCallback(async () => {
    if (!userQuery.trim()) return;
    setIsLoading(true); setAiResponse('');
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userQuery,
        config: {
          systemInstruction: `Educational tutor. Language: ${lang === 'hi' ? 'Hindi' : 'English'}.`,
          tools: [{ googleSearch: {} }],
        },
      });
      setAiResponse(response.text || '');
    } catch (e) { setAiResponse('Brain block! Try again.'); }
    finally { setIsLoading(false); }
  }, [userQuery, lang]);

  const copyToClipboard = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Dynamic Notifications Banner */}
      {activeNotifications.length > 0 && (
        <section className="animate-slide-up">
          <div 
            onClick={() => navigate('/calendar')}
            className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 p-4 rounded-3xl flex items-center gap-4 cursor-pointer active:scale-95 transition-all"
          >
            <div className="p-2 bg-red-600 text-white rounded-xl animate-pulse">
              <AlertTriangle size={20} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-black uppercase tracking-widest text-red-600 mb-1">Urgent Reminder</p>
              <p className="text-sm font-bold text-red-900 dark:text-red-100 leading-tight">
                {activeNotifications[0]}
              </p>
            </div>
            <ChevronRight size={20} className="text-red-400" />
          </div>
        </section>
      )}

      <section className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-black tracking-tight">
              {t('welcomeBack')}, {user?.name.split(' ')[0]}!
            </h2>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider">{user?.examType} Instructor Preparation</p>
          </div>
          <button className="p-2.5 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl relative shadow-sm active:scale-90 transition-transform">
            <Bell size={20} className="text-gray-400" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            className="w-full pl-11 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-sm"
          />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-4">
        {isFetchingDate ? (
          <div className="skeleton h-32 rounded-3xl" />
        ) : (
          <div 
            onClick={() => navigate('/calendar')}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-3xl text-white shadow-xl group overflow-hidden relative cursor-pointer active:scale-95 transition-all"
          >
            <Clock className="absolute -right-2 -bottom-2 w-20 h-20 opacity-10" />
            <div className="flex justify-between items-start">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{t('examCountdown')}</p>
              {officialSource && <ShieldCheck size={14} className="opacity-60" />}
            </div>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-4xl font-black tracking-tighter">{daysLeft}</span>
              <span className="text-xs font-bold opacity-80">{t('daysRemaining')}</span>
            </div>
          </div>
        )}
        <div 
           onClick={() => navigate('/current-affairs')}
           className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between cursor-pointer active:scale-95 transition-all"
        >
          <div className="p-2 w-fit bg-purple-50 dark:bg-purple-900/20 text-purple-600 rounded-xl"><Globe size={22} /></div>
          <div>
            <p className="text-sm font-black mt-2">{t('currentAffairs')}</p>
            <span className="text-[10px] font-black text-purple-500 uppercase tracking-tighter">India & Rajasthan</span>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-4 gap-4">
        {[
          { icon: Book, color: 'bg-blue-100 text-blue-600', path: '/study-material', label: t('studyMaterial') },
          { icon: CalendarIcon, color: 'bg-indigo-100 text-indigo-600', path: '/calendar', label: 'Calendar' },
          { icon: Zap, color: 'bg-amber-100 text-amber-600', path: '/daily-quiz', label: 'Quiz' },
          { icon: BarChart, color: 'bg-green-100 text-green-600', path: '/results', label: 'Results' }
        ].map((item, i) => (
          <button key={i} onClick={() => navigate(item.path)} className="flex flex-col items-center gap-2 group active:scale-90 transition-transform">
            <div className={`p-4 rounded-2xl ${item.color} dark:bg-slate-800 transition-shadow group-hover:shadow-lg`}>
              <item.icon size={22} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter text-gray-500">{item.label}</span>
          </button>
        ))}
      </section>

      <section className="bg-slate-900 p-5 rounded-3xl text-white shadow-2xl relative overflow-hidden active:scale-[0.98] transition-transform cursor-pointer" onClick={() => setIsAiModalOpen(true)}>
        <Sparkles className="absolute right-[-10px] top-[-10px] w-24 h-24 text-blue-500 opacity-20" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h4 className="font-black text-lg tracking-tight flex items-center gap-2">
              <Sparkles size={18} className="text-yellow-400" /> EDU AI TUTOR
            </h4>
            <p className="text-xs opacity-70 font-medium max-w-[180px] mt-1">Instant Computer Science Doubt Solver</p>
          </div>
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg"><MessageCircle size={20} /></div>
        </div>
      </section>

      {isAiModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/40 backdrop-blur-md animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg md:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col h-[80vh] animate-slide-up">
            <div className="p-4 bg-slate-900 text-white flex justify-between items-center">
              <span className="font-black text-xs tracking-widest uppercase flex items-center gap-2"><Sparkles size={14}/> AI Tutor</span>
              <button onClick={() => setIsAiModalOpen(false)} className="p-1 active:scale-75 transition-transform"><X size={24}/></button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {aiResponse ? (
                <div className="bg-gray-50 dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 text-sm leading-relaxed animate-fade-in relative group/ai">
                  {aiResponse}
                  <button
                    onClick={copyToClipboard}
                    className="absolute top-2 right-2 p-2 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-700 rounded-xl shadow-sm text-gray-400 hover:text-blue-600 opacity-0 group-hover/ai:opacity-100 transition-all active:scale-90"
                    title="Copy to clipboard"
                  >
                    {isCopied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  </button>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-300 font-black italic uppercase tracking-widest text-xs">
                  {isLoading ? <Loader2 className="animate-spin mr-2" /> : 'Ready to help...'}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 dark:border-slate-800">
              <div className="flex gap-2">
                <input 
                  type="text" value={userQuery} onChange={(e)=>setUserQuery(e.target.value)}
                  placeholder="Ask anything..." className="flex-1 bg-gray-50 dark:bg-slate-800 border-none p-4 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleAskAi} className="bg-blue-600 text-white p-4 rounded-2xl shadow-xl active:scale-90 transition-transform"><Send size={20}/></button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;
