
import React, { useState, useEffect, useMemo } from 'react';
import { MealLog, ExerciseLog, WaterLog, DailySummary, UserProfile, GoalType, SocialPost } from './types';
import FoodLogger from './components/FoodLogger';
import ExerciseLogger from './components/ExerciseLogger';
import NutritionSummary from './components/NutritionSummary';
import MealHistory from './components/MealHistory';
import ExerciseHistory from './components/ExerciseHistory';
import UserProfileForm from './components/UserProfileForm';
import WaterTracker from './components/WaterTracker';
import SmartReminders from './components/SmartReminders';
import HistorySearch from './components/HistorySearch';
import HealthReport from './components/HealthReport';
import SocialCommunity from './components/SocialCommunity';
import SmartNutritionAdvisor from './components/SmartNutritionAdvisor';

const DEFAULT_PROFILE: UserProfile = {
  age: 25,
  weight: 65,
  height: 170,
  gender: 'male',
  activityLevel: 'light',
  goalType: 'maintain',
  waterGoal: 2000,
  waterReminderSettings: {
    enabled: true,
    startHour: 8,
    endHour: 22,
    intervalHours: 3
  }
};

const INITIAL_POSTS: SocialPost[] = [
  {
    id: 'p1',
    author: '健康達人',
    type: 'achievement',
    content: '今天成功達成了熱量目標！感覺很有成就感。',
    timestamp: Date.now() - 3600000,
    likes: 12,
  },
  {
    id: 'p2',
    author: '美食專家',
    type: 'recipe',
    content: '分享我的高蛋白低卡晚餐：香煎雞胸肉佐花椰菜。',
    timestamp: Date.now() - 7200000,
    likes: 24,
    data: { foodName: '香煎雞胸肉', calories: 350, protein: 45, carbs: 10, fat: 8 }
  }
];

