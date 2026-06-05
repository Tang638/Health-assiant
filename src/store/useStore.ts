import { create } from 'zustand';
import { User, Activity, DietRecord, WeightRecord, Food, Goal, Suggestion, Achievement } from '../types';
import {
  mockUser,
  mockActivities,
  mockDietRecords,
  mockWeightRecords,
  mockGoals,
  mockSuggestions,
  mockAchievements,
  foodDatabase,
} from '../data/mockData';

interface AppState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  error: string | null;
  
  activities: Activity[];
  dietRecords: DietRecord[];
  weightRecords: WeightRecord[];
  foods: Food[];
  goals: Goal[];
  suggestions: Suggestion[];
  achievements: Achievement[];

  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  fetchActivities: () => Promise<void>;
  addActivity: (activity: Omit<Activity, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateActivity: (id: string, activity: Partial<Activity>) => Promise<void>;
  deleteActivity: (id: string) => Promise<void>;
  
  fetchDietRecords: () => Promise<void>;
  addDietRecord: (record: Omit<DietRecord, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateDietRecord: (id: string, record: Partial<DietRecord>) => Promise<void>;
  deleteDietRecord: (id: string) => Promise<void>;
  
  fetchWeightRecords: () => Promise<void>;
  addWeightRecord: (record: Omit<WeightRecord, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  updateWeightRecord: (id: string, record: Partial<WeightRecord>) => Promise<void>;
  deleteWeightRecord: (id: string) => Promise<void>;
  
  fetchFoods: () => Promise<void>;
  
  updateGoal: (id: string, updates: Partial<Goal>) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'userId'>) => void;
  
  generateSuggestions: () => void;
  
  clearError: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  isLoggedIn: false,
  isLoading: false,
  error: null,
  
  activities: [],
  dietRecords: [],
  weightRecords: [],
  foods: foodDatabase.map(food => ({
    id: food.name,
    name: food.name,
    caloriesPer100g: food.calories,
    protein: food.protein,
    carbs: food.carbs,
    fat: food.fat,
    category: food.category,
  })),
  goals: [],
  suggestions: [],
  achievements: [],

  login: async (username: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      // 模拟延迟
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ user: mockUser, isLoggedIn: true, isLoading: false, activities: mockActivities, dietRecords: mockDietRecords, weightRecords: mockWeightRecords, goals: mockGoals, achievements: mockAchievements });
      return true;
    } catch (error: any) {
      set({ error: '登录失败', isLoading: false });
      return false;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newUser: User = {
        id: Date.now().toString(),
        username,
        email,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      set({ user: newUser, isLoggedIn: true, isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: '注册失败', isLoading: false });
      return false;
    }
  },

  logout: () => {
    set({ user: null, isLoggedIn: false, activities: [], dietRecords: [], weightRecords: [] });
  },

  fetchActivities: async () => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      set({ activities: get().isLoggedIn ? mockActivities : [], isLoading: false });
    } catch (error: any) {
      set({ error: '获取运动记录失败', isLoading: false });
    }
  },

  addActivity: async (activity) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newActivity: Activity = {
        id: Date.now().toString(),
        userId: get().user?.id || '1',
        type: activity.type,
        durationMinutes: activity.durationMinutes,
        caloriesBurned: activity.caloriesBurned,
        distanceKm: activity.distanceKm || null,
        notes: activity.notes || null,
        date: activity.date,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      set((state) => ({ activities: [newActivity, ...state.activities], isLoading: false }));
    } catch (error: any) {
      set({ error: '添加运动记录失败', isLoading: false });
    }
  },

  updateActivity: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set((state) => ({
        activities: state.activities.map((a) =>
          a.id === id ? { ...a, ...updates } : a
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: '更新运动记录失败', isLoading: false });
    }
  },

  deleteActivity: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set((state) => ({
        activities: state.activities.filter((a) => a.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: '删除运动记录失败', isLoading: false });
    }
  },

  fetchDietRecords: async () => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      set({ dietRecords: get().isLoggedIn ? mockDietRecords : [], isLoading: false });
    } catch (error: any) {
      set({ error: '获取饮食记录失败', isLoading: false });
    }
  },

  addDietRecord: async (record) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newRecord: DietRecord = {
        id: Date.now().toString(),
        userId: get().user?.id || '1',
        foodName: record.foodName,
        calories: record.calories,
        protein: record.protein || 0,
        carbs: record.carbs || 0,
        fat: record.fat || 0,
        quantity: record.quantity || 1,
        mealType: record.mealType,
        date: record.date,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      set((state) => ({ dietRecords: [newRecord, ...state.dietRecords], isLoading: false }));
    } catch (error: any) {
      set({ error: '添加饮食记录失败', isLoading: false });
    }
  },

  updateDietRecord: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set((state) => ({
        dietRecords: state.dietRecords.map((d) =>
          d.id === id ? { ...d, ...updates } : d
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: '更新饮食记录失败', isLoading: false });
    }
  },

  deleteDietRecord: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set((state) => ({
        dietRecords: state.dietRecords.filter((d) => d.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: '删除饮食记录失败', isLoading: false });
    }
  },

  fetchWeightRecords: async () => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      set({ weightRecords: get().isLoggedIn ? mockWeightRecords : [], isLoading: false });
    } catch (error: any) {
      set({ error: '获取体重记录失败', isLoading: false });
    }
  },

  addWeightRecord: async (record) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newRecord: WeightRecord = {
        id: Date.now().toString(),
        userId: get().user?.id || '1',
        weight: record.weight,
        bodyFatPercentage: record.bodyFatPercentage || null,
        muscleMass: record.muscleMass || null,
        date: record.date,
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      set((state) => ({ weightRecords: [newRecord, ...state.weightRecords], isLoading: false }));
    } catch (error: any) {
      set({ error: '添加体重记录失败', isLoading: false });
    }
  },

  updateWeightRecord: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set((state) => ({
        weightRecords: state.weightRecords.map((w) =>
          w.id === id ? { ...w, ...updates } : w
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: '更新体重记录失败', isLoading: false });
    }
  },

  deleteWeightRecord: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 300));
      
      set((state) => ({
        weightRecords: state.weightRecords.filter((w) => w.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: '删除体重记录失败', isLoading: false });
    }
  },

  fetchFoods: async () => {
    try {
      set({ isLoading: true, error: null });
      await new Promise(resolve => setTimeout(resolve, 200));
      // 已经初始化了 foods
      set({ isLoading: false });
    } catch (error: any) {
      set({ error: '获取食物列表失败', isLoading: false });
    }
  },

  updateGoal: (id, updates) => {
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, ...updates } : g
      ),
    }));
  },

  addGoal: (goal) => {
    const newGoal: Goal = {
      ...goal,
      id: Date.now().toString(),
      userId: get().user?.id || '1',
    };
    set((state) => ({ goals: [...state.goals, newGoal] }));
  },

  generateSuggestions: () => {
    const newSuggestions: Suggestion[] = [
      {
        id: Date.now().toString(),
        type: 'exercise',
        title: '今日运动建议',
        content: '建议进行30分钟有氧运动，可以选择跑步、游泳或骑行，有助于提高心肺功能。',
        priority: 'high',
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'diet',
        title: '饮食小贴士',
        content: '注意补充蛋白质，可以多吃鸡蛋、鸡胸肉、豆制品等优质蛋白来源。',
        priority: 'medium',
      },
      {
        id: (Date.now() + 2).toString(),
        type: 'health',
        title: '休息提醒',
        content: '保证充足的睡眠，建议每晚睡够7-8小时，有助于身体恢复。',
        priority: 'medium',
      },
    ];
    set({ suggestions: newSuggestions });
  },

  clearError: () => {
    set({ error: null });
  },
}));
