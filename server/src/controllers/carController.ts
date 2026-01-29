import { Request, Response, NextFunction } from 'express';
import { carService } from '../services/carService';

export const getCars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cars = await carService.getAllCars();
        res.status(200).json({ success: true, data: cars });
    } catch (error) {
        next(error);
    }
};

export const getCarById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const car = await carService.getCarById(id);
        if (!car) {
            res.status(404).json({ success: false, message: 'Car not found' });
            return;
        }
        res.status(200).json({ success: true, data: car });
    } catch (error) {
        next(error);
    }
};

export const createCar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const car = await carService.createCar(req.body);
        res.status(201).json({ success: true, data: car });
    } catch (error) {
        next(error);
    }
};

export const updateCar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const car = await carService.updateCar(id, req.body);
        res.status(200).json({ success: true, data: car });
    } catch (error) {
        next(error);
    }
};

export const deleteCar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await carService.deleteCar(id);
        res.status(200).json({ success: true, message: 'Car deleted' });
    } catch (error) {
        next(error);
    }
};
