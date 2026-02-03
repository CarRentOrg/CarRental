import express, { Request, Response } from 'express';
import ImageKit from '@imagekit/nodejs';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

const imagekit = new ImageKit({
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

router.get('/auth', (req: Request, res: Response) => {
    const authenticationParameters = imagekit.helper.getAuthenticationParameters();
    res.send(authenticationParameters);
});

export default router;
