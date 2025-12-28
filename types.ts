
export interface NutritionData {
  foodName: string;
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
  servingSize: string;
}

export interface MealLog extends NutritionData {
  id: string;
  timestamp: number;
  imageUrl?: string;
}

export interface ExerciseLog {
  id: string;
  type: string;
  duration: number; // 分鐘
  caloriesBurned: number;
  timestamp: number;
}

export interface WaterLog {
  id: string;
  amount: number; // ml
  timestamp: number;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'veryActive';
export type Gender = 'male' | 'female';
export type GoalType = 'maintain' | 'lose' | 'gain';

export interface WaterReminderSettings {
  enabled: boolean;
  startHour: number;
  endHour: number;
  intervalHours: number;
}

export interface UserProfile {
  age: number;
  weight: number;
  height: number;
  gender: Gender;
  activityLevel: ActivityLevel;
  goalType: GoalType;
  waterGoal?: number; // ml
  waterReminderSettings: WaterReminderSettings;
}

export interface DailySummary {
  totalCalories: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
  totalBurned: number;
  netCalories: number;
  goal: number;
  goalProtein: number;
  goalFat: number;
  goalCarbs: number;
  bmi: number;
  goalType: GoalType;
}

export interface SocialPost {
  id: string;
  author: string;
  type: 'achievement' | 'recipe';
  content: string;
  timestamp: number;
  likes: number;
  imageUrl?: string;
  data?: any; // Stores related meal or summary data
}
