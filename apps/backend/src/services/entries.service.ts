import { prisma } from '../utils/db.js';
import { calculateCaffeine, calculateCustomCaffeine } from '../utils/caffeine.js';
import type { CreateCoffeeEntryDTO, UpdateCoffeeEntryDTO, CoffeeEntry } from '@coffee/shared';

export class EntriesService {
  async createEntry(userId: string, data: CreateCoffeeEntryDTO): Promise<CoffeeEntry> {
    // Calculate caffeine based on type or custom type
    let caffeine: number;

    if (data.customTypeId) {
      // Get custom type to check for user-defined caffeine
      const customType = await prisma.customCoffeeType.findFirst({
        where: { id: data.customTypeId, userId },
      });
      if (!customType) {
        throw new Error('Custom type not found');
      }
      caffeine = calculateCustomCaffeine(data.size, customType.caffeine);
    } else if (data.type) {
      caffeine = calculateCaffeine(data.type, data.size);
    } else {
      throw new Error('Either type or customTypeId must be provided');
    }

    const entry = await prisma.coffeeEntry.create({
      data: {
        userId,
        type: data.type || null,
        customTypeId: data.customTypeId || null,
        size: data.size,
        caffeine,
        notes: data.notes,
        consumedAt: data.consumedAt ? new Date(data.consumedAt) : new Date(),
        // Connect companions if provided
        companions: data.companionIds?.length
          ? { connect: data.companionIds.map((id) => ({ id })) }
          : undefined,
      },
      include: {
        customType: true,
        companions: true,
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
        include: {
          customType: true,
          companions: true,
        },
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
      include: {
        customType: true,
        companions: true,
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
      include: { customType: true },
    });

    if (!existing) {
      return null;
    }

    // Determine new type/customTypeId values
    const newType = data.type !== undefined ? data.type : existing.type;
    const newCustomTypeId = data.customTypeId !== undefined ? data.customTypeId : existing.customTypeId;
    const newSize = data.size || existing.size;

    // Recalculate caffeine if type, customTypeId, or size changed
    let caffeine = existing.caffeine;
    if (data.type !== undefined || data.customTypeId !== undefined || data.size) {
      if (newCustomTypeId) {
        const customType = await prisma.customCoffeeType.findFirst({
          where: { id: newCustomTypeId, userId },
        });
        caffeine = calculateCustomCaffeine(newSize, customType?.caffeine);
      } else if (newType) {
        caffeine = calculateCaffeine(newType, newSize);
      }
    }

    const updated = await prisma.coffeeEntry.update({
      where: { id: entryId },
      data: {
        ...(data.type !== undefined && { type: data.type }),
        ...(data.customTypeId !== undefined && { customTypeId: data.customTypeId }),
        ...(data.size && { size: data.size }),
        ...(data.notes !== undefined && { notes: data.notes }),
        ...(data.consumedAt && { consumedAt: new Date(data.consumedAt) }),
        caffeine,
        // Handle companions update - set to new array (disconnect all, then connect new)
        ...(data.companionIds !== undefined && {
          companions: {
            set: data.companionIds.map((id) => ({ id })),
          },
        }),
      },
      include: {
        customType: true,
        companions: true,
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

  private mapToDto(entry: any): CoffeeEntry {
    return {
      id: entry.id,
      userId: entry.userId,
      type: entry.type,
      customTypeId: entry.customTypeId || undefined,
      customType: entry.customType
        ? {
            id: entry.customType.id,
            userId: entry.customType.userId,
            name: entry.customType.name,
            caffeine: entry.customType.caffeine,
            createdAt: entry.customType.createdAt.toISOString(),
            updatedAt: entry.customType.updatedAt.toISOString(),
          }
        : undefined,
      size: entry.size,
      caffeine: entry.caffeine,
      notes: entry.notes || undefined,
      consumedAt: entry.consumedAt.toISOString(),
      createdAt: entry.createdAt.toISOString(),
      updatedAt: entry.updatedAt.toISOString(),
      companions: entry.companions?.map((c: any) => ({
        id: c.id,
        userId: c.userId,
        name: c.name,
        createdAt: c.createdAt.toISOString(),
        updatedAt: c.updatedAt.toISOString(),
      })),
    };
  }
}

export const entriesService = new EntriesService();
