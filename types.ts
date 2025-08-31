
export enum Page {
  Analyzer,
  Coach,
  History,
}

export interface User {
  name: string;
  email: string;
}

export interface MacroNutrients {
  calories: number;
  protein: number;
  carbohydrates: number;
  fat: number;
}

export interface Micronutrient {
  name: string;
  amount: string;
}

export interface NutritionalInfo {
  foodItems: string[];
  macros: MacroNutrients;
  vitamins: Micronutrient[];
  minerals: Micronutrient[];
  summary: string;
}

export interface UserMetrics {
  height: string;
  weight: string;
  age: string;
  gender: 'male' | 'female' | 'other' | '';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | '';
}

export interface Meal {
  breakfast: string;
  lunch: string;
  dinner: string;
  snacks?: string;
}

export interface MealPlan {
  [day: string]: Meal;
}

export interface WorkoutPlan {
  [day: string]: string;
}

export interface PersonalizedPlan {
  summary: string;
  mealPlan: MealPlan;
  workoutPlan: WorkoutPlan;
}

// New History Types
export interface MealHistoryItem {
  id: string;
  timestamp: number;
  imageDataUrl: string;
  nutritionalInfo: NutritionalInfo;
}

export interface PlanHistoryItem {
  id: string;
  timestamp: number;
  metrics: UserMetrics;
  goal: string;
  plan: PersonalizedPlan;
}

export interface HistoryData {
  meals: MealHistoryItem[];
  plans: PlanHistoryItem[];
}
