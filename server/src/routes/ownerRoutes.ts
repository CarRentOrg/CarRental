import express from 'express';
import {
    addCar,
    changeRoleToOwner,
    deleteCar,
    getDashboardData,
    getOwnerCars,
    toggleCarAvailability,
    updateUserImage,
} from '../controllers/ownerController';
import { protect } from '../middlewares/auth';
import upload from '../middlewares/multer';

const router = express.Router();

router.post('/change-role', protect, changeRoleToOwner);
router.post('/add-car', upload.single('image'), protect, addCar);
router.get('/cars', protect, getOwnerCars);
router.post('/toggle-car', protect, toggleCarAvailability);
router.post('/delete-car', protect, deleteCar);

router.get('/dashboard', protect, getDashboardData);
router.post('/update-image', upload.single('image'), protect, updateUserImage);

export default router;
