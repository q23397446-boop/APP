
import React from 'react';
import { MealLog, ExerciseLog, WaterLog, DailySummary, UserProfile } from '../types';

interface HealthReportProps {
  summary: DailySummary;
  meals: MealLog[];
  exercises: ExerciseLog[];
  waterLogs: WaterLog[];
  profile: UserProfile;
}

const HealthReport: React.FC<HealthReportProps> = ({ summary, meals, exercises, waterLogs, profile }) => {
  const dateStr = new Date().toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' });
  const totalWater = waterLogs.reduce((sum, l) => sum + l.amount, 0);

  return (
    <div className="print-report bg-white text-slate-800">
      {/* Report Header */}
      <div className="border-b-4 border-emerald-600 pb-6 mb-8 flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <i className="fas fa-leaf text-3xl"></i>
            <span className="text-2xl font-black tracking-tighter">AI 卡路里大師</span>
          </div>
          <h1 className="text-3xl font-bold">每日健康報告</h1>
          <p className="text-slate-400 font-medium">個人健康管理數據存檔</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">報告日期</p>
          <p className="text-xl font-bold">{dateStr}</p>
        </div>
      </div>

      {/* Profile & BMI Section */}
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">基本資料</p>
          <div className="space-y-1">
            <p className="text-sm"><b>年齡：</b> {profile.age} 歲</p>
            <p className="text-sm"><b>身高/體重：</b> {profile.height}cm / {profile.weight}kg</p>
            <p className="text-sm"><b>目標：</b> {profile.goalType === 'lose' ? '瘦身減脂' : profile.goalType === 'gain' ? '增肌' : '維持體態'}</p>
          </div>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">BMI 指數</p>
          <p className="text-2xl font-black text-emerald-600">{summary.bmi.toFixed(1)}</p>
          <p className="text-xs text-slate-500 font-medium">狀態：{summary.bmi < 18.5 ? '過輕' : summary.bmi < 24 ? '正常' : '過重'}</p>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-1">水分攝取</p>
          <p className="text-2xl font-black text-blue-600">{totalWater} <span className="text-sm">ml</span></p>
          <p className="text-xs text-slate-500 font-medium">今日進度：{Math.round((totalWater / (profile.waterGoal || 2000)) * 100)}%</p>
        </div>
      </div>

      {/* Calorie Balance */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 border-l-4 border-emerald-500 pl-3">熱量平衡總覽</h2>
        <div className="bg-slate-900 text-white p-6 rounded-3xl flex justify-around items-center">
          <div className="text-center">
            <p className="text-[10px] opacity-60 font-bold uppercase mb-1">攝取熱量</p>
            <p className="text-2xl font-black">{Math.round(summary.totalCalories)}</p>
          </div>
          <div className="text-2xl opacity-20 font-light">−</div>
          <div className="text-center">
            <p className="text-[10px] opacity-60 font-bold uppercase mb-1">運動消耗</p>
            <p className="text-2xl font-black">{Math.round(summary.totalBurned)}</p>
          </div>
          <div className="text-2xl opacity-20 font-light">=</div>
          <div className="text-center">
            <p className="text-[10px] opacity-60 font-bold uppercase mb-1">淨攝取熱量</p>
            <p className="text-3xl font-black text-emerald-400">{Math.round(summary.netCalories)}</p>
          </div>
          <div className="h-10 w-px bg-white/10"></div>
          <div className="text-center">
            <p className="text-[10px] opacity-60 font-bold uppercase mb-1">今日目標</p>
            <p className="text-2xl font-black opacity-80">{summary.goal}</p>
          </div>
        </div>
      </div>

      {/* Nutrients Breakdown */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 border-l-4 border-emerald-500 pl-3">營養素分佈</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="border border-slate-100 p-4 rounded-2xl">
            <p className="text-xs font-bold text-emerald-600 mb-1">蛋白質</p>
            <p className="text-xl font-black">{Math.round(summary.totalProtein)}g / {summary.goalProtein}g</p>
          </div>
          <div className="border border-slate-100 p-4 rounded-2xl">
            <p className="text-xs font-bold text-blue-600 mb-1">碳水化合物</p>
            <p className="text-xl font-black">{Math.round(summary.totalCarbs)}g / {summary.goalCarbs}g</p>
          </div>
          <div className="border border-slate-100 p-4 rounded-2xl">
            <p className="text-xs font-bold text-amber-600 mb-1">脂肪</p>
            <p className="text-xl font-black">{Math.round(summary.totalFat)}g / {summary.goalFat}g</p>
          </div>
        </div>
      </div>

      {/* Meals Table */}
      <div className="mb-10">
        <h2 className="text-lg font-bold mb-4 border-l-4 border-emerald-500 pl-3">飲食詳細清單</h2>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50">
              <th className="p-3 border-b text-xs font-black text-slate-400 uppercase">時間</th>
              <th className="p-3 border-b text-xs font-black text-slate-400 uppercase">食物名稱</th>
              <th className="p-3 border-b text-xs font-black text-slate-400 uppercase">份量</th>
              <th className="p-3 border-b text-xs font-black text-slate-400 uppercase text-right">卡路里</th>
            </tr>
          </thead>
          <tbody>
            {meals.map(meal => (
              <tr key={meal.id}>
                <td className="p-3 border-b text-sm">{new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                <td className="p-3 border-b text-sm font-bold">{meal.foodName}</td>
                <td className="p-3 border-b text-sm">{meal.servingSize}</td>
                <td className="p-3 border-b text-sm text-right font-black text-emerald-600">{meal.calories} kcal</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-20 pt-10 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-300 font-medium">此報告由 AI 卡路里大師 自動生成 • 僅供健康參考</p>
      </div>
    </div>
  );
};

export default HealthReport;
