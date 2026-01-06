import type { CoffeeType, CoffeeSize } from '../constants/coffeeTypes.js';

export type { CoffeeType, CoffeeSize };

export interface CoffeeEntry {
  id: string;
  userId: string;
  type: CoffeeType;
  size: CoffeeSize;
  caffeine: number;
  notes?: string;
  consumedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCoffeeEntryDTO {
  type: CoffeeType;
  size: CoffeeSize;
  consumedAt?: string;
  notes?: string;
}

export interface UpdateCoffeeEntryDTO {
  type?: CoffeeType;
  size?: CoffeeSize;
  consumedAt?: string;
  notes?: string;
}
