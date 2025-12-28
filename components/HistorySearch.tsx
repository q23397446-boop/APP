
import React, { useState, useMemo } from 'react';
import { MealLog, ExerciseLog } from '../types';

interface HistorySearchProps {
  meals: MealLog[];
  exercises: ExerciseLog[];
  onDeleteMeal: (id: string) => void;
  onDeleteExercise: (id: string) => void;
}

type FilterType = 'all' | 'meals' | 'exercises';

const HistorySearch: React.FC<HistorySearchProps> = ({ meals, exercises, onDeleteMeal, onDeleteExercise }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');

  const filteredResults = useMemo(() => {
    let combined: Array<(MealLog | ExerciseLog) & { category: 'meal' | 'exercise' }> = [];
    
    if (typeFilter === 'all' || typeFilter === 'meals') {
      combined = [...combined, ...meals.map(m => ({ ...m, category: 'meal' as const }))];
    }
    if (typeFilter === 'all' || typeFilter === 'exercises') {
      combined = [...combined, ...exercises.map(e => ({ ...e, category: 'exercise' as const }))];
    }

    // Keyword filter
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      combined = combined.filter(item => {
        if (item.category === 'meal') {
          return (item as MealLog).foodName.toLowerCase().includes(lowerSearch);
        } else {
          return (item as ExerciseLog).type.toLowerCase().includes(lowerSearch);
        }
      });
    }

    // Date range filter
    if (startDate) {
      const start = new Date(startDate).getTime();
      combined = combined.filter(item => item.timestamp >= start);
    }
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      combined = combined.filter(item => item.timestamp <= end.getTime());
    }

    // Sort by most recent
    return combined.sort((a, b) => b.timestamp - a.timestamp);
  }, [meals, exercises, searchTerm, startDate, endDate, typeFilter]);

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 space-y-6">
      <div className="flex items-center gap-3">
        <div className="bg-emerald-50 p-2 rounded-xl">
          <i className="fas fa-search text-emerald-600"></i>
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">搜尋歷史紀錄</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Advanced Search</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">關鍵字</label>
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="搜尋食物或運動名稱..."
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
          />
        </div>
        <div>
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">分類</label>
          <select 
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as FilterType)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-bold text-slate-700"
          >
            <option value="all">全部類型</option>
            <option value="meals">飲食紀錄</option>
            <option value="exercises">運動紀錄</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">從</label>
            <input 
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">至</label>
            <input 
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3 py-3 text-xs focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
            />
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            搜尋結果 ({filteredResults.length})
          </span>
          {(searchTerm || startDate || endDate || typeFilter !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setStartDate('');
                setEndDate('');
                setTypeFilter('all');
              }}
              className="text-[10px] font-bold text-rose-500 hover:underline uppercase tracking-widest"
            >
              重設篩選
            </button>
          )}
        </div>

        <div className="max-h-96 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
          {filteredResults.length > 0 ? (
            filteredResults.map((item) => (
              <div 
                key={item.id} 
                className={`bg-slate-50 rounded-2xl p-4 flex items-center justify-between group hover:bg-white border border-transparent hover:border-slate-100 transition-all shadow-sm hover:shadow-md`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.category === 'meal' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                    <i className={`fas ${item.category === 'meal' ? 'fa-utensils' : 'fa-person-running'}`}></i>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      {item.category === 'meal' ? (item as MealLog).foodName : (item as ExerciseLog).type}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {formatDate(item.timestamp)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className={`font-black ${item.category === 'meal' ? 'text-emerald-600' : 'text-blue-600'}`}>
                      {item.category === 'meal' ? `+${(item as MealLog).calories}` : `-${(item as ExerciseLog).caloriesBurned}`}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 block uppercase tracking-tighter">kcal</span>
                  </div>
                  <button 
                    onClick={() => item.category === 'meal' ? onDeleteMeal(item.id) : onDeleteExercise(item.id)}
                    className="text-slate-300 hover:text-rose-400 transition-colors p-2"
                  >
                    <i className="fas fa-trash-alt text-xs"></i>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center">
              <i className="fas fa-search text-3xl text-slate-100 mb-3 block"></i>
              <p className="text-sm text-slate-400 font-medium">找不到符合條件的紀錄</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistorySearch;
