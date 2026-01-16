import { z } from 'zod';
import { COFFEE_TYPES, COFFEE_SIZES } from '../constants/coffeeTypes.js';

export const createEntrySchema = z
  .object({
    type: z.enum(COFFEE_TYPES, { message: 'Invalid coffee type' }).optional(),
    customTypeId: z.string().uuid('Invalid custom type ID').optional(),
    size: z.enum(COFFEE_SIZES, { message: 'Invalid coffee size' }),
    consumedAt: z.string().datetime().optional(),
    notes: z.string().max(500, 'Notes must be at most 500 characters').optional(),
    companionIds: z.array(z.string().uuid('Invalid companion ID')).optional(),
  })
  .refine((data) => data.type !== undefined || data.customTypeId !== undefined, {
    message: 'Either type or customTypeId must be provided',
  });

export const updateEntrySchema = z.object({
  type: z.enum(COFFEE_TYPES, { message: 'Invalid coffee type' }).nullable().optional(),
  customTypeId: z.string().uuid('Invalid custom type ID').nullable().optional(),
  size: z.enum(COFFEE_SIZES, { message: 'Invalid coffee size' }).optional(),
  consumedAt: z.string().datetime().optional(),
  notes: z.string().max(500, 'Notes must be at most 500 characters').optional(),
  companionIds: z.array(z.string().uuid('Invalid companion ID')).optional(),
});

export type CreateEntryInput = z.infer<typeof createEntrySchema>;
export type UpdateEntryInput = z.infer<typeof updateEntrySchema>;
