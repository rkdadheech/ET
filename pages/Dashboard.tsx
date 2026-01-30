
import React, { useState, useEffect } from 'react';
import { Settings, LogOut, ChevronRight, Award, Flame, Target, BookOpen, Clock, History, Timer, Coffee, Trash2, ExternalLink } from 'lucide-react';
import { useApp } from '../App';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';
import { StudySession, SavedResource } from '../types';

const DashboardPage: React.FC = () => {
  const { t, totalStudySeconds, lang, user, logout } = useApp();
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [savedResources, setSavedResources] = useState<SavedResource[]>([]);

  useEffect(() => {
    const sessionData = JSON.parse(localStorage.getItem('studySessions') || '[]');
    const resourceData = JSON.parse(localStorage.getItem('savedResources') || '[]');
    setSessions(sessionData);
    setSavedResources(resourceData);
  }, [totalStudySeconds]);

  const removeResource = (uri: string) => {
    const updated = savedResources.filter(r => r.uri !== uri);
    localStorage.setItem('savedResources', JSON.stringify(updated));
    setSavedResources(updated);
  };

  const formatTotalTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  const formatSessionTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  };

  const weeklyData = [
    { day: 'Mon', score: 45 },
    { day: 'Tue', score: 52 },
    { day: 'Wed', score: 48 },
    { day: 'Thu', score: 70 },
    { day: 'Fri', score: 61 },
    { day: 'Sat', score: 85 },
    { day: 'Sun', score: 77 },
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 p-1">
            <div className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 bg-white dark:bg-slate-800 flex items-center justify-center text-2xl font-black text-blue-600">
              {user?.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-xs text-gray-500 font-medium">{user?.examType} Instructor Aspirant</p>
          </div>
        </div>
        <button className="p-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
          <Settings size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 text-center">
          <div className="flex justify-center mb-1"><Flame size={20} className="text-orange-500" /></div>
          <p className="text-lg font-black">12</p>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">Day Streak</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 text-center">
          <div className="flex justify-center mb-1"><Target size={20} className="text-blue-500" /></div>
          <p className="text-lg font-black">850</p>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">Questions</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 text-center">
          <div className="flex justify-center mb-1"><Clock size={20} className="text-purple-500" /></div>
          <p className="text-lg font-black">{formatTotalTime(totalStudySeconds)}</p>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">{t('totalStudyTime')}</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 text-center">
          <div className="flex justify-center mb-1"><Award size={20} className="text-yellow-500" /></div>
          <p className="text-lg font-black">124</p>
          <p className="text-[10px] font-medium text-gray-500 uppercase tracking-tighter">Rank</p>
        </div>
      </div>

      {/* Analytics */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800">
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <BookOpen size={18} className="text-blue-600" /> Learning Analytics
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={10} />
              <Tooltip cursor={{fill: '#f1f5f9'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              <Bar dataKey="score" fill="#2563eb" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Saved Resources Section */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <BookOpen size={18} className="text-amber-500" /> Saved Resources
          </h3>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{savedResources.length} saved</span>
        </div>
        
        <div className="grid gap-3">
          {savedResources.length > 0 ? savedResources.map((res) => (
            <div key={res.uri} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800 group">
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600">
                   <ExternalLink size={16} />
                </div>
                <div className="min-w-0">
                  <a 
                    href={res.uri} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-sm font-bold truncate block hover:text-blue-600 transition-colors"
                  >
                    {res.title}
                  </a>
                  <p className="text-[10px] text-gray-400 truncate">{new URL(res.uri).hostname}</p>
                </div>
              </div>
              <button 
                onClick={() => removeResource(res.uri)}
                className="p-2 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 size={16} />
              </button>
            </div>
          )) : (
            <div className="text-center py-6 text-gray-400">
               <BookOpen size={32} className="mx-auto mb-2 opacity-20" />
               <p className="text-sm">No bookmarks yet. Explore study materials!</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Log */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-gray-100 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <History size={18} className="text-indigo-600" /> Recent Study Logs
          </h3>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{sessions.length} sessions</span>
        </div>
        
        <div className="space-y-3">
          {sessions.length > 0 ? sessions.slice(0, 5).map((session) => (
            <div key={session.id} className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-slate-800/50 border border-gray-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${session.mode === 'pomodoro' ? 'bg-indigo-100 text-indigo-600' : 'bg-blue-100 text-blue-600'}`}>
                  {session.mode === 'pomodoro' ? <Coffee size={16} /> : <Timer size={16} />}
                </div>
                <div>
                  <p className="text-sm font-bold capitalize">{session.mode}</p>
                  <p className="text-[10px] text-gray-400">{new Date(session.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              <p className="text-sm font-black text-slate-700 dark:text-slate-300">+{formatSessionTime(session.duration)}</p>
            </div>
          )) : (
            <div className="text-center py-6 text-gray-400">
               <Clock size={32} className="mx-auto mb-2 opacity-20" />
               <p className="text-sm">No sessions logged yet. Start studying!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Menu */}
      <div className="space-y-2">
        <button className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <Award className="text-indigo-500" size={20} />
            <span className="font-semibold text-sm">View Certificates</span>
          </div>
          <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500" />
        </button>
        <button 
          onClick={logout}
          className="w-full p-4 text-red-500 font-bold text-sm flex items-center justify-center gap-2 mt-4"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
