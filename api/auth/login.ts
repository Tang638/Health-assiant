import { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../backend/src/config/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, password } = req.body as { username: string; password: string }

  if (!username || !password) {
    return res.status(400).json({ error: '用户名和密码不能为空' })
  }

  try {
    const user = await prisma.user.findUnique({ where: { username } })

    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const isValid = await bcrypt.compare(password, user.password)

    if (!isValid) {
      return res.status(401).json({ error: '用户名或密码错误' })
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    )

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      { expiresIn: '7d' }
    )

    res.status(200).json({
      token,
      refreshToken,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: '服务器内部错误' })
  }
}
