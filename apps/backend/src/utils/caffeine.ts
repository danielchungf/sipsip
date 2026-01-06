import { CAFFEINE_CONTENT, type CoffeeType, type CoffeeSize } from '@coffee/shared';

export function calculateCaffeine(type: CoffeeType, size: CoffeeSize): number {
  return CAFFEINE_CONTENT[type][size];
}
