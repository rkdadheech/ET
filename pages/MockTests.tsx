
import React from 'react';
import { Timer, Trophy, Star, ChevronRight, Play } from 'lucide-react';
import { useApp } from '../App';

const MockTestsPage: React.FC = () => {
  const { t } = useApp();

  const tests = [
    { title: 'Full Length Mock Test #1', questions: 100, time: 120, difficulty: 'Medium', price: 'Free' },
    { title: 'Technical Theory Booster', questions: 50, time: 60, difficulty: 'Hard', price: 'Free' },
    { title: 'Previous Year 2022 Solve', questions: 100, time: 120, difficulty: 'Easy', price: 'Free' },
    { title: 'Data Structures Special', questions: 30, time: 40, difficulty: 'Hard', price: 'Premium' },
  ];

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('tests')}</h2>
        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center gap-2">
          <Star size={18} className="fill-current" />
          <span className="text-xs font-black">PRO</span>
        </div>
      </header>

      {/* Performance Summary */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl flex items-center justify-between">
        <div>
          <p className="text-xs opacity-70 uppercase font-bold">Your Performance</p>
          <div className="flex items-center gap-2 mt-1">
            <Trophy className="text-yellow-400" size={20} />
            <h3 className="text-xl font-black italic tracking-tighter">ELITE ASPIRANT</h3>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-70 uppercase font-bold">Avg. Accuracy</p>
          <p className="text-xl font-black text-green-400">82%</p>
        </div>
      </div>

      <div className="space-y-4">
        {tests.map((test, i) => (
          <div 
            key={i} 
            className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm flex items-center gap-4 group cursor-pointer hover:border-blue-500 transition-colors"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl ${
              i % 2 === 0 ? 'bg-gradient-to-br from-blue-500 to-indigo-600' : 'bg-gradient-to-br from-purple-500 to-pink-600'
            }`}>
              {test.questions}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                  test.price === 'Free' ? 'bg-green-100 text-green-600' : 'bg-amber-100 text-amber-600'
                }`}>
                  {test.price}
                </span>
                <span className="text-[10px] text-gray-400 font-bold uppercase">• {test.difficulty}</span>
              </div>
              <h3 className="font-bold leading-tight">{test.title}</h3>
              <div className="flex items-center gap-3 mt-2 text-gray-400">
                <div className="flex items-center gap-1 text-[10px] font-medium">
                  <Timer size={12} /> {test.time} Mins
                </div>
                <div className="flex items-center gap-1 text-[10px] font-medium">
                  <Play size={12} className="fill-current text-blue-500" /> Start Now
                </div>
              </div>
            </div>
            
            <ChevronRight className="text-gray-300 group-hover:text-blue-500" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default MockTestsPage;
