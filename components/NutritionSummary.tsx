
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { DailySummary, SocialPost } from '../types';

interface NutritionSummaryProps {
  summary: DailySummary;
  onShareAchievement?: (post: SocialPost) => void;
}

const NutritionSummary: React.FC<NutritionSummaryProps> = ({ summary, onShareAchievement }) => {
  const data = [
    { name: '蛋白質', value: summary.totalProtein, color: '#10b981' },
    { name: '碳水', value: summary.totalCarbs, color: '#3b82f6' },
    { name: '脂肪', value: summary.totalFat, color: '#f59e0b' },
  ].filter(d => d.value > 0);

  const stats = [
    { 
      label: '蛋白質', 
      value: summary.totalProtein, 
      goal: summary.goalProtein, 
      icon: 'fa-egg', 
      color: 'bg-emerald-100 text-emerald-600',
      barColor: 'bg-emerald-500'
    },
    { 
      label: '碳水', 
      value: summary.totalCarbs, 
      goal: summary.goalCarbs, 
      icon: 'fa-bread-slice', 
      color: 'bg-blue-100 text-blue-600',
      barColor: 'bg-blue-500'
    },
    { 
      label: '脂肪', 
      value: summary.totalFat, 
      goal: summary.goalFat, 
      icon: 'fa-cheese', 
      color: 'bg-amber-100 text-amber-600',
      barColor: 'bg-amber-500'
    },
  ];

  const netPercentage = Math.min((summary.netCalories / summary.goal) * 100, 100);
  const remaining = summary.goal - Math.round(summary.netCalories);
  const isOver = remaining < 0;

  const handleShareAchievement = () => {
    if (onShareAchievement) {
      const post: SocialPost = {
        id: crypto.randomUUID(),
        author: '我',
        type: 'achievement',
        content: `今日進度達成！我今天消耗了 ${Math.round(summary.totalBurned)} kcal，淨攝取 ${Math.round(summary.netCalories)} kcal，離目標更近一步了！💪`,
        timestamp: Date.now(),
        likes: 0,
        data: { foodName: '今日總結', calories: Math.round(summary.netCalories), protein: Math.round(summary.totalProtein), carbs: Math.round(summary.totalCarbs), fat: Math.round(summary.totalFat) }
      };
      onShareAchievement(post);
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 overflow-hidden space-y-6">
      {/* 淨熱量進度核心視圖 */}
      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <i className="fas fa-fire-alt text-orange-500"></i>
            熱量預算
          </h3>
          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${isOver ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
            {isOver ? '熱量超標' : `剩餘 ${remaining} kcal`}
          </span>
        </div>
        
        <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div 
            className={`h-full transition-all duration-1000 ease-out ${isOver ? 'bg-rose-500' : 'bg-gradient-to-r from-emerald-400 to-emerald-500'}`}
            style={{ width: `${Math.max(0, netPercentage)}%` }}
          />
        </div>
        
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>0 kcal</span>
          <span>目標 {summary.goal} kcal</span>
        </div>
      </div>

      <div className="h-px bg-slate-50" />

      {/* 宏量營養素圓餅圖 */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
            <i className="fas fa-chart-pie text-emerald-500 text-xs"></i>
            三大營養素比例
          </h3>
          <button 
            onClick={handleShareAchievement}
            className="text-[10px] bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg font-bold hover:bg-emerald-100 transition-all flex items-center gap-1"
          >
            <i className="fas fa-share-nodes"></i> 分享成就
          </button>
        </div>
        <div className="h-40 w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 italic text-xs">
              <i className="fas fa-chart-pie text-3xl mb-2 opacity-10"></i>
              暫無數據
            </div>
          )}
        </div>
      </div>

      {/* 營養素詳細進度條 */}
      <div className="space-y-4">
        {stats.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <div className="flex justify-between items-center text-[10px] font-bold">
              <span className="flex items-center gap-1 text-slate-500 uppercase">
                <i className={`fas ${stat.icon}`}></i> {stat.label}
              </span>
              <span className="text-slate-700">
                {Math.round(stat.value)}g / {stat.goal}g
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`${stat.barColor} h-full transition-all duration-700`}
                style={{ width: `${Math.min((stat.value / stat.goal) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部摘要卡片 */}
      <div className="grid grid-cols-3 gap-2 pt-2">
        {stats.map((stat) => (
          <div key={stat.label} className={`${stat.color} p-2 rounded-xl text-center shadow-sm`}>
            <div className="text-sm font-black leading-tight">{Math.round(stat.value)}g</div>
            <div className="text-[8px] font-bold uppercase opacity-60 tracking-tighter">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NutritionSummary;
