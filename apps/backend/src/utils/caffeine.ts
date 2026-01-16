import { CAFFEINE_CONTENT, type CoffeeType, type CoffeeSize } from '@coffee/shared';

export function calculateCaffeine(type: CoffeeType, size: CoffeeSize): number {
  return CAFFEINE_CONTENT[type][size];
}

// Size multipliers relative to MEDIUM
const SIZE_MULTIPLIERS: Record<CoffeeSize, number> = {
  SMALL: 0.67,
  MEDIUM: 1,
  LARGE: 1.5,
  EXTRA_LARGE: 2,
};

// Calculate caffeine for custom types
// If baseCaffeineMedium is provided, scale by size
// Otherwise, use "OTHER" type values as default
export function calculateCustomCaffeine(
  size: CoffeeSize,
  baseCaffeineMedium?: number | null
): number {
  if (baseCaffeineMedium) {
    return Math.round(baseCaffeineMedium * SIZE_MULTIPLIERS[size]);
  }
  return CAFFEINE_CONTENT.OTHER[size];
}
