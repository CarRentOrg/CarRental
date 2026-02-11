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
router.get("/owner", protect, getAllOwnerBookings as any);
router.post("/check-availability", checkAvailabilityofCar);
router.post("/change-status", protect, changeBookingStatus);
router.get("/my-bookings", protect, getBookings as any);

router
  .route("/")
  .get(getBookings)
  .post(protect, createBooking as any);

router
  .route("/:id")
  .get(getBookingById)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

export default router;
