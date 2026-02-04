import { Router } from 'express';
// We need to see where controller is. Assuming statsController.
import { getDashboardStats, getRecentActivity } from '../controllers/statsController';

const router = Router();

router.get('/dashboard', getDashboardStats);
router.get('/activity', getRecentActivity);

export default router;
