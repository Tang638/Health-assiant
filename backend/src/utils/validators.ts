import { z } from 'zod';

// 用户注册验证
export const RegisterSchema = z.object({
  username: z.string().min(3, '用户名至少3个字符').max(50, '用户名最多50个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
});

// 用户登录验证
export const LoginSchema = z.object({
  username: z.string().min(1, '请输入用户名'),
  password: z.string().min(1, '请输入密码'),
});

// 运动记录验证
export const ActivitySchema = z.object({
  type: z.string().min(1, '请选择运动类型'),
  duration: z.number().int().positive('运动时长必须为正数'),
  calories: z.number().int().positive('卡路里必须为正数'),
  distance: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
  date: z.string().or(z.date()),
});

// 饮食记录验证
export const DietRecordSchema = z.object({
  mealType: z.string().min(1, '请选择餐次类型'),
  items: z.array(z.object({
    foodId: z.string().min(1, '请选择食物'),
    weight: z.number().positive('请输入食物重量'),
  })).min(1, '至少选择一种食物'),
  date: z.string().or(z.date()),
});

// 体重记录验证
export const WeightRecordSchema = z.object({
  weight: z.number().positive('请输入体重'),
  bodyFat: z.number().optional().nullable(),
  muscleMass: z.number().optional().nullable(),
  date: z.string().or(z.date()),
});

// 食物验证
export const FoodSchema = z.object({
  name: z.string().min(1, '请输入食物名称'),
  caloriesPer100g: z.number().int().positive('请输入每100g卡路里'),
  proteinPer100g: z.number().nonnegative('请输入每100g蛋白质'),
  carbsPer100g: z.number().nonnegative('请输入每100g碳水化合物'),
  fatPer100g: z.number().nonnegative('请输入每100g脂肪'),
  category: z.string().min(1, '请选择类别'),
});
