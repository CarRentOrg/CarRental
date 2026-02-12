import { Router } from "express";
import {
  getBookings,
  getBookingById,
  initBooking,
  confirmBooking,
  updateBooking,
  deleteBooking,
  checkAvailabilityofCar,
  changeBookingStatus,
  getAllOwnerBookings,
  getMyBookings,
  getCarBookings,
  approveBooking,
  rejectBooking,
  completeBooking,
} from "../controllers/bookingController";
import { protect } from "../middlewares/auth";

const router = Router();
router.get("/owner", protect, getAllOwnerBookings as any);
// Owner Actions
router.post("/approve", protect, approveBooking);
router.post("/reject", protect, rejectBooking);
router.post("/complete", protect, completeBooking);

router.post("/check-availability", checkAvailabilityofCar);
router.post("/change-status", protect, changeBookingStatus);
router.get("/my-bookings", protect, getMyBookings as any);

// Public route for calendar availability
router.get("/car/:carId", getCarBookings);

// Two-Phase Booking
router.post("/init", protect, initBooking as any);
router.post("/confirm", protect, confirmBooking as any);

router.route("/").get(getBookings);

router
  .route("/:id")
  .get(getBookingById)
  .put(protect, updateBooking)
  .delete(protect, deleteBooking);

export default router;
