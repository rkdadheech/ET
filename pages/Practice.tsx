
import React, { useState } from 'react';
import { CheckCircle, XCircle, Info, ChevronRight, Share2, Bookmark } from 'lucide-react';
import { useApp } from '../App';

const PracticePage: React.FC = () => {
  const { lang, t } = useApp();
  const [selected, setSelected] = useState<number | null>(null);

  const mockQuestion = {
    id: 'q1',
    text: 'Which data structure follows the LIFO (Last In First Out) principle?',
    textHi: 'कौन सा डेटा स्ट्रक्चर LIFO (लास्ट इन फर्स्ट आउट) सिद्धांत का पालन करता है?',
    options: ['Queue', 'Stack', 'Linked List', 'Array'],
    optionsHi: ['क्यू', 'स्टैक', 'लिंक्ड लिस्ट', 'एरे'],
    correct: 1,
    explanation: 'A Stack is a linear data structure which follows a particular order in which the operations are performed. LIFO means that the last element added to the stack will be the first one to be removed.',
    explanationHi: 'स्टैक एक रैखिक डेटा संरचना है जो एक विशेष क्रम का पालन करती है जिसमें संचालन किया जाता है। LIFO का अर्थ है कि स्टैक में जोड़ा गया अंतिम तत्व हटाए जाने वाला पहला तत्व होगा।'
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('practice')}</h2>
        <div className="flex gap-2">
          <button className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <Bookmark size={20} className="text-gray-400" />
          </button>
          <button className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800 shadow-sm">
            <Share2 size={20} className="text-gray-400" />
          </button>
        </div>
      </header>

      {/* Question Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-gray-100 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full uppercase">
            Computer Fundamentals
          </span>
          <span className="text-xs font-medium text-gray-400">Question 1 of 10</span>
        </div>

        <h3 className="text-lg font-bold leading-relaxed">
          {lang === 'hi' ? mockQuestion.textHi : mockQuestion.text}
        </h3>

        <div className="space-y-3">
          {(lang === 'hi' ? mockQuestion.optionsHi : mockQuestion.options).map((opt, i) => {
            const isCorrect = i === mockQuestion.correct;
            const isSelected = selected === i;
            
            let variant = 'border-gray-100 dark:border-slate-800 hover:border-blue-500';
            if (selected !== null) {
              if (isCorrect) variant = 'border-green-500 bg-green-50 dark:bg-green-900/20';
              else if (isSelected) variant = 'border-red-500 bg-red-50 dark:bg-red-900/20';
            }

            return (
              <button
                key={i}
                disabled={selected !== null}
                onClick={() => setSelected(i)}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${variant}`}
              >
                <span className="font-medium">{opt}</span>
                {selected !== null && (
                  isCorrect ? <CheckCircle className="text-green-500" size={18} /> : 
                  isSelected ? <XCircle className="text-red-500" size={18} /> : null
                )}
              </button>
            );
          })}
        </div>

        {selected !== null && (
          <div className="mt-6 p-5 bg-blue-50 dark:bg-blue-900/20 rounded-2xl animate-slide-up">
            <div className="flex items-center gap-2 mb-2 text-blue-600">
              <Info size={18} />
              <span className="text-sm font-bold uppercase">Explanation</span>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {lang === 'hi' ? mockQuestion.explanationHi : mockQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      <button className="w-full py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
        Next Question <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default PracticePage;
