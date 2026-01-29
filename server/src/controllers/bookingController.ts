import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/bookingService';

export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookings = await bookingService.getAllBookings();
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
        const booking = await bookingService.createBooking(req.body);
        res.status(201).json({ success: true, data: booking });
    } catch (error) {
        next(error);
    }
};

export const updateBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
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
