import { Router } from 'express';
import {
  getFoods,
  getFoodById,
  createCustomFood,
  deleteCustomFood,
} from '../services/foodService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { FoodSchema } from '../utils/validators';

const router = Router();

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { category } = req.query;
    const foods = await getFoods(userId, category as string);
    res.json(foods);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const { id } = req.params;
    const food = await getFoodById(id);
    if (!food) {
      return res.status(404).json({ error: '食物不存在' });
    }
    res.json(food);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const data = FoodSchema.parse(req.body);
    const food = await createCustomFood(userId, data);
    res.status(201).json(food);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const result = await deleteCustomFood(id, userId);
    if (result.count === 0) {
      return res.status(404).json({ error: '食物不存在' });
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
