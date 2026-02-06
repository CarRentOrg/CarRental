import { Request, Response, } from 'express';
import { statsService } from '../services/statsService';

export const getRecentActivity = async (req: Request, res: Response) => {
    try {
        const activity = await statsService.getRecentActivity();
        res.status(200).json({ success: true, data: activity });
    } catch (error) {
        res.json({ succes: false, message: { error } })
    }
};
