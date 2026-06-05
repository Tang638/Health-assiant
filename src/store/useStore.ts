import { create } from 'zustand';
import { User, Activity, DietRecord, WeightRecord, Food, Goal, Suggestion, Achievement } from '../types';
import { authService } from '../services/authService';
import { activityService } from '../services/activityService';
import { dietService } from '../services/dietService';
import { weightService } from '../services/weightService';

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
  fetchCurrentUser: () => Promise<void>;
  
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
  user: authService.getSavedUser(),
  isLoggedIn: !!authService.getSavedUser(),
  isLoading: false,
  error: null,
  
  activities: [],
  dietRecords: [],
  weightRecords: [],
  foods: [],
  goals: [],
  suggestions: [],
  achievements: [],

  login: async (username: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.login({ username, password });
      authService.saveTokens(response.accessToken, response.refreshToken);
      authService.saveUser(response.user);
      set({ user: response.user, isLoggedIn: true, isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.message || '登录失败', isLoading: false });
      return false;
    }
  },

  register: async (username: string, email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response = await authService.register({ username, email, password });
      authService.saveTokens(response.accessToken, response.refreshToken);
      authService.saveUser(response.user);
      set({ user: response.user, isLoggedIn: true, isLoading: false });
      return true;
    } catch (error: any) {
      set({ error: error.response?.data?.message || '注册失败', isLoading: false });
      return false;
    }
  },

  logout: () => {
    authService.logout();
    authService.clearUser();
    set({ user: null, isLoggedIn: false, activities: [], dietRecords: [], weightRecords: [] });
  },

  fetchCurrentUser: async () => {
    try {
      set({ isLoading: true, error: null });
      const user = await authService.getCurrentUser();
      authService.saveUser(user);
      set({ user, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || '获取用户信息失败', isLoading: false });
    }
  },

  fetchActivities: async () => {
    try {
      set({ isLoading: true, error: null });
      const activities = await activityService.getActivities();
      set({ activities, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || '获取运动记录失败', isLoading: false });
    }
  },

  addActivity: async (activity) => {
    try {
      set({ isLoading: true, error: null });
      const newActivity = await activityService.createActivity({
        type: activity.type,
        durationMinutes: activity.durationMinutes,
        caloriesBurned: activity.caloriesBurned,
        distanceKm: activity.distanceKm || null,
        notes: activity.notes || null,
        date: activity.date,
      });
      set((state) => ({ activities: [newActivity, ...state.activities], isLoading: false }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || '添加运动记录失败', isLoading: false });
    }
  },

  updateActivity: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const updatedActivity = await activityService.updateActivity(id, updates);
      set((state) => ({
        activities: state.activities.map((a) =>
          a.id === id ? updatedActivity : a
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || '更新运动记录失败', isLoading: false });
    }
  },

  deleteActivity: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await activityService.deleteActivity(id);
      set((state) => ({
        activities: state.activities.filter((a) => a.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || '删除运动记录失败', isLoading: false });
    }
  },

  fetchDietRecords: async () => {
    try {
      set({ isLoading: true, error: null });
      const dietRecords = await dietService.getDietRecords();
      set({ dietRecords, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || '获取饮食记录失败', isLoading: false });
    }
  },

  addDietRecord: async (record) => {
    try {
      set({ isLoading: true, error: null });
      const newRecord = await dietService.createDietRecord(record);
      set((state) => ({ dietRecords: [newRecord, ...state.dietRecords], isLoading: false }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || '添加饮食记录失败', isLoading: false });
    }
  },

  updateDietRecord: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const updatedRecord = await dietService.updateDietRecord(id, updates);
      set((state) => ({
        dietRecords: state.dietRecords.map((d) =>
          d.id === id ? updatedRecord : d
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || '更新饮食记录失败', isLoading: false });
    }
  },

  deleteDietRecord: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await dietService.deleteDietRecord(id);
      set((state) => ({
        dietRecords: state.dietRecords.filter((d) => d.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || '删除饮食记录失败', isLoading: false });
    }
  },

  fetchWeightRecords: async () => {
    try {
      set({ isLoading: true, error: null });
      const weightRecords = await weightService.getWeightRecords();
      set({ weightRecords, isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || '获取体重记录失败', isLoading: false });
    }
  },

  addWeightRecord: async (record) => {
    try {
      set({ isLoading: true, error: null });
      const newRecord = await weightService.createWeightRecord({
        weight: record.weight,
        bodyFatPercentage: record.bodyFatPercentage || null,
        muscleMass: record.muscleMass || null,
        date: record.date,
      });
      set((state) => ({ weightRecords: [newRecord, ...state.weightRecords], isLoading: false }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || '添加体重记录失败', isLoading: false });
    }
  },

  updateWeightRecord: async (id, updates) => {
    try {
      set({ isLoading: true, error: null });
      const updatedRecord = await weightService.updateWeightRecord(id, updates);
      set((state) => ({
        weightRecords: state.weightRecords.map((w) =>
          w.id === id ? updatedRecord : w
        ),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || '更新体重记录失败', isLoading: false });
    }
  },

  deleteWeightRecord: async (id) => {
    try {
      set({ isLoading: true, error: null });
      await weightService.deleteWeightRecord(id);
      set((state) => ({
        weightRecords: state.weightRecords.filter((w) => w.id !== id),
        isLoading: false
      }));
    } catch (error: any) {
      set({ error: error.response?.data?.message || '删除体重记录失败', isLoading: false });
    }
  },

  fetchFoods: async () => {
    try {
      set({ isLoading: true, error: null });
      const foods = await weightService.getWeightRecords();
      set({ foods: [], isLoading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.message || '获取食物列表失败', isLoading: false });
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
        title: '运动建议',
        content: '今天建议进行45分钟的有氧运动，可以选择跑步或骑行。',
        priority: 'high',
      },
      {
        id: (Date.now() + 1).toString(),
        type: 'diet',
        title: '营养建议',
        content: '注意补充足够的水分，每天建议喝8杯水。',
        priority: 'medium',
      },
      {
        id: (Date.now() + 2).toString(),
        type: 'health',
        title: '休息建议',
        content: '适当休息，避免过度训练导致身体疲劳。',
        priority: 'low',
      },
    ];
    set({ suggestions: newSuggestions });
  },

  clearError: () => {
    set({ error: null });
  },
}));
