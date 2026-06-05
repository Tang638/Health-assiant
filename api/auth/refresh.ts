import { VercelRequest, VercelResponse } from '@vercel/node'
import jwt from 'jsonwebtoken'

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { refreshToken } = req.body as { refreshToken: string }

  if (!refreshToken) {
    return res.status(400).json({ error: '刷新令牌不能为空' })
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh-secret') as { id: number }

    const newToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '1h' }
    )

    res.status(200).json({ accessToken: newToken })
  } catch (error) {
    res.status(401).json({ error: '无效的刷新令牌' })
  }
}
