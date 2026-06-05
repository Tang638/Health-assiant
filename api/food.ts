import { VercelRequest, VercelResponse } from '@vercel/node'
import prisma from '../backend/src/config/prisma'

const defaultFoods = [
  { name: '米饭', caloriesPer100g: 130, protein: 2.7, fat: 0.3, carbs: 28 },
  { name: '面条', caloriesPer100g: 110, protein: 2.7, fat: 0.4, carbs: 24 },
  { name: '馒头', caloriesPer100g: 280, protein: 7, fat: 1, carbs: 58 },
  { name: '鸡蛋', caloriesPer100g: 143, protein: 13, fat: 10, carbs: 1 },
  { name: '牛奶', caloriesPer100g: 54, protein: 3.2, fat: 3.2, carbs: 4.8 },
  { name: '鸡胸肉', caloriesPer100g: 165, protein: 20, fat: 7.5, carbs: 0 },
  { name: '瘦牛肉', caloriesPer100g: 125, protein: 20, fat: 4.5, carbs: 0 },
  { name: '鱼肉', caloriesPer100g: 120, protein: 20, fat: 3, carbs: 0 },
  { name: '西红柿', caloriesPer100g: 18, protein: 0.9, fat: 0.2, carbs: 3.5 },
  { name: '黄瓜', caloriesPer100g: 15, protein: 0.8, fat: 0.2, carbs: 2.5 },
  { name: '西兰花', caloriesPer100g: 34, protein: 2.8, fat: 0.4, carbs: 7 },
  { name: '胡萝卜', caloriesPer100g: 41, protein: 0.9, fat: 0.2, carbs: 9.6 },
  { name: '苹果', caloriesPer100g: 52, protein: 0.3, fat: 0.2, carbs: 14 },
  { name: '香蕉', caloriesPer100g: 91, protein: 1.1, fat: 0.3, carbs: 22 },
  { name: '橙子', caloriesPer100g: 47, protein: 0.9, fat: 0.2, carbs: 11 },
  { name: '酸奶', caloriesPer100g: 80, protein: 2.5, fat: 3.2, carbs: 10 },
  { name: '豆腐', caloriesPer100g: 70, protein: 6, fat: 3.5, carbs: 4 },
  { name: '豆浆', caloriesPer100g: 30, protein: 2.8, fat: 1, carbs: 2 },
  { name: '全麦面包', caloriesPer100g: 250, protein: 8, fat: 3, carbs: 48 },
  { name: '燕麦', caloriesPer100g: 389, protein: 13, fat: 7, carbs: 66 },
]

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    try {
      let foods = await prisma.food.findMany()
      
      if (foods.length === 0) {
        foods = await prisma.food.createManyAndReturn({
          data: defaultFoods
        })
      }
      
      res.status(200).json(foods)
    } catch (error) {
      res.status(500).json({ error: '服务器内部错误' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
