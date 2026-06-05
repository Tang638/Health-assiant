import { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'
import prisma from '../backend/src/config/prisma'

const authenticateToken = (req: VercelRequest): number | null => {
  const authHeader = req.headers.authorization
  const token = authHeader?.split(' ')[1]

  if (!token) return null

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: number }
    return decoded.id
  } catch {
    return null
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const userId = authenticateToken(req)
  if (!userId) return res.status(401).json({ error: '未授权' })

  if (req.method === 'GET') {
    try {
      const dietRecords = await prisma.dietRecord.findMany({
        where: { userId },
        include: { foods: true },
        orderBy: { createdAt: 'desc' }
      })
      res.status(200).json(dietRecords)
    } catch (error) {
      res.status(500).json({ error: '服务器内部错误' })
    }
  } else if (req.method === 'POST') {
    const { mealType, date, foods } = req.body as { mealType: string; date: string; foods: { foodId: number; weight: number }[] }
    try {
      const dietRecord = await prisma.dietRecord.create({
        data: {
          mealType,
          date,
          userId,
          foods: {
            create: foods.map(f => ({
              foodId: f.foodId,
              weight: f.weight
            }))
          }
        },
        include: { foods: true }
      })
      res.status(201).json(dietRecord)
    } catch (error) {
      res.status(500).json({ error: '服务器内部错误' })
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query as { id: string }
    try {
      await prisma.dietRecord.delete({ where: { id: parseInt(id), userId } })
      res.status(200).json({ message: '删除成功' })
    } catch (error) {
      res.status(500).json({ error: '服务器内部错误' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
