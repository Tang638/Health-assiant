import { VercelRequest, VercelResponse } from '@vercel/node'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import prisma from '../../backend/src/config/prisma'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, email, password } = req.body as { username: string; email: string; password: string }

  if (!username || !email || !password) {
    return res.status(400).json({ error: '用户名、邮箱和密码不能为空' })
  }

  if (username.length < 3) {
    return res.status(400).json({ error: '用户名至少需要3个字符' })
  }

  if (password.length < 6) {
    return res.status(400).json({ error: '密码至少需要6个字符' })
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ username }, { email }]
      }
    })

    if (existingUser) {
      return res.status(400).json({ error: '用户名或邮箱已被使用' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword
      }
    })

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

    res.status(201).json({
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
