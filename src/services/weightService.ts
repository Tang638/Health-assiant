
import apiClient from '../lib/apiClient';
import { WeightRecord } from '../types';

export interface CreateWeightRecordData {
  weight: number;
  bodyFatPercentage?: number | null;
  muscleMass?: number | null;
  date: string;
}

export interface WeightStats {
  totalRecords: number;
  avgWeight: number;
  minWeight: number;
  maxWeight: number;
  trend: 'up' | 'down' | 'stable';
}

export const weightService = {
  async getWeightRecords(startDate?: string, endDate?: string): Promise<WeightRecord[]> {
    const params: any = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    
    const response = await apiClient.get('/api/weight', { params });
    return response.data;
  },

  async getStats(days?: number): Promise<WeightStats> {
    const params = days ? { days } : {};
    const response = await apiClient.get('/api/weight/stats', { params });
    return response.data;
  },

  async createWeightRecord(data: CreateWeightRecordData): Promise<WeightRecord> {
    const response = await apiClient.post('/api/weight', data);
    return response.data;
  },

  async updateWeightRecord(id: string, data: Partial<CreateWeightRecordData>): Promise<WeightRecord> {
    const response = await apiClient.put(`/api/weight/${id}`, data);
    return response.data;
  },

  async deleteWeightRecord(id: string): Promise<void> {
    await apiClient.delete(`/api/weight/${id}`);
  },
};
