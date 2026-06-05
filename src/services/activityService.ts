
import apiClient from '../lib/apiClient';
import { Activity } from '../types';

export interface CreateActivityData {
  type: string;
  durationMinutes: number;
  caloriesBurned: number;
  distanceKm?: number | null;
  notes?: string | null;
  date: string;
}

export interface ActivityStats {
  totalActivities: number;
  totalCalories: number;
  totalDuration: number;
  avgCaloriesPerActivity: number;
}

export const activityService = {
  async getActivities(startDate?: string, endDate?: string): Promise<Activity[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiClient.get('/api/activities', { params });
    return response.data;
  },

  async getStats(days?: number): Promise<ActivityStats> {
    const params = days ? { days } : {};
    const response = await apiClient.get('/api/activities/stats', { params });
    return response.data;
  },

  async createActivity(data: CreateActivityData): Promise<Activity> {
    const response = await apiClient.post('/api/activities', data);
    return response.data;
  },

  async updateActivity(id: string, data: Partial<CreateActivityData>): Promise<Activity> {
    const response = await apiClient.put(`/api/activities/${id}`, data);
    return response.data;
  },

  async deleteActivity(id: string): Promise<void> {
    await apiClient.delete(`/api/activities/${id}`);
  },
};
