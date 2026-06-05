import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { env } from './config/env';
import prisma from './config/prisma';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { initializeDefaultFoods } from './services/foodService';
import authRoutes from './routes/authRoutes';
import activityRoutes from './routes/activityRoutes';
import dietRoutes from './routes/dietRoutes';
import foodRoutes from './routes/foodRoutes';
import weightRoutes from './routes/weightRoutes';

dotenv.config();

const app = express();
const PORT = env.PORT;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: '请求过于频繁，请稍后再试' },
});
app.use(limiter);

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/diet', dietRoutes);
app.use('/api/foods', foodRoutes);
app.use('/api/weight', weightRoutes);

// Error handlers
app.use(notFoundHandler);
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    // Test DB connection
    await prisma.$connect();
    console.log('✅ 数据库连接成功');

    // Initialize default foods
    await initializeDefaultFoods();
    console.log('✅ 默认食物数据初始化完成');

    app.listen(PORT, () => {
      console.log(`🚀 服务器运行在 http://localhost:${PORT}`);
      console.log(`🌍 环境: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('❌ 启动失败:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});
