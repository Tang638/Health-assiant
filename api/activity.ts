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
      const activities = await prisma.activity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      })
      res.status(200).json(activities)
    } catch (error) {
      res.status(500).json({ error: '服务器内部错误' })
    }
  } else if (req.method === 'POST') {
    const { type, duration, calories, date } = req.body as { type: string; duration: number; calories: number; date: string }
    try {
      const activity = await prisma.activity.create({
        data: { type, duration, calories, date, userId }
      })
      res.status(201).json(activity)
    } catch (error) {
      res.status(500).json({ error: '服务器内部错误' })
    }
  } else if (req.method === 'PUT') {
    const { id, type, duration, calories, date } = req.body as { id: number; type: string; duration: number; calories: number; date: string }
    try {
      const activity = await prisma.activity.update({
        where: { id, userId },
        data: { type, duration, calories, date }
      })
      res.status(200).json(activity)
    } catch (error) {
      res.status(500).json({ error: '服务器内部错误' })
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query as { id: string }
    try {
      await prisma.activity.delete({ where: { id: parseInt(id), userId } })
      res.status(200).json({ message: '删除成功' })
    } catch (error) {
      res.status(500).json({ error: '服务器内部错误' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
}
