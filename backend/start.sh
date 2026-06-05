#!/bin/bash
# 健康助手后端启动脚本

# 设置环境变量
export NODE_ENV=production
export PORT=3000
export JWT_SECRET=your-super-secret-key-change-in-production
export JWT_REFRESH_SECRET=your-refresh-secret-key-change-in-production

# 安装依赖
npm install

# 构建项目
npm run build

# 启动服务
npm start
