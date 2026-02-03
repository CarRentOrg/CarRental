import { Request, Response, NextFunction } from 'express';
import { requestService } from '../services/requestService';

export const getRequests = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const requests = await requestService.getAllRequests();
        res.status(200).json({ success: true, data: requests });
    } catch (error) {
        next(error);
    }
};

export const createRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user_name, user_email, car_model, message } = req.body;
        if (!user_name || !user_email || !car_model) {
            res.status(400).json({ success: false, message: 'Missing required fields' });
            return;
        }

        const newRequest = await requestService.createRequest({
            user_name,
            user_email,
            car_model,
            message
        });
        res.status(201).json({ success: true, data: newRequest });
    } catch (error) {
        next(error);
    }
};

export const updateRequestStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const updatedRequest = await requestService.updateRequestStatus(id, status);
        res.status(200).json({ success: true, data: updatedRequest });
    } catch (error) {
        next(error);
    }
};

export const deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await requestService.deleteRequest(id);
        res.status(200).json({ success: true, message: 'Request deleted' });
    } catch (error) {
        next(error);
    }
};