const App: React.FC = () => {
  const [meals, setMeals] = useState<MealLog[]>([]);
  const [exercises, setExercises] = useState<ExerciseLog[]>([]);
  const [waterLogs, setWaterLogs] = useState<WaterLog[]>([]);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS);
  
  const [showProfile, setShowProfile] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const savedMeals = localStorage.getItem('mealLogs');
    const savedExercises = localStorage.getItem('exerciseLogs');
    const savedWater = localStorage.getItem('waterLogs');
    const savedProfile = localStorage.getItem('userProfile');
    const savedPosts = localStorage.getItem('socialPosts');
    const today = new Date().setHours(0,0,0,0);
    
    if (savedMeals) {
      try {
        const parsed = JSON.parse(savedMeals);
        setMeals(parsed);
      } catch (e) { console.error(e); }
    }

    if (savedExercises) {
      try {
        const parsed = JSON.parse(savedExercises);
        setExercises(parsed);
      } catch (e) { console.error(e); }
    }

    if (savedWater) {
      try {
        const parsed = JSON.parse(savedWater);
        setWaterLogs(parsed.filter((w: WaterLog) => w.timestamp >= today));
      } catch (e) { console.error(e); }
    }
    
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile({ ...DEFAULT_PROFILE, ...parsedProfile });
      } catch (e) { console.error(e); }
    }

    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) { console.error(e); }
    }
  }, []);

  const todayMeals = useMemo(() => {
    const today = new Date().setHours(0,0,0,0);
    return meals.filter(m => m.timestamp >= today);
  }, [meals]);

  const todayExercises = useMemo(() => {
    const today = new Date().setHours(0,0,0,0);
    return exercises.filter(ex => ex.timestamp >= today);
  }, [exercises]);

  const stats = useMemo(() => {
    const heightM = profile.height / 100;
    const bmi = profile.height > 0 ? profile.weight / (heightM * heightM) : 0;

    let bmr = (10 * profile.weight) + (6.25 * profile.height) - (5 * profile.age);
    bmr = profile.gender === 'male' ? bmr + 5 : bmr - 161;

    const activityFactors = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      veryActive: 1.9
    };

    const tdee = bmr * activityFactors[profile.activityLevel];
    
    let goalCalories = tdee;
    if (profile.goalType === 'lose') goalCalories -= 500;
    if (profile.goalType === 'gain') goalCalories += 300;

    let goalProtein = profile.weight * (profile.goalType === 'lose' ? 2.2 : profile.goalType === 'gain' ? 2.0 : 1.8);
    let goalFat = (goalCalories * (profile.goalType === 'maintain' ? 0.3 : 0.25)) / 9;
    let goalCarbs = (goalCalories - (goalProtein * 4) - (goalFat * 9)) / 4;

    return { 
      bmi, 
      tdee: Math.round(goalCalories),
      goalProtein: Math.round(goalProtein),
      goalFat: Math.round(goalFat),
      goalCarbs: Math.round(goalCarbs)
    };
  }, [profile]);

  const summary = useMemo<DailySummary>(() => {
    const totalCalories = todayMeals.reduce((sum, m) => sum + m.calories, 0);
    const totalBurned = todayExercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);
    
    return {
      totalCalories,
      totalProtein: todayMeals.reduce((sum, m) => sum + m.protein, 0),
      totalFat: todayMeals.reduce((sum, m) => sum + m.fat, 0),
      totalCarbs: todayMeals.reduce((sum, m) => sum + m.carbs, 0),
      totalBurned,
      netCalories: totalCalories - totalBurned,
      goal: stats.tdee,
      goalProtein: stats.goalProtein,
      goalFat: stats.goalFat,
      goalCarbs: stats.goalCarbs,
      bmi: stats.bmi,
      goalType: profile.goalType 
    };
  }, [todayMeals, todayExercises, stats, profile.goalType]);

  useEffect(() => {
    localStorage.setItem('mealLogs', JSON.stringify(meals));
    localStorage.setItem('exerciseLogs', JSON.stringify(exercises));
    localStorage.setItem('waterLogs', JSON.stringify(waterLogs));
    localStorage.setItem('userProfile', JSON.stringify(profile));
    localStorage.setItem('socialPosts', JSON.stringify(posts));
  }, [meals, exercises, waterLogs, profile, posts]);

  const handleAddMeal = (meal: MealLog) => setMeals(prev => [meal, ...prev]);
  const handleUpdateMeal = (updated: MealLog) => setMeals(prev => prev.map(m => m.id === updated.id ? updated : m));
  const handleDeleteMeal = (id: string) => setMeals(prev => prev.filter(m => m.id !== id));

  const handleAddExercise = (ex: ExerciseLog) => setExercises(prev => [ex, ...prev]);
  const handleDeleteExercise = (id: string) => setExercises(prev => prev.filter(ex => ex.id !== id));

  const handleAddWater = (amount: number) => {
    const newLog: WaterLog = { id: crypto.randomUUID(), amount, timestamp: Date.now() };
    setWaterLogs(prev => [...prev, newLog]);
  };
  const handleResetWater = () => setWaterLogs([]);

  const handleExportPdf = () => {
    window.print();
  };

  const handleAddPost = (post: SocialPost) => {
    setPosts(prev => [post, ...prev]);
    setShowCommunity(true);
  };

  const handleLikePost = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
  };

  const bmiCategory = summary.bmi < 18.5 ? '過輕' : summary.bmi < 24 ? '正常' : summary.bmi < 27 ? '過重' : '肥胖';
  const bmiColor = summary.bmi < 18.5 ? 'text-blue-200' : summary.bmi < 24 ? 'text-emerald-200' : 'text-amber-200';
  
  const goalLabels: Record<GoalType, string> = {
    maintain: '維持體態',
    lose: '瘦身減脂',
    gain: '增肌減脂'
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <HealthReport 
        summary={summary}
        meals={todayMeals}
        exercises={todayExercises}
        waterLogs={waterLogs}
        profile={profile}
      />

      <header className="bg-emerald-600 text-white p-6 shadow-md sticky top-0 z-20">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl">
              <i className="fas fa-leaf text-emerald-600 text-2xl"></i>
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">AI 卡路里大師</h1>
              <div className="flex items-center gap-2">
                <span className="text-[10px] opacity-80 uppercase tracking-widest font-bold">Health Dashboard</span>
                <span className="bg-emerald-500 text-[10px] px-2 py-0.5 rounded-full font-bold">{goalLabels[profile.goalType]}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4 text-sm font-medium">
            <div className="text-right border-r border-emerald-500 pr-6 hidden lg:block">
              <div className="text-xs opacity-80">您的健康指標</div>
              <div className="flex items-center gap-2">
                <span className={`font-bold ${bmiColor}`}>BMI {summary.bmi.toFixed(1)} ({bmiCategory})</span>
                <span className="opacity-50">|</span>
                <span className="font-bold">目標 {summary.goal} kcal</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setShowCommunity(!showCommunity)}
                className={`${showCommunity ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white'} hover:opacity-90 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95`}
              >
                <i className="fas fa-users"></i>
                <span className="hidden sm:inline">{showCommunity ? '關閉社群' : '社群分享'}</span>
              </button>
               <button 
                onClick={handleExportPdf}
                className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95"
                title="匯出 PDF 報告"
              >
                <i className="fas fa-file-medical"></i>
                <span className="hidden md:inline">匯出報告</span>
              </button>
               <button 
                onClick={() => setShowSearch(!showSearch)}
                className={`${showSearch ? 'bg-white text-emerald-600' : 'bg-emerald-500 text-white'} hover:opacity-90 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95`}
              >
                <i className="fas fa-search"></i>
                <span className="hidden sm:inline">{showSearch ? '關閉搜尋' : '搜尋紀錄'}</span>
              </button>
              <button 
                onClick={() => setShowProfile(!showProfile)}
                className="bg-emerald-500 hover:bg-emerald-400 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95 text-white"
              >
                <i className={`fas ${showProfile ? 'fa-times' : 'fa-user-cog'}`}></i>
                <span className="hidden sm:inline">{showProfile ? '隱藏設定' : '修改資料'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-6">
        {showProfile && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <UserProfileForm profile={profile} onUpdate={setProfile} />
          </div>
        )}

        {showSearch && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <HistorySearch 
              meals={meals} 
              exercises={exercises} 
              onDeleteMeal={handleDeleteMeal}
              onDeleteExercise={handleDeleteExercise}
            />
          </div>
        )}

        {showCommunity && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-300">
            <SocialCommunity posts={posts} onLike={handleLikePost} onPost={handleAddPost} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FoodLogger onAddMeal={handleAddMeal} history={meals} />
              <ExerciseLogger onAddExercise={handleAddExercise} />
            </div>
            <MealHistory 
              meals={todayMeals} 
              onDelete={handleDeleteMeal} 
              onUpdate={handleUpdateMeal} 
              onShareToCommunity={handleAddPost}
            />
            <ExerciseHistory exercises={todayExercises} onDelete={handleDeleteExercise} />
          </div>
          
          <div className="lg:col-span-4 space-y-6">
            <SmartReminders 
              meals={todayMeals} 
              waterLogs={waterLogs} 
              onQuickWater={handleAddWater} 
              profile={profile}
            />
            
            <NutritionSummary summary={summary} onShareAchievement={handleAddPost} />

            <SmartNutritionAdvisor summary={summary} />
            
            <WaterTracker 
              logs={waterLogs} 
              goal={profile.waterGoal || 2000} 
              onAddWater={handleAddWater}
              onReset={handleResetWater}
            />

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 sticky top-28">
              <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <i className="fas fa-calculator text-emerald-500"></i>
                今日熱量平衡 (Net)
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-emerald-50 p-3 rounded-2xl text-center">
                    <span className="text-[10px] text-emerald-600 font-bold block uppercase tracking-tighter">攝取 (+)</span>
                    <span className="text-lg font-black text-emerald-700">{Math.round(summary.totalCalories)}</span>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-2xl text-center">
                    <span className="text-[10px] text-blue-600 font-bold block uppercase tracking-tighter">運動 (-)</span>
                    <span className="text-lg font-black text-blue-700">{Math.round(summary.totalBurned)}</span>
                  </div>
                </div>

                <div className="bg-slate-900 text-white p-4 rounded-2xl relative overflow-hidden">
                   <div className="flex justify-between items-center relative z-10">
                      <div>
                        <span className="text-[10px] opacity-60 font-bold block uppercase tracking-widest">淨攝取熱量</span>
                        <span className="text-2xl font-black">{Math.round(summary.netCalories)}</span>
                        <span className="text-[10px] ml-1 opacity-60 uppercase">kcal</span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] opacity-60 font-bold block uppercase tracking-widest">目標上限</span>
                        <span className="text-lg font-bold opacity-90">{summary.goal}</span>
                      </div>
                   </div>
                   <div className="mt-4 w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div 
                        className={`${summary.netCalories > summary.goal ? 'bg-rose-500' : 'bg-emerald-400'} h-full transition-all duration-700`}
                        style={{ width: `${Math.min((summary.netCalories / summary.goal) * 100, 100)}%` }}
                      ></div>
                   </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-2xl">
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-slate-500 font-medium">可用額度 (Remaining)</div>
                    <div className={`text-xl font-black ${summary.goal - summary.netCalories < 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {Math.max(0, summary.goal - Math.round(summary.netCalories))} <span className="text-xs font-bold uppercase">kcal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
