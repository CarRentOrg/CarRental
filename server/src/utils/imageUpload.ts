import ImageKit, { toFile } from '@imagekit/nodejs';
import { imagekit } from '../config/imagekit';

export const uploadToImageKit = async (file: Express.Multer.File, folder: string = '/car-rental') => {
    try {
        const response = await imagekit.files.upload({
            file: await toFile(file.buffer, file.originalname),
            fileName: `${Date.now()}-${file.originalname}`,
            folder: folder,
        });
        return response.url;
    } catch (error) {
        console.error('ImageKit upload error:', error);
        throw error;
    }
};
