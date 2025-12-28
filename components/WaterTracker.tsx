
import React, { useState } from 'react';
import { WaterLog } from '../types';

interface WaterTrackerProps {
  logs: WaterLog[];
  goal: number;
  onAddWater: (amount: number) => void;
  onReset: () => void;
}

const WaterTracker: React.FC<WaterTrackerProps> = ({ logs, goal, onAddWater, onReset }) => {
  const [customAmount, setCustomAmount] = useState('');
  
  const totalWater = logs.reduce((sum, log) => sum + log.amount, 0);
  const percentage = Math.min((totalWater / goal) * 100, 100);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customAmount);
    if (val > 0) {
      onAddWater(val);
      setCustomAmount('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <i className="fas fa-droplet text-blue-500"></i>
          每日飲水追蹤
        </h3>
        <button 
          onClick={onReset}
          className="text-[10px] font-bold text-slate-400 hover:text-rose-500 transition-colors uppercase tracking-widest"
        >
          重設
        </button>
      </div>

      <div className="flex flex-col items-center py-4 relative">
        {/* Visual Water Tank / Progress */}
        <div className="w-24 h-32 bg-slate-50 border-4 border-slate-100 rounded-2xl relative overflow-hidden shadow-inner">
           <div 
            className="absolute bottom-0 left-0 right-0 bg-blue-400 transition-all duration-1000 ease-in-out flex items-center justify-center overflow-hidden"
            style={{ height: `${percentage}%` }}
           >
              <div className="absolute top-0 left-[-100%] right-[-100%] h-4 bg-blue-300 opacity-50 animate-pulse rounded-full blur-md"></div>
           </div>
           <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
              <span className={`text-lg font-black ${percentage > 50 ? 'text-white' : 'text-blue-600'}`}>
                {totalWater}
              </span>
              <span className={`text-[10px] font-bold ${percentage > 50 ? 'text-blue-100' : 'text-slate-400'} uppercase`}>
                ml
              </span>
           </div>
        </div>
        <p className="mt-4 text-xs font-bold text-slate-500">目標: {goal} ml</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => onAddWater(250)}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 py-3 rounded-2xl flex flex-col items-center transition-all active:scale-95"
        >
          <i className="fas fa-glass-water mb-1"></i>
          <span className="text-xs font-bold">一杯 (250ml)</span>
        </button>
        <button 
          onClick={() => onAddWater(500)}
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 py-3 rounded-2xl flex flex-col items-center transition-all active:scale-95"
        >
          <i className="fas fa-bottle-water mb-1"></i>
          <span className="text-xs font-bold">一瓶 (500ml)</span>
        </button>
      </div>

      <form onSubmit={handleCustomSubmit} className="relative">
        <input 
          type="number"
          value={customAmount}
          onChange={(e) => setCustomAmount(e.target.value)}
          placeholder="自定義毫升 (ml)"
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-400 outline-none transition-all"
        />
        <button 
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 text-white p-2 rounded-xl hover:bg-blue-600 transition-colors"
        >
          <i className="fas fa-plus"></i>
        </button>
      </form>
    </div>
  );
};

export default WaterTracker;
