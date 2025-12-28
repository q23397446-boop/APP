
import React, { useState } from 'react';
import { MealLog, SocialPost } from '../types';

interface MealHistoryProps {
  meals: MealLog[];
  onDelete: (id: string) => void;
  onUpdate: (meal: MealLog) => void;
  onShareToCommunity?: (post: SocialPost) => void;
}

const MealHistory: React.FC<MealHistoryProps> = ({ meals, onDelete, onUpdate, onShareToCommunity }) => {
  const [editingMeal, setEditingMeal] = useState<MealLog | null>(null);

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMeal) {
      onUpdate(editingMeal);
      setEditingMeal(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingMeal) return;
    const { name, value } = e.target;
    setEditingMeal({
      ...editingMeal,
      [name]: name === 'foodName' || name === 'servingSize' ? value : Number(value),
    });
  };

  const handleShare = (meal: MealLog) => {
    if (onShareToCommunity) {
      const post: SocialPost = {
        id: crypto.randomUUID(),
        author: '我',
        type: 'recipe',
        content: `今天吃了超級美味的「${meal.foodName}」，營養均衡又好吃！分享給大家。`,
        timestamp: Date.now(),
        likes: 0,
        data: meal
      };
      onShareToCommunity(post);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-history text-emerald-500"></i>
          今日飲食時間軸
        </h2>
        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full font-bold">
          共 {meals.length} 份記錄
        </span>
      </div>

      {meals.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
          <div className="bg-slate-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
             <i className="fas fa-bowl-rice text-2xl"></i>
          </div>
          <p className="font-medium">今天還沒有記錄餐點。</p>
          <p className="text-sm">從上方描述您的飲食開始吧！</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {meals.map((meal) => (
            <div key={meal.id} className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex gap-4 group hover:border-emerald-200 transition-all">
              {meal.imageUrl ? (
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-50">
                  <img src={meal.imageUrl} alt={meal.foodName} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-300">
                  <i className="fas fa-utensils text-2xl"></i>
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div className="truncate pr-2">
                    <h4 className="font-bold text-slate-800 truncate capitalize">{meal.foodName}</h4>
                    <p className="text-xs text-slate-400 font-medium">
                      {new Date(meal.timestamp).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })} • {meal.servingSize}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => handleShare(meal)}
                      className="text-slate-300 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="分享到社群"
                    >
                      <i className="fas fa-share-alt text-xs"></i>
                    </button>
                    <button 
                      onClick={() => setEditingMeal(meal)}
                      className="text-slate-300 hover:text-emerald-500 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="編輯"
                    >
                      <i className="fas fa-pencil-alt text-xs"></i>
                    </button>
                    <button 
                      onClick={() => onDelete(meal.id)}
                      className="text-slate-300 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all p-1"
                      title="刪除"
                    >
                      <i className="fas fa-trash-alt text-xs"></i>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mt-3">
                  <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg text-[10px] font-bold">
                    {Math.round(meal.calories)} kcal
                  </div>
                  <div className="flex gap-2 text-[10px] text-slate-500 font-medium pt-1">
                    <span>蛋: {Math.round(meal.protein)}g</span>
                    <span>碳: {Math.round(meal.carbs)}g</span>
                    <span>脂: {Math.round(meal.fat)}g</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 編輯 Modal */}
      {editingMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <i className="fas fa-edit text-emerald-500"></i>
                修改飲食記錄
              </h3>
              <button onClick={() => setEditingMeal(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 ml-1">食物名稱</label>
                <input
                  type="text"
                  name="foodName"
                  value={editingMeal.foodName}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1">份量描述</label>
                  <input
                    type="text"
                    name="servingSize"
                    value={editingMeal.servingSize}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1">熱量 (kcal)</label>
                  <input
                    type="number"
                    name="calories"
                    value={editingMeal.calories}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 text-emerald-600">蛋白質 (g)</label>
                  <input
                    type="number"
                    name="protein"
                    value={editingMeal.protein}
                    onChange={handleInputChange}
                    className="w-full bg-emerald-50/50 border border-emerald-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 text-blue-600">碳水 (g)</label>
                  <input
                    type="number"
                    name="carbs"
                    value={editingMeal.carbs}
                    onChange={handleInputChange}
                    className="w-full bg-blue-50/50 border border-blue-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 ml-1 text-amber-600">脂肪 (g)</label>
                  <input
                    type="number"
                    name="fat"
                    value={editingMeal.fat}
                    onChange={handleInputChange}
                    className="w-full bg-amber-50/50 border border-amber-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-amber-500 outline-none transition-all text-sm font-semibold"
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditingMeal(null)}
                  className="flex-1 py-4 bg-slate-100 text-slate-500 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-2 py-4 bg-emerald-600 text-white font-bold rounded-2xl hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all px-8"
                >
                  確認修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MealHistory;
