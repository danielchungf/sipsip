import { prisma } from '../utils/db.js';
import type { Companion as PrismaCompanion } from '@prisma/client';

export interface Companion {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanionDTO {
  name: string;
}

export interface UpdateCompanionDTO {
  name?: string;
}

export class CompanionsService {
  async createCompanion(
    userId: string,
    data: CreateCompanionDTO
  ): Promise<Companion> {
    const companion = await prisma.companion.create({
      data: {
        userId,
        name: data.name.trim(),
      },
    });
    return this.mapToDto(companion);
  }

  async getCompanions(userId: string): Promise<Companion[]> {
    const companions = await prisma.companion.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
    return companions.map(this.mapToDto);
  }

  async getCompanionById(
    userId: string,
    companionId: string
  ): Promise<Companion | null> {
    const companion = await prisma.companion.findFirst({
      where: { id: companionId, userId },
    });
    return companion ? this.mapToDto(companion) : null;
  }

  async updateCompanion(
    userId: string,
    companionId: string,
    data: UpdateCompanionDTO
  ): Promise<Companion | null> {
    const existing = await prisma.companion.findFirst({
      where: { id: companionId, userId },
    });
    if (!existing) return null;

    const updated = await prisma.companion.update({
      where: { id: companionId },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
      },
    });
    return this.mapToDto(updated);
  }

  async deleteCompanion(userId: string, companionId: string): Promise<boolean> {
    const result = await prisma.companion.deleteMany({
      where: { id: companionId, userId },
    });
    return result.count > 0;
  }

  private mapToDto(companion: PrismaCompanion): Companion {
    return {
      id: companion.id,
      userId: companion.userId,
      name: companion.name,
      createdAt: companion.createdAt.toISOString(),
      updatedAt: companion.updatedAt.toISOString(),
    };
  }
}

export const companionsService = new CompanionsService();
