
import React from 'react';
import { Settings, LogOut, ChevronRight, Award, Flame, Target, BookOpen } from 'lucide-react';
import { useApp } from '../App';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const DashboardPage: React.FC = () => {
  const { t } = useApp();

  const data = [
    { name: 'Completed', value: 400 },
    { name: 'Remaining', value: 300 },
  ];
  const COLORS = ['#2563eb', '#e2e8f0'];

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
            <img 
              src="https://picsum.photos/200" 
              alt="Avatar" 
              className="w-full h-full rounded-full border-2 border-white dark:border-slate-900 object-cover" 
            />
          </div>
          <div>
            <h2 className="text-xl font-bold">Rahul Sharma</h2>
            <p className="text-xs text-gray-500 font-medium">Basic Instructor Aspirant</p>
          </div>
        </div>
        <button className="p-2 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
          <Settings size={20} className="text-gray-400" />
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 text-center">
          <div className="flex justify-center mb-1"><Flame size={20} className="text-orange-500" /></div>
          <p className="text-lg font-black">12</p>
          <p className="text-[10px] font-medium text-gray-500 uppercase">Day Streak</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 text-center">
          <div className="flex justify-center mb-1"><Target size={20} className="text-blue-500" /></div>
          <p className="text-lg font-black">850</p>
          <p className="text-[10px] font-medium text-gray-500 uppercase">Questions</p>
        </div>
        <div className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-gray-100 dark:border-slate-800 text-center">
          <div className="flex justify-center mb-1"><Award size={20} className="text-yellow-500" /></div>
          <p className="text-lg font-black">124</p>
          <p className="text-[10px] font-medium text-gray-500 uppercase">Rank</p>
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

      {/* Quick Menu */}
      <div className="space-y-2">
        <button className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <Award className="text-indigo-500" size={20} />
            <span className="font-semibold text-sm">View Certificates</span>
          </div>
          <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500" />
        </button>
        <button className="w-full p-4 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl flex items-center justify-between group">
          <div className="flex items-center gap-3">
            <BookOpen className="text-green-500" size={20} />
            <span className="font-semibold text-sm">Bookmarks</span>
          </div>
          <ChevronRight size={18} className="text-gray-300 group-hover:text-blue-500" />
        </button>
        <button className="w-full p-4 text-red-500 font-bold text-sm flex items-center justify-center gap-2 mt-4">
          <LogOut size={18} /> Logout
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
