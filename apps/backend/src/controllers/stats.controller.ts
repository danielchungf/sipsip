import type { Request, Response } from 'express';
import { statsService } from '../services/stats.service.js';

export class StatsController {
  async getDailyStats(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      // Parse query parameters
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const dailyStats = await statsService.getDailyStats(req.user.userId, {
        startDate,
        endDate,
      });

      res.status(200).json(dailyStats);
    } catch (error) {
      console.error('Get daily stats error:', error);
      res.status(500).json({ error: 'Failed to get daily stats' });
    }
  }

  async getAggregatedStats(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const stats = await statsService.getAggregatedStats(req.user.userId);

      res.status(200).json(stats);
    } catch (error) {
      console.error('Get aggregated stats error:', error);
      res.status(500).json({ error: 'Failed to get aggregated stats' });
    }
  }

  async getContributionData(req: Request, res: Response): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ error: 'Not authenticated' });
        return;
      }

      const contributionData = await statsService.getContributionData(req.user.userId);

      res.status(200).json(contributionData);
    } catch (error) {
      console.error('Get contribution data error:', error);
      res.status(500).json({ error: 'Failed to get contribution data' });
    }
  }
}

export const statsController = new StatsController();
