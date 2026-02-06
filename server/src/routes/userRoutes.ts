import express from "express";
import { getUserData } from "../controllers/userController";
import { protect } from "../middlewares/auth";
import { getCars } from "../controllers/carController";

const router = express.Router();

router.get("/data", protect, getUserData as any);
router.get("/cars", getCars as any);

export default router;
