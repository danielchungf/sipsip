import { prisma } from '../utils/db.js';
import type { CustomCoffeeType as PrismaCustomType } from '@prisma/client';

export interface CustomCoffeeType {
  id: string;
  userId: string;
  name: string;
  caffeine: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCustomCoffeeTypeDTO {
  name: string;
  caffeine?: number;
}

export interface UpdateCustomCoffeeTypeDTO {
  name?: string;
  caffeine?: number | null;
}

export class CustomTypesService {
  async createCustomType(
    userId: string,
    data: CreateCustomCoffeeTypeDTO
  ): Promise<CustomCoffeeType> {
    const customType = await prisma.customCoffeeType.create({
      data: {
        userId,
        name: data.name.trim(),
        caffeine: data.caffeine,
      },
    });
    return this.mapToDto(customType);
  }

  async getCustomTypes(userId: string): Promise<CustomCoffeeType[]> {
    const types = await prisma.customCoffeeType.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });
    return types.map(this.mapToDto);
  }

  async getCustomTypeById(
    userId: string,
    typeId: string
  ): Promise<CustomCoffeeType | null> {
    const type = await prisma.customCoffeeType.findFirst({
      where: { id: typeId, userId },
    });
    return type ? this.mapToDto(type) : null;
  }

  async updateCustomType(
    userId: string,
    typeId: string,
    data: UpdateCustomCoffeeTypeDTO
  ): Promise<CustomCoffeeType | null> {
    const existing = await prisma.customCoffeeType.findFirst({
      where: { id: typeId, userId },
    });
    if (!existing) return null;

    const updated = await prisma.customCoffeeType.update({
      where: { id: typeId },
      data: {
        ...(data.name !== undefined && { name: data.name.trim() }),
        ...(data.caffeine !== undefined && { caffeine: data.caffeine }),
      },
    });
    return this.mapToDto(updated);
  }

  async deleteCustomType(userId: string, typeId: string): Promise<boolean> {
    const result = await prisma.customCoffeeType.deleteMany({
      where: { id: typeId, userId },
    });
    return result.count > 0;
  }

  private mapToDto(type: PrismaCustomType): CustomCoffeeType {
    return {
      id: type.id,
      userId: type.userId,
      name: type.name,
      caffeine: type.caffeine,
      createdAt: type.createdAt.toISOString(),
      updatedAt: type.updatedAt.toISOString(),
    };
  }
}

export const customTypesService = new CustomTypesService();
