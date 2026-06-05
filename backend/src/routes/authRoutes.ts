import { Router } from 'express';
import { registerUser, loginUser, getUserById, updateUser } from '../services/authService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { RegisterSchema, LoginSchema } from '../utils/validators';
import { verifyRefreshToken, generateAccessToken } from '../utils/jwt';

const router = Router();

router.post('/register', async (req, res, next) => {
  try {
    const data = RegisterSchema.parse(req.body);
    const result = await registerUser(data.username, data.email, data.password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const data = LoginSchema.parse(req.body);
    const result = await loginUser(data.username, data.password);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

router.post('/refresh', async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: '请提供刷新令牌' });
    }

    const payload = verifyRefreshToken(refreshToken);
    const newAccessToken = generateAccessToken(payload);

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(403).json({ error: '无效的刷新令牌' });
  }
});

router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    res.json(user);
  } catch (error) {
    next(error);
  }
});

router.put('/me', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { avatar, height, weightGoal } = req.body;
    const user = await updateUser(userId, { avatar, height, weightGoal });
    res.json(user);
  } catch (error) {
    next(error);
  }
});

export default router;
