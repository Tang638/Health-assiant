
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  height?: number | null;
  weightGoal?: number | null;
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  type: string;
  durationMinutes: number;
  caloriesBurned: number;
  distanceKm?: number;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface DietRecord {
  id: string;
  userId: string;
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
  createdAt: string;
}

export interface WeightRecord {
  id: string;
  userId: string;
  weight: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  date: string;
  createdAt: string;
}

export interface Food {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  category: string;
}

export interface Goal {
  id: string;
  userId: string;
  type: 'steps' | 'calories' | 'weight' | 'exercise';
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: string;
  endDate?: string;
  completed: boolean;
}

export interface Suggestion {
  id: string;
  type: 'exercise' | 'diet' | 'health';
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
}

export interface Achievement {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string;
  achievedAt?: string;
  createdAt: string;
}

