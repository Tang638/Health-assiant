import apiClient from '../lib/apiClient';

export interface Food {
  id: string;
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  category: string;
  isCustom: boolean;
  userId?: string | null;
  createdAt: string;
}

export interface CreateFoodData {
  name: string;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  category: string;
}

export const foodService = {
  // 获取食物列表
  async getFoods(category?: string): Promise<Food[]> {
    const params = category ? { category } : {};
    const response = await apiClient.get('/api/foods', { params });
    return response.data;
  },

  // 获取单个食物
  async getFood(id: string): Promise<Food> {
    const response = await apiClient.get(`/api/foods/${id}`);
    return response.data;
  },

  // 创建自定义食物
  async createFood(data: CreateFoodData): Promise<Food> {
    const response = await apiClient.post('/api/foods', data);
    return response.data;
  },

  // 删除自定义食物
  async deleteFood(id: string): Promise<void> {
    await apiClient.delete(`/api/foods/${id}`);
  },
};
