import { Request, Response, NextFunction } from 'express';
import { statsService } from '../services/statsService';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const stats = await statsService.getDashboardStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        next(error);
    }
};

export const getRecentActivity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const activity = await statsService.getRecentActivity();
        res.status(200).json({ success: true, data: activity });
    } catch (error) {
        next(error);
    }
};
