import prisma from '../config/prisma';

export async function getDietRecords(userId: string, startDate?: Date, endDate?: Date) {
  const where: any = { userId };

  if (startDate && endDate) {
    where.date = {
      gte: startDate,
      lte: endDate,
    };
  }

  return prisma.dietRecord.findMany({
    where,
    orderBy: { date: 'desc' },
  });
}

export async function getDietRecordById(id: string, userId: string) {
  return prisma.dietRecord.findFirst({
    where: { id, userId },
  });
}

export async function createDietRecord(userId: string, data: {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  quantity: number;
  mealType: string;
  date: Date | string;
}) {
  return prisma.dietRecord.create({
    data: {
      ...data,
      userId,
      date: new Date(data.date),
    },
  });
}

export async function updateDietRecord(id: string, userId: string, data: {
  foodName?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  quantity?: number;
  mealType?: string;
  date?: Date | string;
}) {
  const updateData: any = { ...data };
  if (data.date) {
    updateData.date = new Date(data.date);
  }

  const result = await prisma.dietRecord.updateMany({
    where: { id, userId },
    data: updateData,
  });

  if (result.count > 0) {
    return prisma.dietRecord.findFirst({
      where: { id, userId },
    });
  }
  return null;
}

export async function deleteDietRecord(id: string, userId: string) {
  return prisma.dietRecord.deleteMany({
    where: { id, userId },
  });
}

export async function getDietStats(userId: string, days: number = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const records = await prisma.dietRecord.findMany({
    where: {
      userId,
      date: { gte: startDate },
    },
  });

  const totalCalories = records.reduce((sum, r) => sum + r.calories, 0);
  const totalProtein = records.reduce((sum, r) => sum + r.protein, 0);
  const totalCarbs = records.reduce((sum, r) => sum + r.carbs, 0);
  const totalFat = records.reduce((sum, r) => sum + r.fat, 0);

  const avgDays = days > 0 ? days : 1;

  return {
    totalRecords: records.length,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFat,
    avgCaloriesPerDay: Math.round(totalCalories / avgDays),
    avgProteinPerDay: parseFloat((totalProtein / avgDays).toFixed(1)),
    avgCarbsPerDay: parseFloat((totalCarbs / avgDays).toFixed(1)),
    avgFatPerDay: parseFloat((totalFat / avgDays).toFixed(1)),
  };
}
