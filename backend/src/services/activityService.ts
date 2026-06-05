import prisma from '../config/prisma';

export async function getActivities(userId: string, startDate?: Date, endDate?: Date) {
  const where: any = { userId };

  if (startDate && endDate) {
    where.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  return prisma.activity.findMany({
    where,
    orderBy: { date: 'desc' },
  });
}

export async function getActivityById(id: string, userId: string) {
  return prisma.activity.findFirst({
    where: { id, userId },
  });
}

export async function createActivity(userId: string, data: {
  type: string;
  durationMinutes: number;
  caloriesBurned: number;
  distanceKm?: number | null;
  notes?: string | null;
  date: Date | string;
}) {
  return prisma.activity.create({
    data: {
      ...data,
      userId,
      date: new Date(data.date),
    },
  });
}

export async function updateActivity(id: string, userId: string, data: {
  type?: string;
  durationMinutes?: number;
  caloriesBurned?: number;
  distanceKm?: number | null;
  notes?: string | null;
  date?: Date | string;
}) {
  const updateData: any = { ...data };
  if (data.date) {
    updateData.date = new Date(data.date);
  }

  const result = await prisma.activity.updateMany({
    where: { id, userId },
    data: updateData,
  });

  // 返回更新后的记录
  if (result.count > 0) {
    return prisma.activity.findFirst({
      where: { id, userId },
    });
  }
  return null;
}

export async function deleteActivity(id: string, userId: string) {
  return prisma.activity.deleteMany({
    where: { id, userId },
  });
}

export async function getActivityStats(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const activities = await prisma.activity.findMany({
    where: {
      userId,
      date: { gte: startDate },
    },
  });

  const totalCalories = activities.reduce((sum, a) => sum + a.caloriesBurned, 0);
  const totalDuration = activities.reduce((sum, a) => sum + a.durationMinutes, 0);

  return {
    totalActivities: activities.length,
    totalCalories,
    totalDuration,
    avgCaloriesPerActivity: activities.length ? Math.round(totalCalories / activities.length) : 0,
  };
}
