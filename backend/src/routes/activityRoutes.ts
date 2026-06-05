import { Router } from 'express';
import {
  getActivities,
  getActivityById,
  createActivity,
  updateActivity,
  deleteActivity,
  getActivityStats,
} from '../services/activityService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;

    const activities = await getActivities(userId, start, end);
    res.json(activities);
  } catch (error) {
    next(error);
  }
});

router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { days } = req.query;
    const stats = await getActivityStats(userId, days ? Number(days) : undefined);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const activity = await getActivityById(id, userId);

    if (!activity) {
      return res.status(404).json({ error: '运动记录不存在' });
    }

    res.json(activity);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const data = req.body;
    const activity = await createActivity(userId, data);
    res.status(201).json(activity);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data = req.body;

    const activity = await updateActivity(id, userId, data);

    if (!activity) {
      return res.status(404).json({ error: '运动记录不存在' });
    }

    res.json(activity);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const result = await deleteActivity(id, userId);

    if (result.count === 0) {
      return res.status(404).json({ error: '运动记录不存在' });
    }

    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
