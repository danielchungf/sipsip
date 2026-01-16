import type { Request, Response } from 'express';
import { companionsService } from '../services/companions.service.js';
import { z } from 'zod';

const createCompanionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be at most 100 characters').trim(),
});

const updateCompanionSchema = z.object({
  name: z.string().min(1).max(100).trim().optional(),
});

export class CompanionsController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const validatedData = createCompanionSchema.parse(req.body);
      const companion = await companionsService.createCompanion(req.user.userId, validatedData);

      res.status(201).json(companion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.issues });
        return;
      }

      // Handle unique constraint violation
      if ((error as any)?.code === 'P2002') {
        res.status(409).json({ error: 'A companion with this name already exists' });
        return;
      }

      console.error('Create companion error:', error);
      res.status(500).json({ error: 'Failed to create companion' });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const companions = await companionsService.getCompanions(req.user.userId);
      res.status(200).json(companions);
    } catch (error) {
      console.error('List companions error:', error);
      res.status(500).json({ error: 'Failed to get companions' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const companion = await companionsService.getCompanionById(req.user.userId, id);

      if (!companion) {
        res.status(404).json({ error: 'Companion not found' });
        return;
      }

      res.status(200).json(companion);
    } catch (error) {
      console.error('Get companion error:', error);
      res.status(500).json({ error: 'Failed to get companion' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const validatedData = updateCompanionSchema.parse(req.body);
      const companion = await companionsService.updateCompanion(req.user.userId, id, validatedData);

      if (!companion) {
        res.status(404).json({ error: 'Companion not found' });
        return;
      }

      res.status(200).json(companion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: 'Validation error', details: error.issues });
        return;
      }

      if ((error as any)?.code === 'P2002') {
        res.status(409).json({ error: 'A companion with this name already exists' });
        return;
      }

      console.error('Update companion error:', error);
      res.status(500).json({ error: 'Failed to update companion' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;
      const success = await companionsService.deleteCompanion(req.user.userId, id);

      if (!success) {
        res.status(404).json({ error: 'Companion not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete companion error:', error);
      res.status(500).json({ error: 'Failed to delete companion' });
    }
  }
}

export const companionsController = new CompanionsController();
