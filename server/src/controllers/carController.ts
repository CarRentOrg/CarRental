import { Request, Response, NextFunction } from 'express';
import { carService } from '../services/carService';

export const getCars = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { brand, model, transmission, fuel_type, is_available, page, limit } = req.query;
        const cars = await carService.getAllCars({
            brand: brand as string,
            model: model as string,
            transmission: transmission as string,
            fuel_type: fuel_type as string,
            is_available: is_available !== undefined ? is_available === 'true' : undefined,
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined
        });
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
        const { brand, model, price_per_day, type } = req.body;

        if (!brand || !model || !price_per_day || !type) {
            res.status(400).json({
                success: false,
                message: 'Missing required fields: brand, model, price_per_day, and type are required.'
            });
            return;
        }

        const carData = {
            ...req.body,
            is_available: req.body.is_available ?? true,
            year: req.body.year ? parseInt(req.body.year.toString()) : new Date().getFullYear(),
        };

        const car = await carService.createCar(carData);
        res.status(201).json({ success: true, data: car });
    } catch (error) {
        next(error);
    }
};

export const updateCar = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (Object.keys(req.body).length === 0) {
            res.status(400).json({ success: false, message: 'No update data provided.' });
            return;
        }
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
