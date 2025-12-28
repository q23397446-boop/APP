
import React from 'react';
import { ExerciseLog } from '../types';

interface ExerciseHistoryProps {
  exercises: ExerciseLog[];
  onDelete: (id: string) => void;
}

const ExerciseHistory: React.FC<ExerciseHistoryProps> = ({ exercises, onDelete }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-bolt text-blue-500"></i>
          今日運動表現
        </h2>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-bold">
          {exercises.length} 筆活動
        </span>
      </div>

      {exercises.length === 0 ? (
        <div className="bg-white border border-dashed border-slate-200 rounded-3xl p-8 text-center text-slate-400">
          <p className="text-sm">尚未有運動記錄。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {exercises.map((ex) => (
            <div key={ex.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-50 flex items-center justify-between group hover:border-blue-200 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <i className="fas fa-person-running"></i>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm capitalize">{ex.type}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {ex.duration} 分鐘 • {new Date(ex.timestamp).toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <span className="text-blue-600 font-black">-{ex.caloriesBurned}</span>
                  <span className="text-[8px] font-bold text-blue-400 block uppercase">kcal</span>
                </div>
                <button 
                  onClick={() => onDelete(ex.id)}
                  className="text-slate-300 hover:text-rose-400 transition-colors p-1"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseHistory;
