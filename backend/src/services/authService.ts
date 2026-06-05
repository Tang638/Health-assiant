import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export async function registerUser(username: string, email: string, password: string) {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ username }, { email }],
    },
  });

  if (existingUser) {
    throw new Error('用户名或邮箱已存在');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
    },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      height: true,
      weightGoal: true,
      createdAt: true,
    },
  });

  const accessToken = generateAccessToken({ userId: user.id, username: user.username });
  const refreshToken = generateRefreshToken({ userId: user.id, username: user.username });

  return { user, accessToken, refreshToken };
}

export async function loginUser(username: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  if (!user) {
    throw new Error('用户名或密码错误');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('用户名或密码错误');
  }

  const accessToken = generateAccessToken({ userId: user.id, username: user.username });
  const refreshToken = generateRefreshToken({ userId: user.id, username: user.username });

  const userWithoutPassword = {
    id: user.id,
    username: user.username,
    email: user.email,
    avatar: user.avatar,
    height: user.height,
    weightGoal: user.weightGoal,
    createdAt: user.createdAt,
  };

  return { user: userWithoutPassword, accessToken, refreshToken };
}

export async function getUserById(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      height: true,
      weightGoal: true,
      createdAt: true,
    },
  });
}

export async function updateUser(userId: string, data: {
  avatar?: string;
  height?: number;
  weightGoal?: number;
}) {
  return prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      height: true,
      weightGoal: true,
      createdAt: true,
    },
  });
}
