
import React, { useState, useEffect } from 'react';
import { getNutritionRecommendations } from '../services/geminiService';
import { DailySummary } from '../types';

interface SmartNutritionAdvisorProps {
  summary: DailySummary;
}

interface Recommendation {
  title: string;
  reason: string;
  keyNutrient: string;
  estimatedCals: number;
}

const SmartNutritionAdvisor: React.FC<SmartNutritionAdvisorProps> = ({ summary }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);

  const remaining = {
    protein: Math.max(0, summary.goalProtein - summary.totalProtein),
    carbs: Math.max(0, summary.goalCarbs - summary.totalCarbs),
    fat: Math.max(0, summary.goalFat - summary.totalFat),
    calories: Math.max(0, summary.goal - summary.netCalories)
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const data = await getNutritionRecommendations(remaining);
      setRecommendations(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // 只有在剩餘熱量大於 100 且還沒有推薦或是 summary 發生重大變化時才更新
    if (remaining.calories > 100 && recommendations.length === 0) {
      fetchRecommendations();
    }
  }, [summary]);

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-lightbulb text-amber-400"></i>
          AI 飲食導師建議
        </h3>
        <button 
          onClick={fetchRecommendations}
          disabled={loading}
          className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 transition-colors uppercase tracking-widest flex items-center gap-1"
        >
          <i className={`fas fa-sync-alt ${loading ? 'fa-spin' : ''}`}></i>
          更新建議
        </button>
      </div>

      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
        根據您剩餘的 {remaining.calories} kcal 配額：
      </p>

      <div className="space-y-3">
        {loading ? (
          <div className="py-8 space-y-4">
            <div className="h-16 bg-slate-50 rounded-2xl animate-pulse"></div>
            <div className="h-16 bg-slate-50 rounded-2xl animate-pulse delay-75"></div>
          </div>
        ) : recommendations.length > 0 ? (
          recommendations.map((rec, idx) => (
            <div 
              key={idx} 
              className="group p-4 rounded-2xl border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-700 transition-colors">{rec.title}</h4>
                <span className="text-[9px] bg-white border border-slate-100 px-2 py-0.5 rounded-md font-black text-slate-400 uppercase">
                  ~{rec.estimatedCals} kcal
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[9px] font-black text-emerald-600 bg-emerald-100/50 px-1.5 py-0.5 rounded uppercase">
                  {rec.keyNutrient}
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed italic">
                「{rec.reason}」
              </p>
            </div>
          ))
        ) : (
          <div className="py-6 text-center text-slate-400">
             <i className="fas fa-check-circle text-emerald-100 text-3xl mb-2"></i>
             <p className="text-xs font-medium">目前的攝取已經非常完美囉！</p>
          </div>
        )}
      </div>

      <div className="pt-2">
        <div className="bg-slate-50 rounded-2xl p-3 flex items-center gap-3">
           <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs">
              <i className="fas fa-info"></i>
           </div>
           <p className="text-[10px] text-slate-500 font-medium leading-snug">
             建議優化：您今日{remaining.protein > 30 ? '蛋白質' : remaining.carbs > 50 ? '碳水' : '整體'}缺口較大，建議優先補充。
           </p>
        </div>
      </div>
    </div>
  );
};

export default SmartNutritionAdvisor;
