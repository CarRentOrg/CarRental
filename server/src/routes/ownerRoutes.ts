import express from "express";
import {
  addCar,
  changeRoleToOwner,
  deleteCar,
  getOwnerDashboardStats,
  getOwnerCars,
  toggleCarAvailability,
  updateUserImage,
  getAllUsersWithStats,
  getPendingBookings,
} from "../controllers/ownerController";

import { protect } from "../middlewares/auth";
import upload from "../middlewares/multer";
import { updateCar } from "../controllers/carController";
import { getAllOwnerBookings } from "../controllers/bookingController";
import { requireOwner } from "../middlewares/owner.middleware";

const router = express.Router();

router.post("/change-role", protect, changeRoleToOwner as any);
router.post(
  "/add-car",
  protect,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  addCar as any,
);
router.put(
  "/update-car/:id",
  protect,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  updateCar as any,
);
router.get("/cars", protect, requireOwner, getOwnerCars as any);
router.post("/toggle-car", protect, requireOwner, toggleCarAvailability as any);
router.get("/dashboard", protect, requireOwner, getOwnerDashboardStats as any);
router.get("/cars", protect, requireOwner, getOwnerCars as any);
router.delete("/cars/:id", protect, requireOwner, deleteCar as any);
router.get("/bookings", protect, requireOwner, getAllOwnerBookings as any);
router.get(
  "/bookings/pending",
  protect,
  requireOwner,
  getPendingBookings as any,
);
router.get("/customers", protect, requireOwner, getAllUsersWithStats as any);

router.post(
  "/update-image",
  upload.single("image"),
  protect,
  requireOwner,
  updateUserImage as any,
);

export default router;
