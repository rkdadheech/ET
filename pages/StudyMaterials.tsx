
import React, { useState, useEffect } from 'react';
import { Search, Book, ExternalLink, Loader2, FileText, Download, Youtube, Info, ChevronRight, AlertCircle, CheckCircle, Bookmark, BookmarkCheck, FileSearch } from 'lucide-react';
import { useApp } from '../App';
import { GoogleGenAI } from "@google/genai";
import { SavedResource } from '../types';

const StudyMaterialsPage: React.FC = () => {
  const { t, lang } = useApp();
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [summary, setSummary] = useState('');
  const [resources, setResources] = useState<{title: string, uri: string}[]>([]);
  const [message, setMessage] = useState<{ text: string, type: 'info' | 'error' | 'success' } | null>(null);
  const [savedUris, setSavedUris] = useState<Set<string>>(new Set());

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedResources') || '[]') as SavedResource[];
    setSavedUris(new Set(saved.map(s => s.uri)));
  }, []);

  const showMessage = (text: string, type: 'info' | 'error' | 'success' = 'info') => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  const fetchMaterials = async (customQuery?: string) => {
    const searchQuery = customQuery || query;
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    setSummary('');
    setResources([]);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Find official previous year question papers (PYQs) and high-quality study materials for: "${searchQuery}". 
        Specifically look for PDFs on the RSMSSB official website (rsmssb.rajasthan.gov.in) and reputable education portals like GeeksforGeeks or testbook for Rajasthan Computer Instructor Exam (Basic/Senior). 
        Provide a summary of the exam pattern if relevant and list direct official links.`,
        config: {
          systemInstruction: "You are an expert education consultant for Rajasthan government exams. Your primary task is to find direct PDF download links for RSMSSB Previous Year Papers. Use Google Search to verify links on rsmssb.rajasthan.gov.in and other reliable government education portals. Ensure results are relevant to the Computer Instructor post.",
          tools: [{ googleSearch: {} }],
        },
      });
      
      const text = response.text;
      setSummary(text || '');

      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks) {
        const sources = chunks
          .filter((chunk: any) => chunk.web)
          .map((chunk: any) => ({
            title: chunk.web?.title || 'Study Resource',
            uri: chunk.web?.uri || ''
          }))
          .filter(s => s.uri !== '');
        
        const uniqueSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());
        setResources(uniqueSources);
      }
    } catch (error) {
      console.error('Study Material Search Error:', error);
      setSummary('Failed to fetch resources. Please check your connection or try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (uri: string, title: string) => {
    const isPdf = uri.toLowerCase().endsWith('.pdf') || uri.toLowerCase().includes('pdf');
    
    if (isPdf) {
      window.open(uri, '_blank');
      showMessage('Opening official PDF link...', 'success');
    } else {
      showMessage('Redirecting to official resource...', 'info');
      setTimeout(() => window.open(uri, '_blank'), 1000);
    }
  };

  const toggleSaveResource = (uri: string, title: string) => {
    const saved = JSON.parse(localStorage.getItem('savedResources') || '[]') as SavedResource[];
    const isSaved = savedUris.has(uri);
    
    let updated;
    if (isSaved) {
      updated = saved.filter(s => s.uri !== uri);
      showMessage('Resource removed from bookmarks', 'info');
    } else {
      updated = [{ uri, title, timestamp: Date.now() }, ...saved];
      showMessage('Resource saved to your dashboard!', 'success');
    }
    
    localStorage.setItem('savedResources', JSON.stringify(updated));
    setSavedUris(new Set(updated.map(s => s.uri)));
  };

  return (
    <div className="space-y-6 relative">
      {/* Toast Notification */}
      {message && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-slide-up border ${
          message.type === 'success' ? 'bg-green-600 border-green-500 text-white' : 
          message.type === 'error' ? 'bg-red-600 border-red-500 text-white' : 
          'bg-blue-600 border-blue-500 text-white'
        }`}>
          {message.type === 'success' ? <CheckCircle size={18} /> : 
           message.type === 'error' ? <AlertCircle size={18} /> : <Info size={18} />}
          <span className="text-sm font-bold">{message.text}</span>
        </div>
      )}

      <header className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-2xl">
          <Book size={24} />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{t('studyMaterial')}</h2>
          <p className="text-xs text-gray-500 font-medium">Search Official RSMSSB PYQs & Notes</p>
        </div>
      </header>

      {/* Search Bar */}
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search size={20} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        </div>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchMaterials()}
          placeholder="e.g. RSMSSB Computer Instructor 2022 Question Paper PDF"
          className="w-full pl-12 pr-24 py-4 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl shadow-sm focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium"
        />
        <button 
          onClick={() => fetchMaterials()}
          disabled={isLoading || !query.trim()}
          className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 rounded-xl text-sm font-bold transition-all active:scale-95"
        >
          {isLoading ? <Loader2 className="animate-spin" size={18} /> : 'Search'}
        </button>
      </div>

      {/* Quick Access Section */}
      {!hasSearched && !isLoading && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 px-1">Quick Fetch Official Papers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              onClick={() => fetchMaterials("RSMSSB Computer Instructor 2022 Question Paper PDF Official")}
              className="flex items-center gap-4 p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all text-left group"
            >
              <div className="p-2 bg-white/20 rounded-xl"><FileSearch size={24} /></div>
              <div>
                <p className="font-bold text-sm">2022 Basic Instructor Paper</p>
                <p className="text-[10px] opacity-70">Official RSMSSB PDF Link</p>
              </div>
            </button>
            <button 
              onClick={() => fetchMaterials("RSMSSB Senior Computer Instructor 2022 Previous Year Paper PDF")}
              className="flex items-center gap-4 p-4 bg-slate-900 text-white rounded-2xl shadow-lg shadow-slate-500/20 active:scale-95 transition-all text-left group"
            >
              <div className="p-2 bg-white/20 rounded-xl"><FileSearch size={24} /></div>
              <div>
                <p className="font-bold text-sm">2022 Senior Instructor Paper</p>
                <p className="text-[10px] opacity-70">Download Question & Answer Key</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Results Area */}
      <div className="space-y-6">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4 animate-pulse">
            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/10 rounded-full flex items-center justify-center">
              <FileSearch size={32} className="text-blue-500 animate-bounce" />
            </div>
            <p className="text-sm font-semibold tracking-wide uppercase">Searching official portals...</p>
          </div>
        )}

        {!isLoading && hasSearched && !summary && resources.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center animate-slide-up">
            <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-full text-red-500 mb-4">
              <AlertCircle size={40} />
            </div>
            <h3 className="text-lg font-bold">No official files found</h3>
            <p className="text-sm text-gray-500 mt-2 max-w-[250px]">
              Try a different keyword like "RSMSSB official question papers" or "Rajasthan Computer Instructor paper 2022".
            </p>
          </div>
        )}

        {!isLoading && summary && (
          <div className="animate-slide-up space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-blue-600">
                <Info size={18} />
                <h3 className="font-bold text-sm uppercase tracking-wider">Search Insights</h3>
              </div>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{summary}</p>
            </div>

            {resources.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold flex items-center gap-2 px-2">
                   <ExternalLink size={18} className="text-indigo-600" /> 
                   Available Links & Documents
                </h3>
                <div className="grid gap-3">
                  {resources.map((res, i) => {
                    const isRSMSSB = res.uri.includes('rsmssb.rajasthan.gov.in');
                    const isPdf = res.uri.toLowerCase().endsWith('.pdf') || res.uri.toLowerCase().includes('pdf');
                    const isSaved = savedUris.has(res.uri);

                    return (
                      <div 
                        key={i} 
                        className={`flex items-center justify-between p-4 bg-white dark:bg-slate-900 border ${isRSMSSB ? 'border-blue-500' : 'border-gray-100 dark:border-slate-800'} rounded-2xl hover:shadow-md transition-all group`}
                      >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                            isRSMSSB ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                          }`}>
                            <FileText size={20} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <a 
                              href={res.uri} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm font-bold text-slate-800 dark:text-slate-200 block truncate hover:text-blue-600 transition-colors"
                            >
                              {res.title}
                            </a>
                            <div className="flex items-center gap-2 mt-0.5">
                              {isRSMSSB && <span className="text-[8px] font-black bg-blue-100 text-blue-700 px-1.5 rounded uppercase">Official Portal</span>}
                              {isPdf && <span className="text-[8px] font-black bg-red-100 text-red-600 px-1.5 rounded uppercase">PDF</span>}
                              <p className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">{res.uri}</p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          <button 
                            onClick={() => toggleSaveResource(res.uri, res.title)}
                            className={`p-2 rounded-xl transition-all ${
                              isSaved ? 'bg-amber-100 text-amber-600' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                            title={isSaved ? "Remove Bookmark" : "Save to Dashboard"}
                          >
                            {isSaved ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                          </button>
                          <button 
                            onClick={() => handleDownload(res.uri, res.title)}
                            className={`p-2 rounded-xl transition-all ${
                              isPdf ? 'bg-blue-50 text-blue-600 hover:bg-blue-100' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                            }`}
                            title={isPdf ? "Download Document" : "Open Resource"}
                          >
                            <Download size={18} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyMaterialsPage;
