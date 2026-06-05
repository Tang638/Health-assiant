
import { User, Activity, DietRecord, WeightRecord, Goal, Suggestion, Achievement } from '../types';

export const mockUser: User = {
  id: '1',
  username: '健康达人',
  email: 'user@example.com',
  createdAt: '2024-01-01',
};

export const mockActivities: Activity[] = [
  {
    id: '1',
    userId: '1',
    type: '跑步',
    durationMinutes: 30,
    caloriesBurned: 300,
    distanceKm: 5,
    date: '2024-01-15',
    notes: '晨跑',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    userId: '1',
    type: '健身',
    durationMinutes: 60,
    caloriesBurned: 450,
    date: '2024-01-14',
    notes: '力量训练',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    userId: '1',
    type: '游泳',
    durationMinutes: 45,
    caloriesBurned: 400,
    distanceKm: 1.5,
    date: '2024-01-13',
    createdAt: '2024-01-13',
  },
];

export const mockDietRecords: DietRecord[] = [
  {
    id: '1',
    userId: '1',
    foodName: '燕麦粥',
    calories: 150,
    protein: 5,
    carbs: 25,
    fat: 3,
    quantity: 1,
    mealType: 'breakfast',
    date: '2024-01-15',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    userId: '1',
    foodName: '鸡胸肉沙拉',
    calories: 350,
    protein: 30,
    carbs: 15,
    fat: 15,
    quantity: 1,
    mealType: 'lunch',
    date: '2024-01-15',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    userId: '1',
    foodName: '三文鱼',
    calories: 400,
    protein: 40,
    carbs: 0,
    fat: 25,
    quantity: 1,
    mealType: 'dinner',
    date: '2024-01-15',
    createdAt: '2024-01-15',
  },
];

export const mockWeightRecords: WeightRecord[] = [
  {
    id: '1',
    userId: '1',
    weight: 70,
    bodyFatPercentage: 20,
    muscleMass: 30,
    date: '2024-01-15',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    userId: '1',
    weight: 71,
    bodyFatPercentage: 21,
    muscleMass: 29,
    date: '2024-01-08',
    createdAt: '2024-01-08',
  },
  {
    id: '3',
    userId: '1',
    weight: 72,
    bodyFatPercentage: 22,
    muscleMass: 28,
    date: '2024-01-01',
    createdAt: '2024-01-01',
  },
];

export const mockGoals: Goal[] = [
  {
    id: '1',
    userId: '1',
    type: 'steps',
    targetValue: 10000,
    currentValue: 7500,
    unit: '步',
    startDate: '2024-01-01',
    completed: false,
  },
  {
    id: '2',
    userId: '1',
    type: 'calories',
    targetValue: 2000,
    currentValue: 1800,
    unit: '千卡',
    startDate: '2024-01-01',
    completed: false,
  },
  {
    id: '3',
    userId: '1',
    type: 'weight',
    targetValue: 65,
    currentValue: 70,
    unit: 'kg',
    startDate: '2024-01-01',
    endDate: '2024-06-01',
    completed: false,
  },
];

export const mockSuggestions: Suggestion[] = [
  {
    id: '1',
    type: 'exercise',
    title: '今日运动建议',
    content: '建议进行30分钟有氧运动，可以选择跑步、游泳或骑行，有助于提高心肺功能。',
    priority: 'high',
  },
  {
    id: '2',
    type: 'diet',
    title: '饮食小贴士',
    content: '注意补充蛋白质，可以多吃鸡蛋、鸡胸肉、豆制品等优质蛋白来源。',
    priority: 'medium',
  },
  {
    id: '3',
    type: 'health',
    title: '休息提醒',
    content: '保证充足的睡眠，建议每晚睡够7-8小时，有助于身体恢复。',
    priority: 'medium',
  },
];

export const mockAchievements: Achievement[] = [
  {
    id: '1',
    userId: '1',
    name: '初露锋芒',
    description: '完成第一次运动记录',
    icon: '🏃',
    achievedAt: '2024-01-01',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    userId: '1',
    name: '坚持达人',
    description: '连续运动7天',
    icon: '🔥',
    achievedAt: '2024-01-08',
    createdAt: '2024-01-01',
  },
  {
    id: '3',
    userId: '1',
    name: '饮食专家',
    description: '记录100次饮食',
    icon: '🥗',
    achievedAt: '2024-01-10',
    createdAt: '2024-01-01',
  },
];

export const activityTypes = ['跑步', '健身', '游泳', '骑行', '瑜伽', '篮球', '足球', '网球'];

export const mealTypes = [
  { value: 'breakfast', label: '早餐' },
  { value: 'lunch', label: '午餐' },
  { value: 'dinner', label: '晚餐' },
  { value: 'snack', label: '加餐' },
];

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  category: string;
}

