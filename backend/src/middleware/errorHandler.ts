import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error('Error:', err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: '验证失败',
      details: err.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ error: '该数据已存在' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: '记录不存在' });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({ error: '关联数据不存在' });
  }

  res.status(500).json({ error: '服务器内部错误' });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: '接口不存在' });
}
