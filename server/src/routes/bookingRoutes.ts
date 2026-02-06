import { Router } from "express";
import {
  getBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  checkAvailabilityofCar,
  changeBookingStatus,
  getAllOwnerBookings,
} from "../controllers/bookingController";
import { protect } from "../middlewares/auth";

const router = Router();

router.get("/", getBookings);
router.get("/:id", getBookingById);
router.post("/", protect, createBooking); // Secured create
router.put("/:id", protect, updateBooking);
router.delete("/:id", protect, deleteBooking);

// New specific routes
router.post("/check-availability", checkAvailabilityofCar);
router.post("/create", protect, createBooking);
router.get("/owner", protect, getAllOwnerBookings as any);
router.post("/change-status", protect, changeBookingStatus);

export default router;
