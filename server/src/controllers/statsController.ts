import { Request, Response, } from 'express';
import { statsService } from '../services/statsService';

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        const stats = await statsService.getDashboardStats();
        res.status(200).json({ success: true, data: stats });
    } catch (error) {
        res.json({ succes: false, message: { error } })
    }
};

export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        const activity = await statsService.getRecentActivity();
        res.status(200).json({ success: true, data: activity });
    } catch (error) {
        res.json({ succes: false, message: { error } })
    }
};
