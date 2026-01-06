import { prisma } from '../utils/db.js';
import { calculateCaffeine } from '../utils/caffeine.js';
import type { CreateCoffeeEntryDTO, UpdateCoffeeEntryDTO, CoffeeEntry } from '@coffee/shared';
import type { CoffeeEntry as PrismaCoffeeEntry } from '@prisma/client';

export class EntriesService {
  async createEntry(userId: string, data: CreateCoffeeEntryDTO): Promise<CoffeeEntry> {
    const caffeine = calculateCaffeine(data.type, data.size);

    const entry = await prisma.coffeeEntry.create({
      data: {
        userId,
        type: data.type,
        size: data.size,
        caffeine,
        notes: data.notes,
        consumedAt: data.consumedAt ? new Date(data.consumedAt) : new Date(),
      },
    });

    return this.mapToDto(entry);
  }

  async getEntries(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ): Promise<{ entries: CoffeeEntry[]; total: number }> {
    const { limit = 50, offset = 0, startDate, endDate } = options || {};

    const where = {
      userId,
      ...(startDate || endDate
        ? {
            consumedAt: {
              ...(startDate ? { gte: startDate } : {}),
              ...(endDate ? { lte: endDate } : {}),
            },
          }
        : {}),
    };

    const [entries, total] = await Promise.all([
      prisma.coffeeEntry.findMany({
        where,
        orderBy: { consumedAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.coffeeEntry.count({ where }),
    ]);

    return {
      entries: entries.map((entry) => this.mapToDto(entry)),
      total,
    };
  }

  async getEntryById(userId: string, entryId: string): Promise<CoffeeEntry | null> {
    const entry = await prisma.coffeeEntry.findFirst({
      where: {
        id: entryId,
        userId,
      },
    });

    if (!entry) {
      return null;
    }

    return this.mapToDto(entry);
  }

  async updateEntry(
    userId: string,
    entryId: string,
    data: UpdateCoffeeEntryDTO
  ): Promise<CoffeeEntry | null> {
    // First, check if entry exists and belongs to user
    const existing = await prisma.coffeeEntry.findFirst({
      where: {
        id: entryId,
        userId,
      },
    });

    if (!existing) {
      return null;
    }

    // Recalculate caffeine if type or size changed
    let caffeine = existing.caffeine;
    if (data.type || data.size) {
      const type = data.type || existing.type;
      const size = data.size || existing.size;
      caffeine = calculateCaffeine(type, size);
    }

    const updated = await prisma.coffeeEntry.update({
      where: { id: entryId },
      data: {
        ...(data.type && { type: data.type }),
        ...(data.size && { size: data.size }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.consumedAt && { consumedAt: new Date(data.consumedAt) }),
        caffeine,
      },
    });

    return this.mapToDto(updated);
  }

  async deleteEntry(userId: string, entryId: string): Promise<boolean> {
    try {
      await prisma.coffeeEntry.deleteMany({
        where: {
          id: entryId,
          userId,
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  private mapToDto(entry: PrismaCoffeeEntry): CoffeeEntry {
    return {
      id: entry.id,
      userId: entry.userId,
      type: entry.type,
      size: entry.size,
      caffeine: entry.caffeine,
      notes: entry.notes || undefined,
      consumedAt: entry.consumedAt.toISOString(),
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
    };
  }
}

export const entriesService = new EntriesService();
