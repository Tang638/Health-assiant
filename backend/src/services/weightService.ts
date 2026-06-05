import prisma from '../config/prisma';

export async function getWeightRecords(userId: string, startDate?: Date, endDate?: Date) {
  const where: any = { userId };

  if (startDate && endDate) {
    where.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  return prisma.weightRecord.findMany({
    where,
    orderBy: { date: 'desc' },
  });
}

export async function getWeightRecordById(id: string, userId: string) {
  return prisma.weightRecord.findFirst({
    where: { id, userId },
  });
}

export async function createWeightRecord(userId: string, data: {
  weight: number;
  bodyFatPercentage?: number | null;
  muscleMass?: number | null;
  date: Date | string;
}) {
  return prisma.weightRecord.create({
    data: {
      ...data,
      userId,
      date: new Date(data.date),
    },
  });
}

export async function updateWeightRecord(id: string, userId: string, data: {
  weight?: number;
  bodyFatPercentage?: number | null;
  muscleMass?: number | null;
  date?: Date | string;
}) {
  const updateData: any = { ...data };
  if (data.date) {
    updateData.date = new Date(data.date);
  }

  const result = await prisma.weightRecord.updateMany({
    where: { id, userId },
    data: updateData,
  });

  if (result.count > 0) {
    return prisma.weightRecord.findFirst({
      where: { id, userId },
    });
  }
  return null;
}

export async function deleteWeightRecord(id: string, userId: string) {
  return prisma.weightRecord.deleteMany({
    where: { id, userId },
  });
}

export async function getWeightStats(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const records = await prisma.weightRecord.findMany({
    where: {
      userId,
      date: { gte: startDate },
    },
    orderBy: { date: 'asc' },
  });

  if (records.length === 0) {
    return {
      totalRecords: 0,
      avgWeight: 0,
      minWeight: 0,
      maxWeight: 0,
      trend: 'stable' as const,
    };
  }

  const weights = records.map(r => r.weight);
  const avgWeight = weights.reduce((sum, w) => sum + w, 0) / weights.length;
  const minWeight = Math.min(...weights);
  const maxWeight = Math.max(...weights);

  let trend: 'up' | 'down' | 'stable' = 'stable';
  if (records.length >= 2) {
    const firstWeight = records[0].weight;
    const lastWeight = records[records.length - 1].weight;
    if (lastWeight - firstWeight > 0.5) {
      trend = 'up';
    } else if (lastWeight - firstWeight < -0.5) {
      trend = 'down';
    }
  }

  return {
    totalRecords: records.length,
    avgWeight: parseFloat(avgWeight.toFixed(1)),
    minWeight: parseFloat(minWeight.toFixed(1)),
    maxWeight: parseFloat(maxWeight.toFixed(1)),
    trend,
  };
}
