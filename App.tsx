
import React, { useState, useEffect, useMemo, createContext, useContext, useRef, Suspense, lazy } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  Home as HomeIcon, 
  BookOpen, 
  Edit3, 
  Trophy, 
  User as UserIcon, 
  Bell, 
  Moon, 
  Sun, 
  Languages, 
  Timer as TimerIcon,
  Play,
  Pause as PauseIcon,
  RotateCcw,
  Minimize2,
  Coffee,
  Save,
  Loader2
} from 'lucide-react';
import { Language, Theme, TranslationStrings, StudySession, User } from './types';
import { TRANSLATIONS } from './constants';

// Lazy load pages for performance
const HomePage = lazy(() => import('./pages/Home'));
const SyllabusPage = lazy(() => import('./pages/Syllabus'));
const PracticePage = lazy(() => import('./pages/Practice'));
const MockTestsPage = lazy(() => import('./pages/MockTests'));
const DashboardPage = lazy(() => import('./pages/Dashboard'));
const StudyMaterialsPage = lazy(() => import('./pages/StudyMaterials'));
const DailyQuizPage = lazy(() => import('./pages/DailyQuiz'));
const ResultsPage = lazy(() => import('./pages/Results'));
const ExamCalendarPage = lazy(() => import('./pages/ExamCalendar'));
const LoginPage = lazy(() => import('./pages/Login'));
const CurrentAffairsPage = lazy(() => import('./pages/CurrentAffairs'));

const AppContext = createContext<{
  lang: Language;
  setLang: (l: Language) => void;
  theme: Theme;
  toggleTheme: () => void;
  t: (key: keyof TranslationStrings) => string;
  totalStudySeconds: number;
  logStudySession: (duration: number, mode: 'stopwatch' | 'pomodoro') => void;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
} | null>(null);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};

// Optimized Static Header
const Header = React.memo(() => {
  const { lang, setLang, theme, toggleTheme, user } = useApp();
  const navigate = useNavigate();
  
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-gray-100 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer active:scale-95 transition-transform" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold italic shadow-lg shadow-blue-500/20">ET</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent tracking-tight">EDU TRICKER</h1>
        </div>
        
        <div className="flex items-center gap-1 md:gap-3">
          <button 
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-600 dark:text-gray-300 flex items-center gap-1 transition-colors"
          >
            <Languages size={18} />
            <span className="text-xs font-black uppercase">{lang}</span>
          </button>
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl text-gray-600 dark:text-gray-300 transition-colors"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          {user && (
            <div 
              onClick={() => navigate('/dashboard')}
              className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 font-black text-xs border border-blue-200 cursor-pointer"
            >
              {user.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
});

// Optimized Nav
const BottomNav = React.memo(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, user } = useApp();

  const navItems = [
    { label: t('home'), icon: HomeIcon, path: '/' },
    { label: t('syllabus'), icon: BookOpen, path: '/syllabus' },
    { label: t('practice'), icon: Edit3, path: '/practice' },
    { label: t('tests'), icon: Trophy, path: '/tests' },
    { label: t('profile'), icon: UserIcon, path: '/dashboard' },
  ];

  if (!user) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-gray-100 dark:border-slate-800 px-2 py-1 md:hidden flex justify-around items-center z-50">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center p-2 min-w-[64px] rounded-2xl transition-all duration-300 ${
              isActive ? 'text-blue-600 dark:text-blue-400 -translate-y-1' : 'text-gray-400 dark:text-gray-500'
            }`}
          >
            <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`text-[10px] mt-1 font-black uppercase tracking-tighter ${isActive ? 'opacity-100' : 'opacity-60'}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
});

