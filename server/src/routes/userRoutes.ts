import express from 'express';
import {
    getCars,
    getUserData,
    loginUser,
    registerUser,
} from '../controllers/userController';
import { protect } from '../middlewares/auth';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/data', protect, getUserData);
router.get('/cars', getCars);

export default router;
