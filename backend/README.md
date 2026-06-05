# 智能健康助手 - 后端服务

这是智能健康助手项目的后端服务，使用 Node.js + Express + TypeScript + Prisma 构建。

## 技术栈

- **Node.js 18+** - 运行环境
- **Express.js** - Web 框架
- **TypeScript** - 类型安全
- **Prisma** - ORM 和数据库工具
- **PostgreSQL** - 数据库
- **JWT** - 身份验证
- **Zod** - 数据验证
- **Helmet** - 安全中间件
- **CORS** - 跨域支持

## 快速开始

### 1. 前置要求

- Node.js 18+
- PostgreSQL 数据库
- npm 或 yarn

### 2. 安装依赖

```bash
cd backend
npm install
```

### 3. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```env
# 数据库连接字符串
DATABASE_URL="postgresql://用户名:密码@localhost:5432/health_assistant?schema=public"

# JWT 密钥（请务必修改为强密码）
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-token-key-change-this-in-production"

# JWT 过期时间
JWT_EXPIRES_IN="15m"
JWT_REFRESH_EXPIRES_IN="7d"

# 服务器配置
PORT=3000
NODE_ENV="development"

# CORS 配置
FRONTEND_URL="http://localhost:5173"
```

### 4. 初始化数据库

```bash
# 生成 Prisma Client
npm run db:generate

# 执行数据库迁移
npm run db:push
```

### 5. 启动开发服务器

```bash
npm run dev
```

服务器将在 http://localhost:3000 启动

## 生产部署

### 构建项目

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## API 文档

### 认证

#### 注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123"
}
```

#### 登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

#### 获取当前用户
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### 运动记录

#### 获取运动记录
```http
GET /api/activities
Authorization: Bearer <token>
```

#### 创建运动记录
```http
POST /api/activities
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "跑步",
  "duration": 30,
  "calories": 300,
  "distance": 5,
  "date": "2024-01-01"
}
```

### 饮食记录

#### 获取饮食记录
```http
GET /api/diet
Authorization: Bearer <token>
```

#### 创建饮食记录
```http
POST /api/diet
Authorization: Bearer <token>
Content-Type: application/json

{
  "mealType": "午餐",
  "items": [
    { "foodId": "food-uuid", "weight": 150 }
  ],
  "date": "2024-01-01"
}
```

#### 获取食物库
```http
GET /api/foods
Authorization: Bearer <token>
```

### 体重记录

#### 获取体重记录
```http
GET /api/weight
Authorization: Bearer <token>
```

#### 创建体重记录
```http
POST /api/weight
Authorization: Bearer <token>
Content-Type: application/json

{
  "weight": 70.5,
  "bodyFat": 15.5,
  "muscleMass": 35.0,
  "date": "2024-01-01"
}
```

## 项目结构

```
backend/
├── prisma/
│   └── schema.prisma     # 数据库模型定义
├── src/
│   ├── config/
│   │   ├── env.ts        # 环境变量配置
│   │   └── prisma.ts     # Prisma 客户端
│   ├── middleware/
│   │   ├── auth.ts       # 认证中间件
│   │   └── errorHandler.ts # 错误处理
│   ├── routes/
│   │   ├── authRoutes.ts # 认证路由
│   │   ├── activityRoutes.ts
│   │   ├── dietRoutes.ts
│   │   ├── foodRoutes.ts
│   │   └── weightRoutes.ts
│   ├── services/
│   │   ├── authService.ts
│   │   ├── activityService.ts
│   │   ├── dietService.ts
│   │   ├── foodService.ts
│   │   └── weightService.ts
│   ├── utils/
│   │   ├── jwt.ts        # JWT 工具
│   │   └── validators.ts # 数据验证
│   └── server.ts         # 服务器入口
├── .env.example
├── package.json
└── tsconfig.json
```

## 数据库模型

- **User** - 用户
- **Activity** - 运动记录
- **DietRecord** - 饮食记录
- **Food** - 食物库
- **WeightRecord** - 体重记录

## 安全特性

- JWT 认证
- 密码 bcrypt 加密
- 请求频率限制
- Helmet 安全头
- CORS 保护
- 输入验证
- SQL 注入防护

## 许可证

MIT
