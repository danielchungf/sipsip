import type { CoffeeEntry, CoffeeType } from './coffee.js';

export interface DailyStats {
  date: string;
  count: number;
  totalCaffeine: number;
  entries: CoffeeEntry[];
}

export interface AggregatedStats {
  daily: number;
  weekly: number;
  monthly: number;
  averageDaily: number;
  totalCaffeine: number;
  mostCommonType?: CoffeeType;
}

export interface ContributionData {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}
