import type { Request, Response } from 'express';
import { entriesService } from '../services/entries.service.js';
import { createEntrySchema, updateEntrySchema } from '@coffee/shared';
import { z } from 'zod';

export class EntriesController {
  async create(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // Validate request body
      const validatedData = createEntrySchema.parse(req.body);

      // Create entry
      const entry = await entriesService.createEntry(req.user.userId, validatedData);

      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.issues,
        });
        return;
      }

      console.error('Create entry error:', error);
      res.status(500).json({ error: 'Failed to create entry' });
    }
  }

  async list(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // Parse query parameters
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 50;
      const offset = req.query.offset ? parseInt(req.query.offset as string, 10) : 0;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      // Get entries
      const result = await entriesService.getEntries(req.user.userId, {
        limit,
        offset,
        startDate,
        endDate,
      });

      res.status(200).json({
        entries: result.entries,
        total: result.total,
        limit,
        offset,
        hasMore: offset + limit < result.total,
      });
    } catch (error) {
      console.error('List entries error:', error);
      res.status(500).json({ error: 'Failed to get entries' });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;

      const entry = await entriesService.getEntryById(req.user.userId, id);

      if (!entry) {
        res.status(404).json({ error: 'Entry not found' });
        return;
      }

      res.status(200).json(entry);
    } catch (error) {
      console.error('Get entry error:', error);
      res.status(500).json({ error: 'Failed to get entry' });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;

      // Validate request body
      const validatedData = updateEntrySchema.parse(req.body);

      // Update entry
      const entry = await entriesService.updateEntry(req.user.userId, id, validatedData);

      if (!entry) {
        res.status(404).json({ error: 'Entry not found' });
        return;
      }

      res.status(200).json(entry);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          error: 'Validation error',
          details: error.issues,
        });
        return;
      }

      console.error('Update entry error:', error);
      res.status(500).json({ error: 'Failed to update entry' });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const { id } = req.params;

      const success = await entriesService.deleteEntry(req.user.userId, id);

      if (!success) {
        res.status(404).json({ error: 'Entry not found' });
        return;
      }

      res.status(204).send();
    } catch (error) {
      console.error('Delete entry error:', error);
      res.status(500).json({ error: 'Failed to delete entry' });
    }
  }
}

export const entriesController = new EntriesController();
