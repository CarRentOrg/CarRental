import express from "express";
import { getUserData } from "../controllers/userController";
import { protect } from "../middlewares/auth";
import { getCarById, getCars } from "../controllers/carController";

const router = express.Router();

router.get("/data", protect, getUserData as any);
router.get("/cars", getCars as any);
router.get("/cars/:id", getCarById as any);

export default router;
