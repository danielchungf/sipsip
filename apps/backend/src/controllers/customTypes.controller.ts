import type { Request, Response } from 'express';
import { customTypesService } from '../services/customTypes.service.js';
import { z } from 'zod';

const createCustomTypeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name must be at most 50 characters').trim(),
  caffeine: z.number().int().min(0).max(1000).optional(),
});

const updateCustomTypeSchema = z.object({
  name: z.string().min(1).max(50).trim().optional(),
  caffeine: z.number().int().min(0).max(1000).nullable().optional(),
});

export class CustomTypesController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const validatedData = createCustomTypeSchema.parse(req.body);
      const customType = await customTypesService.createCustomType(req.user.userId, validatedData);

      res.status(201).json(customType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.issues });
        return;
      }

      // Handle unique constraint violation
      if ((error as any)?.code === 'P2002') {
        res.status(409).json({ error: 'A custom type with this name already exists' });
        return;
      }

      console.error('Create custom type error:', error);
      res.status(500).json({ error: 'Failed to create custom type' });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const customTypes = await customTypesService.getCustomTypes(req.user.userId);
      res.status(200).json(customTypes);
    } catch (error) {
      console.error('List custom types error:', error);
      res.status(500).json({ error: 'Failed to get custom types' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const customType = await customTypesService.getCustomTypeById(req.user.userId, id);

      if (!customType) {
        res.status(404).json({ error: 'Custom type not found' });
        return;
      }

      res.status(200).json(customType);
    } catch (error) {
      console.error('Get custom type error:', error);
      res.status(500).json({ error: 'Failed to get custom type' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const validatedData = updateCustomTypeSchema.parse(req.body);
      const customType = await customTypesService.updateCustomType(req.user.userId, id, validatedData);

      if (!customType) {
        res.status(404).json({ error: 'Custom type not found' });
        return;
      }

      res.status(200).json(customType);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.issues });
        return;
      }

      if ((error as any)?.code === 'P2002') {
        res.status(409).json({ error: 'A custom type with this name already exists' });
        return;
      }

      console.error('Update custom type error:', error);
      res.status(500).json({ error: 'Failed to update custom type' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const success = await customTypesService.deleteCustomType(req.user.userId, id);

      if (!success) {
        res.status(404).json({ error: 'Custom type not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete custom type error:', error);
      res.status(500).json({ error: 'Failed to delete custom type' });
    }
  }
}

export const customTypesController = new CustomTypesController();
