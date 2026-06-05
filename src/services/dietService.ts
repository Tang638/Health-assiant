
import apiClient from '../lib/apiClient';
import { DietRecord } from '../types';

export interface CreateDietRecordData {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  date: string;
}

export interface DietStats {
  totalRecords: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  avgCaloriesPerDay: number;
  avgProteinPerDay: number;
  avgCarbsPerDay: number;
  avgFatPerDay: number;
}

export const dietService = {
  async getDietRecords(startDate?: string, endDate?: string): Promise<DietRecord[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiClient.get('/api/diet', { params });
    return response.data;
  },

  async getStats(days?: number): Promise<DietStats> {
    const params = days ? { days } : {};
    const response = await apiClient.get('/api/diet/stats', { params });
    return response.data;
  },

  async createDietRecord(data: CreateDietRecordData): Promise<DietRecord> {
    const response = await apiClient.post('/api/diet', data);
    return response.data;
  },

  async updateDietRecord(id: string, data: Partial<CreateDietRecordData>): Promise<DietRecord> {
    const response = await apiClient.put(`/api/diet/${id}`, data);
    return response.data;
  },

  async deleteDietRecord(id: string): Promise<void> {
    await apiClient.delete(`/api/diet/${id}`);
  },
};
