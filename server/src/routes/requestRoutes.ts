import express from 'express';
import { getRequests, createRequest, updateRequestStatus, deleteRequest } from '../controllers/requestController';
import { protect, admin } from '../middlewares/auth';

const router = express.Router();

router.get('/', protect, admin, getRequests);
router.post('/', createRequest); // Public, anyone can request a car
router.put('/:id', protect, admin, updateRequestStatus);
router.delete('/:id', protect, admin, deleteRequest);

export default router;
