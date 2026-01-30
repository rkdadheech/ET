
import React, { useState, useEffect } from 'react';
import { ChevronLeft, PlusCircle, X, Send, CheckCircle, Info, Trophy, AlertCircle, Save, HelpCircle } from 'lucide-react';
import { useApp } from '../App';
import { useNavigate } from 'react-router-dom';
import { QuizResult } from '../types';

interface MCQ {
  id: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  qEn: string;
  qHi: string;
  options: { en: string; hi: string }[]; // A, B, C, D
  correctIndex: number; // 0-3
  explanationEn: string;
  explanationHi: string;
}

const DEFAULT_QUESTIONS: MCQ[] = [
  {
    id: '1',
    topic: 'Computer Fundamentals',
    difficulty: 'Easy',
    qEn: 'Which of the following represents the smallest unit of data in a computer?',
    qHi: 'निम्नलिखित में से कौन कंप्यूटर में डेटा की सबसे छोटी इकाई का प्रतिनिधित्व करता है?',
    options: [
      { en: 'Nibble', hi: 'निबल' },
      { en: 'Bit', hi: 'बिट' },
      { en: 'Byte', hi: 'बाइट' },
      { en: 'Pixel', hi: 'पिक्सेल' }
    ],
    correctIndex: 1,
    explanationEn: 'A bit (binary digit) is the smallest unit of data in computing. It has a single binary value, either 0 or 1.',
    explanationHi: 'एक बिट (बाइनरी डिजिट) कंप्यूटिंग में डेटा की सबसे छोटी इकाई है। इसका एक एकल बाइनरी मान होता है, या तो 0 या 1।'
  }
];

