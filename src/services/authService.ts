import apiClient from '../lib/apiClient';

// 类型定义
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string | null;
  height?: number | null;
  weightGoal?: number | null;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  avatar?: string;
  height?: number;
  weightGoal?: number;
}

// 认证服务
export const authService = {
  // 用户注册
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/register', data);
    return response.data;
  },

  // 用户登录
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post('/api/auth/login', data);
    return response.data;
  },

  // 获取当前用户
  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/api/auth/me');
    return response.data;
  },

  // 更新用户信息
  async updateUser(data: UpdateUserData): Promise<User> {
    const response = await apiClient.put('/api/auth/me', data);
    return response.data;
  },

  // 登出
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },

  // 保存令牌
  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  // 获取已保存的用户（从 localStorage 读取基本信息）
  getSavedUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  },

  // 保存用户信息
  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // 清除用户信息
  clearUser(): void {
    localStorage.removeItem('user');
  },
};
