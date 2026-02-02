import { Request, Response, NextFunction } from 'express';
import { newsService } from '../services/newsService';

export const getNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit } = req.query;
        const news = await newsService.getAllNews({
            page: page ? parseInt(page as string) : undefined,
            limit: limit ? parseInt(limit as string) : undefined
        });
        res.status(200).json({ success: true, data: news });
    } catch (error) {
        next(error);
    }
};

export const getNewsById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const news = await newsService.getNewsById(id);
        if (!news) {
            res.status(404).json({ success: false, message: 'News not found' });
            return;
        }
        res.status(200).json({ success: true, data: news });
    } catch (error) {
        next(error);
    }
};

export const createNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { title_en, title_mn, content_en, content_mn } = req.body;
        if (!title_en || !title_mn || !content_en || !content_mn) {
            res.status(400).json({ success: false, message: 'Missing required news fields (titles and contents in both languages).' });
            return;
        }
        const news = await newsService.createNews(req.body);
        res.status(201).json({ success: true, data: news });
    } catch (error) {
        next(error);
    }
};

export const updateNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (Object.keys(req.body).length === 0) {
            res.status(400).json({ success: false, message: 'No update data provided.' });
            return;
        }
        const news = await newsService.updateNews(id, req.body);
        res.status(200).json({ success: true, data: news });
    } catch (error) {
        next(error);
    }
};

export const deleteNews = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await newsService.deleteNews(id);
        res.status(200).json({ success: true, message: 'News deleted' });
    } catch (error) {
        next(error);
    }
};
