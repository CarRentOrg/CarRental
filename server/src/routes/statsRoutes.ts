import { Router } from 'express';
// We need to see where controller is. Assuming statsController.
import { getDashboardStats } from '../controllers/statsController';

const router = Router();

router.get('/dashboard', getDashboardStats);

export default router;
