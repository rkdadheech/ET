
import React, { useState } from 'react';
import { Search, Bell, Clock, Zap, Book, FileText, BarChart, ChevronRight, Sparkles, MessageCircle, X, Send, Loader2 } from 'lucide-react';
import { useApp } from '../App';
import { GoogleGenAI } from "@google/genai";

const HomePage: React.FC = () => {
  const { t, lang } = useApp();
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [userQuery, setUserQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickLinks = [
    { title: t('studyMaterial'), icon: Book, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
    { title: t('pyqs'), icon: FileText, color: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400' },
    { title: t('dailyQuiz'), icon: Zap, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
    { title: 'Results', icon: BarChart, color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  ];

  // Fix: Implemented AI Tutor functionality using Gemini 3 Pro model for high-quality educational responses
  const handleAskAi = async () => {
    if (!userQuery.trim()) return;
    
    setIsLoading(true);
    setAiResponse('');
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: userQuery,
        config: {
          systemInstruction: `You are a world-class Computer Science Tutor helping students with teaching instructor exam preparation. 
          Provide clear, conceptual, and accurate explanations. 
          Respond in ${lang === 'hi' ? 'Hindi' : 'English'}. Keep responses concise and focused.`,
          temperature: 0.7,
        },
      });
      
      setAiResponse(response.text || 'I apologize, but I could not generate an answer at this moment.');
    } catch (error) {
      console.error('Gemini API Error:', error);
      setAiResponse('Oops! I ran into an issue connecting to my brain. Please try again in a few moments.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome & Search */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold">{t('welcomeBack')}</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Prepare smarter, not harder.</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder={t('searchPlaceholder')}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </section>

      {/* Stats Cards Row */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-4 rounded-3xl text-white shadow-lg shadow-blue-500/20 relative overflow-hidden">
          <Clock className="absolute -right-2 -bottom-2 w-20 h-20 opacity-10" />
          <p className="text-xs font-medium opacity-80 uppercase tracking-wider">{t('examCountdown')}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-bold">42</span>
            <span className="text-sm opacity-90">{t('daysRemaining')}</span>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-xl">
              <Zap size={20} />
            </div>
            <span className="text-[10px] bg-green-50 dark:bg-green-900/20 text-green-600 px-2 py-1 rounded-full font-bold">LIVE</span>
          </div>
          <div>
            <p className="text-sm font-bold mt-2">Daily Live Test</p>
            <p className="text-[10px] text-gray-500">Starts in 02h : 15m</p>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold">{t('quickLinks')}</h3>
          <button className="text-blue-600 text-sm font-semibold">View All</button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map((link, i) => (
            <button key={i} className="flex flex-col items-center gap-2 group">
              <div className={`p-4 rounded-2xl ${link.color} transition-transform group-hover:scale-105 shadow-sm`}>
                <link.icon size={22} />
              </div>
              <span className="text-[10px] font-semibold text-center leading-tight">{link.title}</span>
            </button>
          ))}
        </div>
      </section>

      {/* AI Tutor Callout */}
      <section className="bg-gradient-to-r from-purple-600 to-blue-600 p-5 rounded-3xl text-white shadow-xl flex items-center justify-between relative overflow-hidden group">
        <div className="relative z-10 space-y-2 max-w-[70%]">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-yellow-300" />
            <h4 className="font-bold text-lg">{t('aiTutor')}</h4>
          </div>
          <p className="text-xs opacity-90 leading-relaxed">{t('aiTutorDesc')}</p>
          <button 
            onClick={() => setIsAiModalOpen(true)}
            className="mt-2 bg-white text-blue-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-md hover:bg-gray-100 transition-colors"
          >
            {t('askAi')}
          </button>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 flex items-center justify-center opacity-20 group-hover:scale-110 transition-transform duration-500">
           <MessageCircle size={100} strokeWidth={1} />
        </div>
      </section>

      {/* Gemini AI Tutor Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles size={20} className="text-yellow-300" />
                <h3 className="font-bold uppercase tracking-tight">Gemini AI Tutor</h3>
              </div>
              <button onClick={() => setIsAiModalOpen(false)} className="hover:bg-white/20 p-1 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {aiResponse ? (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl border border-blue-100 dark:border-blue-800/50 text-sm leading-relaxed whitespace-pre-wrap animate-slide-up">
                  {aiResponse}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 py-10">
                  <MessageCircle size={60} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-center font-medium">Ask any technical doubt and I'll clear it for you instantly.</p>
                </div>
              )}
              {isLoading && (
                <div className="flex items-center gap-2 text-blue-600 font-bold text-sm">
                  <Loader2 className="animate-spin" size={18} /> Thinking...
                </div>
              )}
            </div>
            
            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-slate-800/30">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAi()}
                  placeholder="e.g. Explain Paging vs Segmentation"
                  className="flex-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button 
                  onClick={handleAskAi}
                  disabled={isLoading || !userQuery.trim()}
                  className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 disabled:opacity-50"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Exam Categories */}
      <section className="space-y-3">
        <h3 className="font-bold">Exam Specializations</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-blue-500 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center text-blue-600">
                <BarChart size={24} />
              </div>
              <div>
                <p className="font-bold">{t('basicInstructor')}</p>
                <p className="text-xs text-gray-500">Grade III (Lower Secondary)</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500" />
          </div>
          
          <div className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl shadow-sm hover:border-blue-500 transition-colors cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center text-indigo-600">
                <Zap size={24} />
              </div>
              <div>
                <p className="font-bold">{t('seniorInstructor')}</p>
                <p className="text-xs text-gray-500">Grade II (Higher Secondary)</p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500" />
          </div>
        </div>
      </section>

      {/* Resume Banner */}
      <section className="bg-slate-100 dark:bg-slate-900 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium">{t('resumeLearning')}</span>
        </div>
        <button className="text-blue-600 font-bold text-sm">Resume</button>
      </section>
      
      {/* Footer / Community */}
      <div className="grid grid-cols-2 gap-3 pb-8">
        <button className="flex items-center justify-center gap-2 bg-[#25D366] text-white p-3 rounded-2xl font-bold text-sm">
          WhatsApp Group
        </button>
        <button className="flex items-center justify-center gap-2 bg-[#0088cc] text-white p-3 rounded-2xl font-bold text-sm">
          Telegram Channel
        </button>
      </div>
    </div>
  );
};

export default HomePage;