const DailyQuizPage: React.FC = () => {
  const { t, lang } = useApp();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState<MCQ[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [userQuestions, setUserQuestions] = useState<MCQ[]>([]);

  // Form State for Adding Questions
  const [form, setForm] = useState({
    topic: 'Computer Fundamentals',
    difficulty: 'Medium' as const,
    qEn: '',
    qHi: '',
    optA_En: '', optA_Hi: '',
    optB_En: '', optB_Hi: '',
    optC_En: '', optC_Hi: '',
    optD_En: '', optD_Hi: '',
    correctIndex: 0,
    explanationEn: '',
    explanationHi: ''
  });

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('contributedQuestions') || '[]');
    setQuestions([...DEFAULT_QUESTIONS, ...stored]);
    setUserQuestions(stored);
  }, []);

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    const newMCQ: MCQ = {
      id: Date.now().toString(),
      topic: form.topic,
      difficulty: form.difficulty,
      qEn: form.qEn,
      qHi: form.qHi,
      options: [
        { en: form.optA_En, hi: form.optA_Hi },
        { en: form.optB_En, hi: form.optB_Hi },
        { en: form.optC_En, hi: form.optC_Hi },
        { en: form.optD_En, hi: form.optD_Hi }
      ],
      correctIndex: form.correctIndex,
      explanationEn: form.explanationEn,
      explanationHi: form.explanationHi
    };

    const updated = [...userQuestions, newMCQ];
    localStorage.setItem('contributedQuestions', JSON.stringify(updated));
    setUserQuestions(updated);
    setQuestions([...DEFAULT_QUESTIONS, ...updated]);
    setIsModalOpen(false);
    
    // Reset form
    setForm({
      topic: 'Computer Fundamentals',
      difficulty: 'Medium',
      qEn: '', qHi: '',
      optA_En: '', optA_Hi: '',
      optB_En: '', optB_Hi: '',
      optC_En: '', optC_Hi: '',
      optD_En: '', optD_Hi: '',
      correctIndex: 0,
      explanationEn: '', explanationHi: ''
    });

    alert('Question contributed successfully! It is now added to your local test bank.');
  };

  const currentQ = questions[currentIdx];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    
    if (idx === 4) { // Option E (Skip)
      setScore(prev => prev + 0);
    } else if (idx === currentQ.correctIndex) {
      setScore(prev => prev + 1);
    } else {
      // Updated negative marking to 0.33
      setScore(prev => prev - 0.33);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setSelectedOption(null);
    } else {
      saveResultAndFinish();
    }
  };

  const saveResultAndFinish = () => {
    const finalScore = score;
    const result: QuizResult = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      score: finalScore,
      totalQuestions: questions.length,
      topic: 'Daily Live Test'
    };
    
    const existingResults = JSON.parse(localStorage.getItem('quizResults') || '[]');
    localStorage.setItem('quizResults', JSON.stringify([result, ...existingResults]));
    
    setShowResult(true);
  };

  if (showResult) {
    return (
      <div className="flex flex-col items-center justify-center py-12 animate-slide-up space-y-6">
        <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
          <Trophy size={48} />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-black italic tracking-tighter">TEST COMPLETE!</h2>
          <p className="text-gray-500 font-medium">Daily Live Test Result</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-xl w-full max-w-sm text-center">
          <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Your Score</p>
          <p className="text-6xl font-black text-blue-600">{score.toFixed(2)}</p>
          <div className="grid grid-cols-2 gap-4 mt-8 pt-6 border-t border-gray-100 dark:border-slate-800">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Status</p>
              <p className="text-lg font-black text-green-500">Completed</p>
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase">Total Qs</p>
              <p className="text-lg font-black">{questions.length}</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-gray-50 dark:bg-slate-800/50 rounded-xl">
             <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">
               Scoring: +1 Correct | -0.33 Wrong | 0 Skip
             </p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/results')}
          className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs active:scale-95 transition-all shadow-xl"
        >
          View Detailed History
        </button>
        <button 
          onClick={() => navigate('/')}
          className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black tracking-widest uppercase text-xs active:scale-95 transition-all shadow-xl"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative pb-24">
      <header className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 bg-white dark:bg-slate-900 rounded-xl border border-gray-100 dark:border-slate-800">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="text-sm font-black uppercase tracking-tighter text-blue-600">Daily Live Test</h2>
          <p className="text-[10px] text-gray-400 font-bold">EDU TRICKER</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="p-2 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20 active:scale-90 transition-all"
          title="Add Question"
        >
          <PlusCircle size={20} />
        </button>
      </header>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 px-1">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <span>Score: {score.toFixed(2)}</span>
        </div>
        <div className="h-2 bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-500" 
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Area */}
      {currentQ && (
        <div className="space-y-6 animate-slide-up">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-gray-100 dark:border-slate-800 shadow-sm space-y-4">
             <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 px-2 py-1 rounded-md uppercase">
                  {currentQ.topic}
                </span>
                <span className={`text-[10px] font-black px-2 py-1 rounded-md uppercase ${
                  currentQ.difficulty === 'Easy' ? 'bg-green-50 text-green-600' :
                  currentQ.difficulty === 'Medium' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                }`}>
                  {currentQ.difficulty}
                </span>
                <span className="text-[10px] font-black text-gray-400 ml-auto">Penalty: -0.33</span>
             </div>

             <div className="space-y-4">
                <p className="text-sm font-bold text-gray-500">English:</p>
                <h3 className="text-lg font-bold leading-relaxed">{currentQ.qEn}</h3>
                <div className="h-px bg-gray-100 dark:bg-slate-800" />
                <p className="text-sm font-bold text-gray-500">Hindi:</p>
                <h3 className="text-lg font-bold leading-relaxed">{currentQ.qHi}</h3>
             </div>
          </div>

          <div className="grid gap-3">
            {currentQ.options.map((opt, i) => {
              const isCorrect = i === currentQ.correctIndex;
              const isSelected = selectedOption === i;
              let style = "bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800";
              
              if (selectedOption !== null) {
                if (isCorrect) style = "bg-green-50 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400";
                else if (isSelected) style = "bg-red-50 dark:bg-red-900/20 border-red-500 text-red-700 dark:text-red-400";
                else style = "opacity-40 grayscale";
              }

              return (
                <button 
                  key={i}
                  disabled={selectedOption !== null}
                  onClick={() => handleSelect(i)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all group flex flex-col gap-1 ${style}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-gray-400 uppercase">Option {String.fromCharCode(65 + i)}</span>
                    {selectedOption !== null && isCorrect && <CheckCircle size={16} className="text-green-500" />}
                  </div>
                  <p className="font-bold text-sm">{opt.en}</p>
                  <p className="font-medium text-xs opacity-80">{opt.hi}</p>
                </button>
              );
            })}

            {/* Option E - Mandatory Skip */}
            <button 
              disabled={selectedOption !== null}
              onClick={() => handleSelect(4)}
              className={`p-4 rounded-2xl border-2 text-left transition-all group flex flex-col gap-1 ${
                selectedOption === 4 ? 'bg-slate-100 border-slate-400' : 'bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800'
              }`}
            >
              <span className="text-[10px] font-black text-gray-400 uppercase">Option E</span>
              <p className="font-bold text-sm">Unanswered / Skip</p>
              <p className="font-medium text-xs opacity-80">उत्तर नहीं देना / छोड़ें</p>
            </button>
          </div>

          {selectedOption !== null && (
            <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-3xl border border-blue-100/50 animate-slide-up space-y-4">
               <div className="flex items-center gap-2 text-blue-600">
                  <Info size={18} />
                  <h4 className="font-bold uppercase text-xs tracking-wider">Detailed Explanation</h4>
               </div>
               <div className="space-y-3">
                  <p className="text-xs font-bold opacity-60">English:</p>
                  <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">{currentQ.explanationEn}</p>
                  <div className="h-px bg-blue-100 dark:bg-blue-800/30" />
                  <p className="text-xs font-bold opacity-60">Hindi:</p>
                  <p className="text-sm leading-relaxed text-slate-800 dark:text-slate-200">{currentQ.explanationHi}</p>
               </div>
            </div>
          )}
        </div>
      )}

      {selectedOption !== null && (
        <div className="fixed bottom-24 left-4 right-4 animate-slide-up">
          <button 
            onClick={nextQuestion}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 active:scale-95 transition-all"
          >
            {currentIdx === questions.length - 1 ? 'Finish Test' : 'Next Question'}
          </button>
        </div>
      )}

      {/* Add Question Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl md:rounded-3xl rounded-t-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-slide-up">
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-blue-50/30 dark:bg-slate-800/50">
              <div className="flex items-center gap-2">
                <PlusCircle size={20} className="text-blue-600" />
                <h3 className="font-black uppercase tracking-tight text-sm">Contribute MCQ</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddQuestion} className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Topic</label>
                  <select 
                    value={form.topic}
                    onChange={e => setForm({...form, topic: e.target.value})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Computer Fundamentals</option>
                    <option>Network Security</option>
                    <option>OS</option>
                    <option>DSA</option>
                    <option>OOPs</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Difficulty</label>
                  <select 
                    value={form.difficulty}
                    onChange={e => setForm({...form, difficulty: e.target.value as any})}
                    className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-blue-600 flex items-center gap-1">
                      <HelpCircle size={12} /> Question Text (English)
                    </label>
                    <textarea 
                      required
                      value={form.qEn}
                      onChange={e => setForm({...form, qEn: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 h-20"
                      placeholder="Type the English version of the question..."
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-indigo-600 flex items-center gap-1">
                      <HelpCircle size={12} /> Question Text (Hindi)
                    </label>
                    <textarea 
                      required
                      value={form.qHi}
                      onChange={e => setForm({...form, qHi: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 h-20 font-medium"
                      placeholder="प्रश्न का हिंदी संस्करण टाइप करें..."
                    />
                 </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 border-b pb-2">Options (A-D)</p>
                {[0, 1, 2, 3].map(idx => {
                  const letter = String.fromCharCode(65 + idx);
                  const keyEn = `opt${letter}_En` as keyof typeof form;
                  const keyHi = `opt${letter}_Hi` as keyof typeof form;
                  return (
                    <div key={idx} className="bg-gray-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-blue-600">Option {letter}</span>
                        <input 
                          type="radio" 
                          name="correct" 
                          checked={form.correctIndex === idx}
                          onChange={() => setForm({...form, correctIndex: idx})}
                          className="w-4 h-4"
                        />
                      </div>
                      <input 
                        required
                        value={form[keyEn] as string}
                        onChange={e => setForm({...form, [keyEn]: e.target.value})}
                        className="w-full bg-white dark:bg-slate-800 border border-gray-200 p-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`${letter} (English)`}
                      />
                      <input 
                        required
                        value={form[keyHi] as string}
                        onChange={e => setForm({...form, [keyHi]: e.target.value})}
                        className="w-full bg-white dark:bg-slate-800 border border-gray-200 p-2 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                        placeholder={`${letter} (Hindi)`}
                      />
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Explanation (English)</label>
                    <textarea 
                      required
                      value={form.explanationEn}
                      onChange={e => setForm({...form, explanationEn: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Explanation (Hindi)</label>
                    <textarea 
                      required
                      value={form.explanationHi}
                      onChange={e => setForm({...form, explanationHi: e.target.value})}
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 h-24 font-medium"
                    />
                 </div>
              </div>
            </form>

            <div className="p-5 bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800">
               <button 
                onClick={handleAddQuestion}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 active:scale-95 transition-all"
               >
                 <Save size={18} /> Submit Contribution
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailyQuizPage;
