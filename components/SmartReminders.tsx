
import React, { useMemo } from 'react';
import { MealLog, WaterLog, UserProfile } from '../types';

interface SmartRemindersProps {
  meals: MealLog[];
  waterLogs: WaterLog[];
  onQuickWater: (amount: number) => void;
  profile: UserProfile;
}

const SmartReminders: React.FC<SmartRemindersProps> = ({ meals, waterLogs, onQuickWater, profile }) => {
  const now = Date.now();
  const settings = profile.waterReminderSettings;

  const reminders = useMemo(() => {
    const list = [];
    const currentHour = new Date().getHours();
    
    // 飲水提醒邏輯
    if (settings.enabled && currentHour >= settings.startHour && currentHour < settings.endHour) {
      const intervalMs = settings.intervalHours * 60 * 60 * 1000;
      const lastWater = waterLogs.length > 0 
        ? Math.max(...waterLogs.map(l => l.timestamp)) 
        : new Date().setHours(settings.startHour, 0, 0, 0);
      
      if (now - lastWater > intervalMs) {
        list.push({
          id: 'water',
          type: 'water',
          icon: 'fa-droplet',
          color: 'blue',
          title: '該喝水囉！',
          message: `根據您的設定 (每 ${settings.intervalHours} 小時)，現在是補充水分的好時機。`,
          actionLabel: '喝 250ml',
          action: () => onQuickWater(250)
        });
      }
    }

    // 飲食提醒 (保持原有邏輯，但稍微優化)
    if (currentHour >= 7 && currentHour <= 22) {
      const lastMeal = meals.length > 0 
        ? Math.max(...meals.map(m => m.timestamp)) 
        : new Date().setHours(7, 0, 0, 0);

      const fiveHoursMs = 5 * 60 * 60 * 1000;
      if (now - lastMeal > fiveHoursMs) {
        list.push({
          id: 'meal',
          type: 'meal',
          icon: 'fa-utensils',
          color: 'emerald',
          title: '紀錄下一餐？',
          message: '長時間未進食可能會導致血糖波動，如果有吃點心也別忘了紀錄。',
        });
      }
    }

    return list;
  }, [meals, waterLogs, now, onQuickWater, settings]);

  if (reminders.length === 0) return null;

  return (
    <div className="space-y-3 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex items-center gap-2 px-1">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
        </span>
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">智慧健康提醒</h3>
      </div>
      
      {reminders.map((reminder) => (
        <div 
          key={reminder.id}
          className={`bg-white border-l-4 ${reminder.type === 'water' ? 'border-blue-500' : 'border-emerald-500'} p-4 rounded-2xl shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow`}
        >
          <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center ${reminder.type === 'water' ? 'bg-blue-50 text-blue-500' : 'bg-emerald-50 text-emerald-500'}`}>
            <i className={`fas ${reminder.icon}`}></i>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold text-slate-800">{reminder.title}</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{reminder.message}</p>
            {reminder.action && (
              <button 
                onClick={reminder.action}
                className="mt-3 text-[10px] font-bold bg-blue-500 text-white px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors uppercase tracking-wider shadow-sm"
              >
                {reminder.actionLabel}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SmartReminders;
