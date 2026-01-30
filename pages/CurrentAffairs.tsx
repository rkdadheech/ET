
import React, { useState, useEffect, useMemo } from 'react';
import { 
  ChevronLeft, 
  Globe, 
  RefreshCw, 
  Loader2, 
  ExternalLink, 
  BookOpen, 
  Calendar,
  Sparkles,
  ArrowRight,
  Filter,
  Zap
} from 'lucide-react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';
import { GoogleGenAI, Type } from "@google/genai";

interface NewsItem {
  title: string;
  description: string;
  category: string;
  uri: string;
  date?: string;
}

const CATEGORIES = [
  'All',
  'Government Schemes',
  'Appointments',
  'Technology Updates',
  'Sports',
  'Rajasthan Special'
];

const CurrentAffairsPage: React.FC = () => {
  const { lang, t } = useApp();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'India' | 'Rajasthan'>('India');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [summary, setSummary] = useState('');
  const [lastUpdated, setLastUpdated] = useState<string>('');

  const fetchNews = async (region: 'India' | 'Rajasthan') => {
    setIsLoading(true);
    setNewsItems([]);
    setSummary('');
    const today = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric', day: 'numeric' });
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Explicitly asking for "latest" and "recent" news with current date context
      const prompt = `Find the LATEST and most RECENT current affairs for ${region} as of ${today}. 
      Focus on events from the last 30-60 days that are highly relevant to the RSMSSB Computer Instructor exam. 
      Target categories: Government Schemes, Appointments, Technology Updates, Sports, and ${region} Specific news.
      
      Return the response as a JSON array of objects. Each object MUST have:
      1. "title": Short punchy headline.
      2. "description": 1-2 sentence detailed summary in ${lang === 'hi' ? 'Hindi' : 'English'}.
      3. "category": One of [Government Schemes, Appointments, Technology Updates, Sports, Rajasthan Special].
      4. "uri": A valid source URL for verification.
      5. "date": The approximate date of the event (e.g. "Feb 2025").`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: {
          systemInstruction: `You are a real-time current affairs intelligence agent for competitive exam aspirants. 
          Your priority is accuracy and recency. Use Google Search to find news from the last few weeks. 
          Exclude old or outdated news. 
          Categorize items strictly into: Government Schemes, Appointments, Technology Updates, Sports, or Rajasthan Special.
          Current Date: ${today}.`,
          tools: [{ googleSearch: {} }],
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                category: { type: Type.STRING },
                uri: { type: Type.STRING },
                date: { type: Type.STRING }
              },
              required: ["title", "description", "category", "uri"]
            }
          }
        },
      });

      const parsedNews = JSON.parse(response.text || '[]');
      setNewsItems(parsedNews);
      setLastUpdated(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      
      setSummary(region === 'India' 
        ? (lang === 'hi' ? `नवीनतम राष्ट्रीय अपडेट (${today})। ये तथ्य आपकी आगामी परीक्षा के लिए अत्यंत महत्वपूर्ण हैं।` : `Latest national updates as of ${today}. These facts are critical for your upcoming examination.`)
        : (lang === 'hi' ? `राजस्थान के ताजा समाचार और नई घोषणाएं (${today})। राज्य-स्तरीय परीक्षाओं के लिए विशेष संकलन।` : `Fresh Rajasthan news and new announcements as of ${today}. Specially curated for state-level exams.`)
      );

    } catch (e) {
      console.error(e);
      setSummary('Failed to fetch the latest updates. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(activeTab);
  }, [activeTab]);

  const filteredNews = useMemo(() => {
    if (selectedCategory === 'All') return newsItems;
    return newsItems.filter(item => item.category.toLowerCase().includes(selectedCategory.toLowerCase()));
  }, [newsItems, selectedCategory]);

  return (
    <div className="space-y-6 pb-20 animate-fade-in">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm active:scale-90 transition-transform">
            <ChevronLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              {t('currentAffairs')}
              <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            </h2>
            <p className="text-xs text-gray-500 font-medium">Live Stream • Updated {lastUpdated || 'just now'}</p>
          </div>
        </div>
        <button 
          onClick={() => fetchNews(activeTab)}
          className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 rounded-xl active:rotate-180 transition-transform duration-500"
          title="Refresh Feed"
        >
          <RefreshCw size={18} />
        </button>
      </header>

      {/* Region Tabs */}
      <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-2xl border border-gray-100 dark:border-slate-800 shadow-sm">
        <button 
          onClick={() => setActiveTab('India')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'India' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400'}`}
        >
          {t('india')}
        </button>
        <button 
          onClick={() => setActiveTab('Rajasthan')}
          className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'Rajasthan' ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}
        >
          {t('rajasthan')}
        </button>
      </div>

      {/* Category Filters */}
      <div className="overflow-x-auto hide-scrollbar -mx-4 px-4 flex gap-2 pb-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${
              selectedCategory === cat 
                ? 'bg-slate-900 text-white border-slate-900 shadow-md' 
                : 'bg-white dark:bg-slate-900 text-gray-400 border-gray-100 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-gray-400">
            <Loader2 className="animate-spin text-blue-600" size={40} />
            <div className="text-center">
              <span className="text-xs font-black uppercase tracking-widest animate-pulse block">Scanning Live Portals...</span>
              <span className="text-[10px] opacity-60">Fetching the very latest from {activeTab}</span>
            </div>
          </div>
        ) : (
          <div className="space-y-6 animate-slide-up">
            {/* AI Summary Card */}
            <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-gray-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                <Globe size={120} />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-lg">
                  <Zap size={14} className="fill-current" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-widest text-blue-600">Flash Summary</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-bold">
                {summary}
              </p>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold italic">
                  <Calendar size={12} /> Live Updates • {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                </div>
                <div className="text-[9px] font-black text-green-500 uppercase flex items-center gap-1">
                   <RefreshCw size={8} className="animate-spin" /> Verifying with Gemini AI
                </div>
              </div>
            </div>

            {/* News List */}
            <div className="space-y-4">
              {filteredNews.length > 0 ? filteredNews.map((item, i) => (
                <div 
                  key={i} 
                  className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-3 group hover:border-blue-400 transition-all active:scale-[0.99]"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 rounded text-[9px] font-black uppercase tracking-widest">
                        {item.category}
                      </span>
                      {item.date && (
                        <span className="px-2 py-0.5 bg-gray-50 dark:bg-slate-800 text-gray-500 rounded text-[9px] font-black uppercase tracking-widest">
                          {item.date}
                        </span>
                      )}
                    </div>
                    <a 
                      href={item.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-blue-600 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                  <h4 className="font-black text-slate-800 dark:text-slate-100 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <a 
                      href={item.uri} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[10px] font-black text-blue-600 uppercase tracking-tighter"
                    >
                      Read Full Article <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 text-gray-400">
                  <Filter size={32} className="mx-auto mb-2 opacity-20" />
                  <p className="text-sm font-bold uppercase tracking-widest">No breaking news found here</p>
                  <button onClick={() => setSelectedCategory('All')} className="mt-2 text-blue-600 text-xs font-black">View All Recent Feed</button>
                </div>
              )}
            </div>
            
            {/* Quick Practice Tip */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[32px] text-white shadow-xl flex items-center justify-between group cursor-pointer active:scale-95 transition-all" onClick={() => navigate('/practice')}>
               <div>
                  <h4 className="font-black text-lg">Break Time Quiz</h4>
                  <p className="text-xs opacity-80">Test yourself on today's ${activeTab} news</p>
               </div>
               <div className="p-3 bg-white/20 rounded-2xl group-hover:translate-x-1 transition-transform">
                  <ArrowRight size={20} />
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CurrentAffairsPage;