export const foodDatabase: FoodItem[] = [
  { name: '白米饭', calories: 130, protein: 2.7, carbs: 28, fat: 0.3, category: '主食' },
  { name: '糙米饭', calories: 111, protein: 2.6, carbs: 23, fat: 0.9, category: '主食' },
  { name: '燕麦粥', calories: 68, protein: 2.4, carbs: 12, fat: 1.2, category: '主食' },
  { name: '全麦面包', calories: 260, protein: 8, carbs: 48, fat: 3, category: '主食' },
  { name: '馒头', calories: 223, protein: 7, carbs: 47, fat: 1.1, category: '主食' },
  { name: '面条', calories: 130, protein: 3.5, carbs: 28, fat: 0.5, category: '主食' },
  { name: '玉米', calories: 116, protein: 4, carbs: 25, fat: 1.2, category: '主食' },
  { name: '红薯', calories: 86, protein: 1.6, carbs: 20, fat: 0.2, category: '主食' },
  
  { name: '鸡胸肉', calories: 165, protein: 31, carbs: 0, fat: 3.6, category: '肉类' },
  { name: '瘦牛肉', calories: 125, protein: 26, carbs: 0, fat: 2.4, category: '肉类' },
  { name: '瘦猪肉', calories: 143, protein: 20, carbs: 0, fat: 6.2, category: '肉类' },
  { name: '三文鱼', calories: 208, protein: 20, carbs: 0, fat: 14, category: '肉类' },
  { name: '鲈鱼', calories: 105, protein: 20, carbs: 0, fat: 3.4, category: '肉类' },
  { name: '虾', calories: 80, protein: 18, carbs: 0, fat: 0.8, category: '肉类' },
  { name: '鸡蛋', calories: 143, protein: 13, carbs: 1.1, fat: 10, category: '蛋类' },
  { name: '鸭蛋', calories: 180, protein: 13, carbs: 1.6, fat: 14, category: '蛋类' },
  
  { name: '牛奶', calories: 54, protein: 3.2, carbs: 5, fat: 3.2, category: '奶制品' },
  { name: '酸奶', calories: 90, protein: 2.5, carbs: 12, fat: 3, category: '奶制品' },
  { name: '奶酪', calories: 385, protein: 25, carbs: 1.3, fat: 30, category: '奶制品' },
  
  { name: '豆腐', calories: 70, protein: 6.2, carbs: 2.6, fat: 4.8, category: '豆制品' },
  { name: '豆浆', calories: 16, protein: 1.2, carbs: 1.1, fat: 0.7, category: '豆制品' },
  { name: '腐竹', calories: 450, protein: 50, carbs: 7, fat: 22, category: '豆制品' },
  
  { name: '西兰花', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, category: '蔬菜' },
  { name: '菠菜', calories: 23, protein: 2.9, carbs: 4, fat: 0.3, category: '蔬菜' },
  { name: '黄瓜', calories: 16, protein: 0.8, carbs: 3.6, fat: 0.2, category: '蔬菜' },
  { name: '西红柿', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, category: '蔬菜' },
  { name: '胡萝卜', calories: 41, protein: 0.9, carbs: 9.6, fat: 0.2, category: '蔬菜' },
  { name: '土豆', calories: 77, protein: 2.5, carbs: 17, fat: 0.2, category: '蔬菜' },
  { name: '白菜', calories: 17, protein: 1.5, carbs: 3.2, fat: 0.2, category: '蔬菜' },
  { name: '芹菜', calories: 16, protein: 0.8, carbs: 3.3, fat: 0.1, category: '蔬菜' },
  
  { name: '苹果', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, category: '水果' },
  { name: '香蕉', calories: 91, protein: 1.1, carbs: 23, fat: 0.3, category: '水果' },
  { name: '橙子', calories: 47, protein: 0.9, carbs: 12, fat: 0.2, category: '水果' },
  { name: '草莓', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, category: '水果' },
  { name: '蓝莓', calories: 57, protein: 0.7, carbs: 14, fat: 0.3, category: '水果' },
  { name: '西瓜', calories: 30, protein: 0.6, carbs: 7.6, fat: 0.1, category: '水果' },
  { name: '葡萄', calories: 40, protein: 0.5, carbs: 10, fat: 0.2, category: '水果' },
  
  { name: '花生油', calories: 899, protein: 0, carbs: 0, fat: 100, category: '油脂' },
  { name: '橄榄油', calories: 884, protein: 0, carbs: 0, fat: 100, category: '油脂' },
  { name: '黄油', calories: 717, protein: 0.9, carbs: 0.1, fat: 81, category: '油脂' },
  
  { name: '核桃', calories: 654, protein: 15, carbs: 14, fat: 65, category: '坚果' },
  { name: '杏仁', calories: 575, protein: 20, carbs: 22, fat: 49, category: '坚果' },
  { name: '花生', calories: 567, protein: 25, carbs: 23, fat: 45, category: '坚果' },
];

export const foodCategories = ['主食', '肉类', '蛋类', '奶制品', '豆制品', '蔬菜', '水果', '油脂', '坚果'];
