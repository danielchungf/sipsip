import type { CoffeeType, CoffeeSize } from '../constants/coffeeTypes.js';

export type { CoffeeType, CoffeeSize };

// Custom coffee type (user-created)
export interface CustomCoffeeType {
  id: string;
  userId: string;
  name: string;
  caffeine: number | null;
  createdAt: string;
  updatedAt: string;
}

// Companion (person to share coffee with)
export interface Companion {
  id: string;
  userId: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface CoffeeEntry {
  id: string;
  userId: string;
  type: CoffeeType | null;
  customTypeId?: string;
  customType?: CustomCoffeeType;
  size: CoffeeSize;
  caffeine: number;
  notes?: string;
  consumedAt: string;
  createdAt: string;
  updatedAt: string;
  companions?: Companion[];
}

// Helper to get display name for an entry's coffee type
export function getTypeName(entry: CoffeeEntry): string {
  if (entry.customType) {
    return entry.customType.name;
  }
  if (entry.type) {
    return entry.type;
  }
  return 'Unknown';
}

export interface CreateCoffeeEntryDTO {
  type?: CoffeeType;
  customTypeId?: string;
  size: CoffeeSize;
  consumedAt?: string;
  notes?: string;
  companionIds?: string[];
}

export interface UpdateCoffeeEntryDTO {
  type?: CoffeeType | null;
  customTypeId?: string | null;
  size?: CoffeeSize;
  consumedAt?: string;
  notes?: string;
  companionIds?: string[];
}

export interface CreateCustomCoffeeTypeDTO {
  name: string;
  caffeine?: number;
}

export interface UpdateCustomCoffeeTypeDTO {
  name?: string;
  caffeine?: number | null;
}

export interface CreateCompanionDTO {
  name: string;
}

export interface UpdateCompanionDTO {
  name?: string;
}
