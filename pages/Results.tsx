
import React, { useState, useEffect } from 'react';
import { ChevronLeft, BarChart2, Calendar as CalendarIcon, Filter, Trash2, Award, Trophy } from 'lucide-react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';
import { QuizResult } from '../types';

const ResultsPage: React.FC = () => {
  const { lang, t } = useApp();
  const navigate = useNavigate();
  const [results, setResults] = useState<QuizResult[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('quizResults') || '[]');
    setResults(data);
  }, []);

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire test history?')) {
      localStorage.setItem('quizResults', '[]');
      setResults([]);
    }
  };

  const deleteResult = (id: string) => {
    const updated = results.filter(r => r.id !== id);
    localStorage.setItem('quizResults', JSON.stringify(updated));
    setResults(updated);
  };

  const getPerformanceColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'text-green-500 bg-green-50 dark:bg-green-900/20 border-green-200';
    if (percentage >= 50) return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200';
    return 'text-red-500 bg-red-50 dark:bg-red-900/20 border-red-200';
  };

  const getPerformanceBadge = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return 'Elite';
    if (percentage >= 50) return 'Average';
    return 'Needs Work';
  };

  // Grouping by date
  // Added explicit generic type to reduce to fix line 119 'unknown' type error for 'items'
  const groupedResults = results.reduce<Record<string, QuizResult[]>>((acc, result) => {
    const date = new Date(result.timestamp).toLocaleDateString(lang === 'hi' ? 'hi-IN' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    if (!acc[date]) acc[date] = [];
    acc[date].push(result);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
            <ChevronLeft size={20} />
          </button>
          <h2 className="text-2xl font-bold">Your Performance</h2>
        </div>
        <button 
          onClick={clearHistory}
          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
          title="Clear History"
        >
          <Trash2 size={20} />
        </button>
      </header>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-3xl text-white shadow-lg">
          <Trophy className="opacity-40 mb-2" size={24} />
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Tests Attempted</p>
          <p className="text-3xl font-black">{results.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm">
          <Award className="text-amber-500 mb-2" size={24} />
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Average Accuracy</p>
          <p className="text-3xl font-black text-blue-600">
            {results.length > 0 
              ? Math.round((results.reduce((s, r) => s + (r.score / r.totalQuestions), 0) / results.length) * 100)
              : 0}%
          </p>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 space-y-4">
          <div className="p-6 bg-gray-50 dark:bg-slate-800/50 rounded-full">
            <BarChart2 size={48} strokeWidth={1} className="opacity-20" />
          </div>
          <div className="text-center">
             <p className="font-bold">No test history found</p>
             <p className="text-xs">Take your first Daily Quiz to see results here.</p>
          </div>
          <button 
            onClick={() => navigate('/daily-quiz')}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-blue-500/20"
          >
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="space-y-8 pb-12">
          {/* Fix: Explicitly casting Object.entries to ensure 'items' is correctly typed as QuizResult[] */}
          {(Object.entries(groupedResults) as [string, QuizResult[]][]).map(([date, items]) => (
            <div key={date} className="space-y-4">
              <div className="flex items-center gap-2 px-2">
                <CalendarIcon size={14} className="text-blue-600" />
                <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">{date}</h3>
              </div>
              
              <div className="grid gap-3">
                {items.map((res) => (
                  <div 
                    key={res.id} 
                    className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm group hover:border-blue-500 transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex flex-col items-center justify-center font-black border ${getPerformanceColor(res.score, res.totalQuestions)}`}>
                        <span className="text-lg">{Math.round(res.score)}</span>
                        <div className="w-6 h-[1px] bg-current opacity-30" />
                        <span className="text-[10px]">{res.totalQuestions}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-sm">{res.topic}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md bg-gray-100 dark:bg-slate-800 text-gray-500">
                            {new Date(res.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span className={`text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded-md ${getPerformanceColor(res.score, res.totalQuestions)}`}>
                            {getPerformanceBadge(res.score, res.totalQuestions)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => deleteResult(res.id)}
                      className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ResultsPage;
