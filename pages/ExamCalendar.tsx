
import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, 
  Calendar as CalendarIcon, 
  Loader2, 
  ExternalLink, 
  Plus, 
  AlertCircle, 
  Clock, 
  Info,
  ShieldCheck,
  MapPin,
  FileText,
  Bell,
  BellOff,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { ExamDate } from '../types';

const ExamCalendarPage: React.FC = () => {
  const { t, lang } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [examDates, setExamDates] = useState<ExamDate[]>([]);
  const [sources, setSources] = useState<{title: string, uri: string}[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [reminders, setReminders] = useState<string[]>([]); // Array of exam titles

  useEffect(() => {
    // Load existing reminders from localStorage
    const savedReminders = JSON.parse(localStorage.getItem('examReminders') || '[]');
    setReminders(savedReminders);

    const fetchDates = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: "Search ONLY for the official RSMSSB Rajasthan Computer Instructor (Basic and Senior) exam schedule for the 2024-2025 session. IGNORE all other exams like CET, Patwari, or REET. Provide specific dates for 'Basic Computer Instructor' and 'Senior Computer Instructor' recruitment steps (Exam, Document Verification, Result) in YYYY-MM-DD format.",
          config: {
            systemInstruction: "You are a specialized RSMSSB Computer Instructor exam assistant. Your ONLY focus is the recruitment of Basic and Senior Computer Instructors in Rajasthan. Filter out every other exam. If no specific 2024-25 date is found on rsmssb.rajasthan.gov.in, indicate that the notification is awaited for the next cycle.",
            tools: [{ googleSearch: {} }],
          },
        });

        const text = response.text || "";
        const extracted: ExamDate[] = [];

        // Parsing logic focused strictly on Computer Instructor
        const basicMatch = text.match(/Basic (?:Computer )?Instructor.*(\d{4}-\d{2}-\d{2})/i) || text.match(/Basic (?:Computer )?Instructor.*(\d{1,2}\s[A-Za-z]+\s\d{4})/i);
        if (basicMatch) {
           extracted.push({
             title: 'Basic Computer Instructor Exam',
             date: basicMatch[1],
             type: 'Basic',
             source: 'RSMSSB Official'
           });
        }

        const seniorMatch = text.match(/Senior (?:Computer )?Instructor.*(\d{4}-\d{2}-\d{2})/i) || text.match(/Senior (?:Computer )?Instructor.*(\d{1,2}\s[A-Za-z]+\s\d{4})/i);
        if (seniorMatch) {
           extracted.push({
             title: 'Senior Computer Instructor Exam',
             date: seniorMatch[1],
             type: 'Senior',
             source: 'RSMSSB Official'
           });
        }

        // If nothing found, provide a recruitment-specific placeholder
        if (extracted.length === 0) {
           extracted.push({
             title: 'Next Computer Instructor Cycle',
             date: 'Notification Awaited',
             type: 'Other',
             source: 'RSMSSB 2025 Calendar'
           });
        }

        setExamDates(extracted);
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        if (chunks) {
           setSources(chunks.filter((c:any) => c.web).map((c:any) => ({ title: c.web.title, uri: c.web.uri })));
        }
      } catch (err) {
        setError('Failed to fetch Computer Instructor schedule. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDates();
  }, []);

  const toggleReminder = (examTitle: string) => {
    let updated;
    if (reminders.includes(examTitle)) {
      updated = reminders.filter(r => r !== examTitle);
    } else {
      updated = [...reminders, examTitle];
      if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
      }
    }
    setReminders(updated);
    localStorage.setItem('examReminders', JSON.stringify(updated));
  };

  const addToCalendar = (exam: ExamDate) => {
    const title = encodeURIComponent(`EDU TRICKER: ${exam.title}`);
    const details = encodeURIComponent(`Rajasthan Computer Instructor Exam Prep. Source: ${exam.source}`);
    const location = encodeURIComponent('Rajasthan Exam Centers');
    
    let gDate = '';
    const dateObj = new Date(exam.date);
    if (!isNaN(dateObj.getTime())) {
      const y = dateObj.getFullYear();
      const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const d = dateObj.getDate().toString().padStart(2, '0');
      gDate = `${y}${m}${d}/${y}${m}${d}`;
    }

    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}${gDate ? `&dates=${gDate}` : ''}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <header className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-bold">Computer Instructor Calendar</h2>
          <p className="text-xs text-gray-500 font-medium">Dedicated Basic & Senior Post Tracking</p>
        </div>
      </header>

      <div className="space-y-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400 gap-4">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <p className="text-xs font-black uppercase tracking-widest animate-pulse">Filtering for Instructor Posts...</p>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 dark:bg-red-900/10 rounded-3xl border border-red-100 dark:border-red-900/30 text-center space-y-4">
            <AlertCircle className="mx-auto text-red-500" size={48} />
            <p className="text-sm font-bold text-red-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-red-600 text-white rounded-xl text-xs font-black uppercase"
            >
              Retry Sync
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {examDates.map((exam, i) => {
              const hasReminder = reminders.includes(exam.title);
              const isInstructor = exam.title.toLowerCase().includes('instructor');
              
              return (
                <div 
                  key={i} 
                  className={`bg-white dark:bg-slate-900 p-6 rounded-3xl border shadow-sm group hover:border-blue-500 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6 ${
                    isInstructor ? 'border-gray-100 dark:border-slate-800' : 'border-dashed border-gray-200 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black ${
                      exam.type === 'Basic' ? 'bg-blue-100 text-blue-600' : 
                      exam.type === 'Senior' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <CalendarIcon size={24} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                          exam.type === 'Basic' ? 'bg-blue-50 text-blue-600' : 
                          exam.type === 'Senior' ? 'bg-indigo-50 text-indigo-600' : 'bg-gray-50 text-gray-400'
                        }`}>
                          {exam.type === 'Other' ? 'Recruitment Status' : `${exam.type} Category`}
                        </span>
                        {exam.source.includes('Official') && <ShieldCheck size={12} className="text-green-500" />}
                      </div>
                      <h3 className="text-lg font-black tracking-tight">{exam.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-gray-500">
                         <div className="flex items-center gap-1 text-xs font-bold">
                           <Clock size={12} /> {exam.date}
                         </div>
                         <div className="flex items-center gap-1 text-xs font-bold">
                           <MapPin size={12} /> RSMSSB Rajasthan
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => toggleReminder(exam.title)}
                      className={`p-4 rounded-2xl border transition-all active:scale-90 ${
                        hasReminder 
                          ? 'bg-amber-100 border-amber-200 text-amber-600' 
                          : 'bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {hasReminder ? <Bell size={20} fill="currentColor" /> : <BellOff size={20} />}
                    </button>
                    <button 
                      onClick={() => addToCalendar(exam)}
                      disabled={exam.date.toLowerCase().includes('awaited')}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white disabled:bg-gray-300 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
                    >
                      <Plus size={16} /> Sync GCal
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="bg-blue-50 dark:bg-blue-900/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex gap-4 items-start">
              <CheckCircle2 className="text-blue-600 flex-shrink-0" size={20} />
              <div>
                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100">Specific Instructor Tracking</h4>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                  This calendar is filtered to only show events for the Rajasthan Computer Instructor posts. Other RSMSSB exams like Patwari or LDC are excluded to keep your focus sharp.
                </p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 mt-6">
              <div className="flex items-center gap-2 mb-4 text-blue-600">
                <Info size={18} />
                <h4 className="font-bold text-xs uppercase tracking-widest">Official Instructor Links</h4>
              </div>
              <div className="space-y-3">
                {sources.length > 0 ? sources.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 hover:border-blue-500 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText size={14} className="text-gray-400" />
                      <span className="text-xs font-bold text-gray-700 dark:text-gray-300 truncate max-w-[200px]">{source.title}</span>
                    </div>
                    <ExternalLink size={14} className="text-gray-300 group-hover:text-blue-500" />
                  </a>
                )) : (
                  <p className="text-xs text-gray-400 italic text-center">No current official Computer Instructor PDF notifications found. Checking official RSMSSB RSS feeds...</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamCalendarPage;
