import { prisma } from '../utils/db.js';
import type { DailyStats, AggregatedStats, ContributionData, CoffeeType } from '@coffee/shared';

export class StatsService {
  async getDailyStats(
    userId: string,
    options?: { startDate?: Date; endDate?: Date }
  ): Promise<DailyStats[]> {
    const { startDate, endDate } = options || {};

    const entries = await prisma.coffeeEntry.findMany({
      where: {
        userId,
        ...(startDate || endDate
          ? {
              consumedAt: {
                ...(startDate ? { gte: startDate } : {}),
                ...(endDate ? { lte: endDate } : {}),
              },
            }
          : {}),
      },
      orderBy: { consumedAt: 'desc' },
    });

    // Group by date
    const groupedByDate = new Map<string, typeof entries>();

    for (const entry of entries) {
      const dateKey = entry.consumedAt.toISOString().split('T')[0];
      if (!groupedByDate.has(dateKey)) {
        groupedByDate.set(dateKey, []);
      }
      groupedByDate.get(dateKey)!.push(entry);
    }

    // Convert to DailyStats
    const dailyStats: DailyStats[] = [];

    for (const [date, dayEntries] of groupedByDate.entries()) {
      const totalCaffeine = dayEntries.reduce((sum, entry) => sum + entry.caffeine, 0);

      dailyStats.push({
        date,
        count: dayEntries.length,
        totalCaffeine,
        entries: dayEntries.map((entry) => ({
          id: entry.id,
          userId: entry.userId,
          type: entry.type,
          size: entry.size,
          caffeine: entry.caffeine,
          notes: entry.notes || undefined,
          consumedAt: entry.consumedAt.toISOString(),
          createdAt: entry.createdAt.toISOString(),
          updatedAt: entry.updatedAt.toISOString(),
        })),
      });
    }

    return dailyStats.sort((a, b) => b.date.localeCompare(a.date));
  }

  async getAggregatedStats(userId: string): Promise<AggregatedStats> {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 7);
    const monthStart = new Date(now);
    monthStart.setDate(now.getDate() - 30);

    // Get all entries for calculations
    const [todayEntries, weekEntries, monthEntries, allEntries] = await Promise.all([
      prisma.coffeeEntry.findMany({
        where: { userId, consumedAt: { gte: todayStart } },
      }),
      prisma.coffeeEntry.findMany({
        where: { userId, consumedAt: { gte: weekStart } },
      }),
      prisma.coffeeEntry.findMany({
        where: { userId, consumedAt: { gte: monthStart } },
      }),
      prisma.coffeeEntry.findMany({
        where: { userId },
      }),
    ]);

    // Calculate totals
    const daily = todayEntries.length;
    const weekly = weekEntries.length;
    const monthly = monthEntries.length;

    // Calculate average daily consumption (over last 30 days)
    const averageDaily = monthly > 0 ? Math.round((monthly / 30) * 10) / 10 : 0;

    // Calculate total caffeine
    const totalCaffeine = allEntries.reduce((sum, entry) => sum + entry.caffeine, 0);

    // Find most common coffee type
    const typeCounts = new Map<CoffeeType, number>();
    for (const entry of allEntries) {
      typeCounts.set(entry.type, (typeCounts.get(entry.type) || 0) + 1);
    }

    let mostCommonType: CoffeeType | undefined;
    let maxCount = 0;

    for (const [type, count] of typeCounts.entries()) {
      if (count > maxCount) {
        maxCount = count;
        mostCommonType = type;
      }
    }

    return {
      daily,
      weekly,
      monthly,
      averageDaily,
      totalCaffeine,
      mostCommonType,
    };
  }

  async getContributionData(userId: string): Promise<ContributionData[]> {
    // Get last 365 days of data
    const now = new Date();
    const oneYearAgo = new Date(now);
    oneYearAgo.setDate(now.getDate() - 365);

    const entries = await prisma.coffeeEntry.findMany({
      where: {
        userId,
        consumedAt: { gte: oneYearAgo },
      },
      select: {
        consumedAt: true,
      },
    });

    // Count entries per day
    const countsPerDay = new Map<string, number>();

    for (const entry of entries) {
      const dateKey = entry.consumedAt.toISOString().split('T')[0];
      countsPerDay.set(dateKey, (countsPerDay.get(dateKey) || 0) + 1);
    }

    // Generate all 365 days with counts
    const contributionData: ContributionData[] = [];

    for (let i = 0; i < 365; i++) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      const count = countsPerDay.get(dateKey) || 0;

      contributionData.push({
        date: dateKey,
        count,
        level: this.getIntensityLevel(count),
      });
    }

    // Sort by date ascending (oldest first for proper grid rendering)
    return contributionData.sort((a, b) => a.date.localeCompare(b.date));
  }

  private getIntensityLevel(count: number): 0 | 1 | 2 | 3 | 4 {
    if (count === 0) return 0;
    if (count <= 2) return 1;
    if (count <= 4) return 2;
    if (count <= 6) return 3;
    return 4;
  }
}

export const statsService = new StatsService();
