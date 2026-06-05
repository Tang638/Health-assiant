import { Router } from 'express';
import {
  getDietRecords,
  getDietRecordById,
  createDietRecord,
  updateDietRecord,
  deleteDietRecord,
  getDietStats,
} from '../services/dietService';
import { authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { startDate, endDate } = req.query;

    const start = startDate ? new Date(startDate as string) : undefined;
    const end = endDate ? new Date(endDate as string) : undefined;

    const records = await getDietRecords(userId, start, end);
    res.json(records);
  } catch (error) {
    next(error);
  }
});

router.get('/stats', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { days } = req.query;
    const stats = await getDietStats(userId, days ? Number(days) : undefined);
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const record = await getDietRecordById(id, userId);
    if (!record) {
      return res.status(404).json({ error: '饮食记录不存在' });
    }
    res.json(record);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const data = req.body;
    const record = await createDietRecord(userId, data);
    res.status(201).json(record);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const data = req.body;

    const record = await updateDietRecord(id, userId, data);

    if (!record) {
      return res.status(404).json({ error: '饮食记录不存在' });
    }

    res.json(record);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res, next) => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const result = await deleteDietRecord(id, userId);
    if (result.count === 0) {
      return res.status(404).json({ error: '饮食记录不存在' });
    }
    res.json({ success: true });
  } catch (error) {
    next(error);
  }
});

export default router;
