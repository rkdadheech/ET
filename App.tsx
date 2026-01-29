
import React, { useState, useEffect, useMemo, createContext, useContext, useRef } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  BookOpen, 
  Edit3, 
  Trophy, 
  User, 
  Bell, 
  Moon, 
  Sun, 
  Languages, 
  Search, 
  Menu,
  ChevronRight,
  Sparkles,
  Timer as TimerIcon,
  Play,
  Pause as PauseIcon,
  RotateCcw,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { Language, Theme, TranslationStrings } from './types';
import { TRANSLATIONS } from './constants';

// Context for global state
const AppContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: keyof TranslationStrings) => string;
} | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

// --- Study Timer Component ---
const StudyTimer = () => {
  const { t, theme } = useApp();
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsActive(false);
    setSeconds(0);
  };

  return (
    <div className={`fixed bottom-20 md:bottom-8 right-4 z-50 transition-all duration-300 ease-in-out ${isExpanded ? 'w-64' : 'w-14 h-14'}`}>
      <div className={`relative overflow-hidden bg-white dark:bg-slate-900 shadow-2xl border border-gray-100 dark:border-slate-800 rounded-3xl transition-all duration-300 ${isExpanded ? 'p-4' : 'p-0 flex items-center justify-center h-full'}`}>
        {!isExpanded ? (
          <button 
            onClick={() => setIsExpanded(true)}
            className={`w-full h-full flex items-center justify-center transition-colors ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <TimerIcon size={24} className={isActive ? 'animate-pulse' : ''} />
            {isActive && seconds > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full border-2 border-white dark:border-slate-900"></span>
            )}
          </button>
        ) : (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-600">{t('focusTimer')}</span>
              <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-gray-600">
                <Minimize2 size={16} />
              </button>
            </div>
            
            <div className="text-center">
              <span className="text-3xl font-black font-mono tracking-tighter dark:text-white">
                {formatTime(seconds)}
              </span>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={handleReset}
                className="p-2 rounded-xl bg-gray-100 dark:bg-slate-800 text-gray-500 hover:bg-gray-200 transition-colors"
                title={t('reset')}
              >
                <RotateCcw size={18} />
              </button>
              
              <button 
                onClick={() => setIsActive(!isActive)}
                className={`p-3 rounded-2xl shadow-lg transition-all transform active:scale-95 ${
                  isActive ? 'bg-amber-100 text-amber-600 shadow-amber-500/20' : 'bg-blue-600 text-white shadow-blue-500/20'
                }`}
              >
                {isActive ? <PauseIcon size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
              </button>
            </div>

            <p className="text-[10px] text-center text-gray-400 font-medium">
              {isActive ? 'Session Active' : 'Ready to focus?'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Other Sub-components ---

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useApp();

  const navItems = [
    { label: t('home'), icon: HomeIcon, path: '/' },
    { label: t('syllabus'), icon: BookOpen, path: '/syllabus' },
    { label: t('practice'), icon: Edit3, path: '/practice' },
    { label: t('tests'), icon: Trophy, path: '/tests' },
    { label: t('profile'), icon: User, path: '/dashboard' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-gray-800 px-2 py-1 md:hidden flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center p-2 rounded-xl transition-all duration-200 ${
              isActive ? 'text-blue-600 dark:text-blue-400 scale-110' : 'text-gray-500 dark:text-gray-400'
            }`}
          >
            <item.icon size={20} className={isActive ? 'fill-current' : ''} />
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

const Header = () => {
  const { lang, setLang, theme, toggleTheme, t } = useApp();
  
  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic">ET</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">EDU TRICKER</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-gray-300 flex items-center gap-1"
          >
            <Languages size={20} />
            <span className="text-sm font-semibold uppercase">{lang}</span>
          </button>
          
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full text-gray-600 dark:text-gray-300"
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          
          <button className="hidden md:flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
            Login
          </button>
          
          <div className="md:hidden">
            <button className="p-2 text-gray-600 dark:text-gray-300"><Bell size={20}/></button>
          </div>
        </div>
      </div>
    </header>
  );
};

// --- Pages ---

import HomePage from './pages/Home';
import SyllabusPage from './pages/Syllabus';
import PracticePage from './pages/Practice';
import MockTestsPage from './pages/MockTests';
import DashboardPage from './pages/Dashboard';

export default function App() {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'en');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const t = (key: keyof TranslationStrings) => TRANSLATIONS[lang][key];

  const value = useMemo(() => ({ lang, setLang, theme, toggleTheme, t }), [lang, theme]);

  return (
    <AppContext.Provider value={value}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 md:pb-0">
        <Header />
        <main className="max-w-7xl mx-auto p-4 animate-slide-up">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/syllabus" element={<SyllabusPage />} />
            <Route path="/practice" element={<PracticePage />} />
            <Route path="/tests" element={<MockTestsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
          </Routes>
        </main>
        <StudyTimer />
        <BottomNav />
      </div>
    </AppContext.Provider>
  );
}
