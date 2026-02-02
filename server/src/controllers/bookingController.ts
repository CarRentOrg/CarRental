import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/bookingService';

export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { status, car_id, page, limit } = req.query;
        const bookings = await bookingService.getAllBookings({
            status: status as string,
            car_id: car_id as string,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined
        });
        res.status(200).json({ success: true, data: bookings });
    } catch (error) {
        next(error);
    }
};

export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const booking = await bookingService.getBookingById(id);
        if (!booking) {
            res.status(404).json({ success: false, message: 'Booking not found' });
            return;
        }
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { car_id, start_date, end_date } = req.body;
        if (!car_id || !start_date || !end_date) {
            res.status(400).json({ success: false, message: 'Missing required fields: car_id, start_date, and end_date are required.' });
            return;
        }
        const booking = await bookingService.createBooking(req.body);
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

export const updateBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (Object.keys(req.body).length === 0) {
            res.status(400).json({ success: false, message: 'No update data provided.' });
            return;
        }
        const booking = await bookingService.updateBooking(id, req.body);
        res.status(200).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await bookingService.deleteBooking(id);
        res.status(200).json({ success: true, message: 'Booking deleted' });
    } catch (error) {
        next(error);
    }
};
