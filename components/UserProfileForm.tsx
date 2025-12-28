
import React from 'react';
import { UserProfile } from '../types';

interface UserProfileFormProps {
  profile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
}

const UserProfileForm: React.FC<UserProfileFormProps> = ({ profile, onUpdate }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (name.startsWith('remind_')) {
      const field = name.replace('remind_', '');
      onUpdate({
        ...profile,
        waterReminderSettings: {
          ...profile.waterReminderSettings,
          [field]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : Number(value)
        }
      });
      return;
    }

    onUpdate({
      ...profile,
      [name]: (name === 'activityLevel' || name === 'gender' || name === 'goalType') ? value : Number(value),
    });
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 mb-6 space-y-8">
      {/* 基本資料區塊 */}
      <section>
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-emerald-50 w-12 h-12 rounded-2xl flex items-center justify-center text-emerald-600 text-xl">
            <i className="fas fa-id-card"></i>
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">個人健康資料與目標</h2>
            <p className="text-xs text-slate-400">系統將根據您的目標自動調整每日建議熱量</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <i className="fas fa-calendar-day text-emerald-400"></i>年齡
            </label>
            <input
              type="number"
              name="age"
              value={profile.age}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <i className="fas fa-venus-mars text-emerald-400"></i>性別
            </label>
            <select
              name="gender"
              value={profile.gender}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
            >
              <option value="male">男性</option>
              <option value="female">女性</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <i className="fas fa-arrows-up-down text-emerald-400"></i>身高 (cm)
            </label>
            <input
              type="number"
              name="height"
              value={profile.height}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <i className="fas fa-weight-hanging text-emerald-400"></i>體重 (kg)
            </label>
            <input
              type="number"
              name="weight"
              value={profile.weight}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <i className="fas fa-person-running text-emerald-400"></i>活動量
            </label>
            <select
              name="activityLevel"
              value={profile.activityLevel}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-semibold"
            >
              <option value="sedentary">久坐不運動</option>
              <option value="light">輕度活動</option>
              <option value="moderate">中度運動</option>
              <option value="active">高度運動</option>
              <option value="veryActive">極高強度</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
              <i className="fas fa-bullseye text-emerald-400"></i>減重目標
            </label>
            <select
              name="goalType"
              value={profile.goalType}
              onChange={handleChange}
              className="w-full bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-emerald-500 outline-none transition-all text-sm font-bold text-emerald-700"
            >
              <option value="maintain">維持體態</option>
              <option value="lose">瘦身減脂</option>
              <option value="gain">增肌減脂</option>
            </select>
          </div>
        </div>
      </section>

      {/* 提醒設定區塊 */}
      <section className="pt-6 border-t border-slate-100">
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-blue-50 w-12 h-12 rounded-2xl flex items-center justify-center text-blue-600 text-xl">
            <i className="fas fa-bell"></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">飲水提醒時段設定</h2>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="remind_enabled"
                  checked={profile.waterReminderSettings.enabled}
                  onChange={handleChange}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            <p className="text-xs text-slate-400">設定您希望在一天中收到提醒的時間範圍與頻率</p>
          </div>
        </div>

        {profile.waterReminderSettings.enabled && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                <i className="fas fa-door-open text-blue-400"></i>開始提醒時間
              </label>
              <select
                name="remind_startHour"
                value={profile.waterReminderSettings.startHour}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                <i className="fas fa-door-closed text-blue-400"></i>結束提醒時間
              </label>
              <select
                name="remind_endHour"
                value={profile.waterReminderSettings.endHour}
                onChange={handleChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-semibold"
              >
                {Array.from({ length: 24 }).map((_, i) => (
                  <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 flex items-center gap-2">
                <i className="fas fa-hourglass-half text-blue-400"></i>提醒頻率 (小時)
              </label>
              <select
                name="remind_intervalHours"
                value={profile.waterReminderSettings.intervalHours}
                onChange={handleChange}
                className="w-full bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm font-bold text-blue-700"
              >
                <option value={1}>每 1 小時</option>
                <option value={2}>每 2 小時</option>
                <option value={3}>每 3 小時</option>
                <option value={4}>每 4 小時</option>
              </select>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

export default UserProfileForm;
