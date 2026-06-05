import prisma from '../config/prisma';

export async function initializeDefaultFoods() {
  // 简化版本，不需要初始化默认食物
  return;
}

export async function getFoods(userId?: string, category?: string) {
  // 返回空数组，因为前端已经有内置的食物数据库
  return [];
}

export async function getFoodById(id: string) {
  return null;
}

export async function createCustomFood(userId: string, data: any) {
  // 暂时不支持自定义食物
  throw new Error('Custom food creation is not supported yet');
}

export async function deleteCustomFood(id: string, userId: string) {
  // 暂时不支持自定义食物
  throw new Error('Custom food deletion is not supported yet');
}