const StudyTimer = ({ onTick }: { onTick: (total: number) => void }) => {
  const { t, logStudySession, user } = useApp();
  const [mode, setMode] = useState<'stopwatch' | 'pomodoro'>('stopwatch');
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const timerRef = useRef<number | null>(null);

  const WORK_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;

  useEffect(() => {
    if (isActive) {
      timerRef.current = window.setInterval(() => {
        if (mode === 'stopwatch') {
          setSeconds(prev => prev + 1);
          updateCumulativeTime(1);
        } else {
          setSeconds(prev => {
            if (prev <= 1) {
              handleSessionComplete();
              return 0;
            }
            if (!isBreak) updateCumulativeTime(1);
            return prev - 1;
          });
        }
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, mode, isBreak]);

  const updateCumulativeTime = (increment: number) => {
    const currentTotal = parseInt(localStorage.getItem('totalStudySeconds') || '0', 10);
    const newTotal = currentTotal + increment;
    localStorage.setItem('totalStudySeconds', newTotal.toString());
    onTick(newTotal);
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    if (!isBreak) {
      logStudySession(WORK_TIME, 'pomodoro');
      setIsBreak(true);
      setSeconds(BREAK_TIME);
    } else {
      setIsBreak(false);
      setSeconds(WORK_TIME);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  if (!user) return null;

  return (
    <div className={`fixed bottom-20 md:bottom-8 right-4 z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isExpanded ? 'w-72' : 'w-14 h-14'}`}>
      <div className={`relative overflow-hidden bg-white dark:bg-slate-900 shadow-2xl border border-gray-100 dark:border-slate-800 rounded-3xl transition-all duration-300 ${isExpanded ? 'p-4' : 'p-0 flex items-center justify-center h-full'}`}>
        {!isExpanded ? (
          <button onClick={() => setIsExpanded(true)} className="w-full h-full flex items-center justify-center text-gray-400 active:scale-90 transition-transform">
            <TimerIcon size={24} className={isActive ? 'animate-pulse text-blue-600' : ''} />
          </button>
        ) : (
          <div className="space-y-4 animate-slide-up">
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <button 
                  onClick={() => {setMode('stopwatch'); setSeconds(0); setIsActive(false);}}
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg transition-all ${mode === 'stopwatch' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400'}`}
                >
                  STW
                </button>
                <button 
                  onClick={() => {setMode('pomodoro'); setSeconds(WORK_TIME); setIsActive(false);}}
                  className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg transition-all ${mode === 'pomodoro' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
                >
                  PMD
                </button>
              </div>
              <button onClick={() => setIsExpanded(false)} className="text-gray-400 p-1 active:scale-90"><Minimize2 size={16} /></button>
            </div>
            <div className="text-center py-2">
              <span className={`text-4xl font-black font-mono tracking-tighter transition-colors ${isBreak ? 'text-green-500' : 'text-slate-900 dark:text-white'}`}>
                {formatTime(seconds)}
              </span>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button onClick={() => isActive(!isActive)} className={`p-4 rounded-2xl shadow-lg transition-all active:scale-95 ${isActive ? 'bg-amber-100 text-amber-600' : 'bg-blue-600 text-white'}`}>
                {isActive ? <PauseIcon size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => (localStorage.getItem('lang') as Language) || 'en');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [totalStudySeconds, setTotalStudySeconds] = useState(() => parseInt(localStorage.getItem('totalStudySeconds') || '0', 10));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('userProfile');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const login = (profile: User) => {
    setUser(profile);
    localStorage.setItem('userProfile', JSON.stringify(profile));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userProfile');
  };

  const logStudySession = (duration: number, mode: 'stopwatch' | 'pomodoro') => {
    const existing = JSON.parse(localStorage.getItem('studySessions') || '[]');
    const newSession: StudySession = { id: Date.now().toString(), timestamp: Date.now(), duration, mode };
    localStorage.setItem('studySessions', JSON.stringify([newSession, ...existing].slice(0, 50)));
  };

  const t = useMemo(() => (key: keyof TranslationStrings) => TRANSLATIONS[lang][key], [lang]);

  const value = useMemo(() => ({ 
    lang, setLang, theme, toggleTheme, t, totalStudySeconds, logStudySession, user, login, logout
  }), [lang, theme, totalStudySeconds, t, user]);

  return (
    <AppContext.Provider value={value}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 pb-20 md:pb-0 transition-colors duration-200">
        <Header />
        <main className="max-w-7xl mx-auto p-4 overflow-x-hidden">
          <Suspense fallback={
            <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-blue-600">
              <Loader2 className="animate-spin" size={40} />
              <span className="text-xs font-black uppercase tracking-widest animate-pulse">Loading Platform...</span>
            </div>
          }>
            <Routes>
              <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
              <Route path="/" element={user ? <HomePage /> : <Navigate to="/login" />} />
              <Route path="/syllabus" element={user ? <SyllabusPage /> : <Navigate to="/login" />} />
              <Route path="/practice" element={user ? <PracticePage /> : <Navigate to="/login" />} />
              <Route path="/tests" element={user ? <MockTestsPage /> : <Navigate to="/login" />} />
              <Route path="/dashboard" element={user ? <DashboardPage /> : <Navigate to="/login" />} />
              <Route path="/study-material" element={user ? <StudyMaterialsPage /> : <Navigate to="/login" />} />
              <Route path="/daily-quiz" element={user ? <DailyQuizPage /> : <Navigate to="/login" />} />
              <Route path="/results" element={user ? <ResultsPage /> : <Navigate to="/login" />} />
              <Route path="/calendar" element={user ? <ExamCalendarPage /> : <Navigate to="/login" />} />
              <Route path="/current-affairs" element={user ? <CurrentAffairsPage /> : <Navigate to="/login" />} />
            </Routes>
          </Suspense>
        </main>
        <StudyTimer onTick={setTotalStudySeconds} />
        <BottomNav />
      </div>
    </AppContext.Provider>
  );
}
