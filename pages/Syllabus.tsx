
import React, { useState } from 'react';
import { CheckCircle2, Circle, ChevronDown, ChevronUp } from 'lucide-react';
import { useApp } from '../App';
import { SYLLABUS_DATA } from '../constants';

const SyllabusPage: React.FC = () => {
  const { lang, t } = useApp();
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('syllabus')}</h2>
        <div className="text-right">
          <p className="text-xs text-gray-500 uppercase font-bold tracking-widest">Overall Progress</p>
          <p className="text-xl font-black text-blue-600">34%</p>
        </div>
      </header>

      <div className="bg-blue-600 h-2 w-full rounded-full overflow-hidden">
        <div className="bg-white/40 h-full w-[34%]" />
      </div>

      <div className="space-y-4">
        {SYLLABUS_DATA.map((item) => (
          <div 
            key={item.id} 
            className="bg-white dark:bg-slate-900 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all duration-300"
          >
            <button 
              onClick={() => setExpanded(expanded === item.id ? null : item.id)}
              className="w-full p-5 flex items-center justify-between text-left"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                    {item.progress}% Done
                  </span>
                </div>
                <h3 className="font-bold text-lg mt-1">{lang === 'hi' ? item.titleHi : item.title}</h3>
              </div>
              <div className="ml-4">
                {expanded === item.id ? <ChevronUp className="text-gray-400" /> : <ChevronDown className="text-gray-400" />}
              </div>
            </button>

            {expanded === item.id && (
              <div className="px-5 pb-5 pt-2 space-y-3 border-t border-gray-50 dark:border-slate-800/50 animate-slide-up">
                {item.subTopics.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-3 group cursor-pointer">
                    {idx < 2 ? (
                      <CheckCircle2 className="text-green-500" size={18} />
                    ) : (
                      <Circle className="text-gray-300 group-hover:text-blue-500 transition-colors" size={18} />
                    )}
                    <span className={`text-sm ${idx < 2 ? 'text-gray-400 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                      {sub}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SyllabusPage;
