import { Request, Response } from "express";
import Booking from "../models/Booking";
import Car from "../models/Car";
import User from "../models/User";
import { AuthenticatedRequest } from "../types";
import * as EmailService from "../services/emailService";
import * as SmsService from "../services/smsService";
import mongoose from "mongoose";

interface BookingRequest {
  carId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  note?: string;
  user?: {
    // Optional guest user info if not logged in
    email?: string;
    phone?: string;
    name?: string;
  };
}

export const initBooking = async (req: AuthenticatedRequest, res: Response) => {
  try {
    let userId = req.user?._id;
    const {
      carId,
      startDate,
      endDate,
      totalPrice,
      note,
      user: guestUser,
    }: BookingRequest = req.body;

    // Handle Guest Booking (Create user if needed)
    if (!userId && guestUser) {
      let user = await User.findOne({
        $or: [{ email: guestUser.email }, { phone: guestUser.phone }],
      });

      if (!user) {
        const isEmail = !!guestUser.email;
        user = await User.create({
          email: isEmail ? guestUser.email : undefined,
          phone: !isEmail ? guestUser.phone : undefined,
          name: guestUser.name || "Guest",
          role: "user",
        });
      }
      userId = user._id;
    }

    if (!userId) {
      res
        .status(401)
        .json({ success: false, message: "Unauthorized or Missing User Info" });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    if (start < now) {
      res
        .status(400)
        .json({ success: false, message: "Start date must be in the future" });
      return;
    }

    // 0. FETCH CAR & OWNER
    const car = await Car.findById(carId);
    if (!car) {
      res.status(404).json({ success: false, message: "Car not found" });
      return;
    }

    // 1. ATOMIC OVERLAP CHECK
    // Check for any booking that is Confirmed OR Locked
    // Overlap Logic: (StartA < EndB) and (EndA > StartB)
    const conflictingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ["confirmed", "locked", "completed"] }, // Blocked statuses
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
    });

    if (conflictingBooking) {
      res.status(409).json({
        success: false,
        message: "Car is not available for the selected dates.",
        conflict: true,
      });
      return;
    }

    // 2. CREATE LOCK
    // Set expiry to 10 minutes from now
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const booking = await Booking.create({
      car: carId,
      ownerId: car.ownerId || carId, // Fallback if ownerId missing (migration safety)
      startDate: start,
      endDate: end,
      totalPrice,
      note,
      user: userId,
      status: "locked", // LOCK THE CAR
      paymentStatus: "pending",
      expiresAt: expiresAt, // Auto-expire if not paid
    });

    // Valid Lock Created
    res.status(201).json({
      success: true,
      data: booking,
      message: "Car locked for 10 minutes. Please proceed to payment.",
      expiresAt,
    });
  } catch (error) {
    console.error("INIT BOOKING ERROR:", error);
    res.status(500).json({ success: false, message: { error } });
  }
};

export const confirmBooking = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { bookingId, paymentId } = req.body;

    if (!bookingId || !paymentId) {
      res
        .status(400)
        .json({ success: false, message: "Missing bookingId or paymentId" });
      return;
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    // Check status
    if (booking.status === "confirmed") {
      // Idempotent success
      res.status(200).json({ success: true, data: booking });
      return;
    }

    if (booking.status !== "locked") {
      res.status(400).json({
        success: false,
        message: "Booking is not in locked state (maybe expired or cancelled)",
      });
      return;
    }

    // Verify Expiry (Double check, though DB TTL might have wiped it)
    if (booking.expiresAt && new Date() > booking.expiresAt) {
      res.status(400).json({ success: false, message: "Booking lock expired" });
      return;
    }

    // 3. FINALIZE (Move to Pending for Owner Approval)
    booking.status = "pending";
    booking.paymentStatus = "paid";
    booking.transactionId = paymentId;
    booking.expiresAt = undefined; // Remove expiry
    await booking.save();

    // Note: We don't send confirmation email here yet,
    // because it needs owner approval first.
    // We could send a "Payment Received / Pending Approval" email if desired.

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("CONFIRM BOOKING ERROR:", error);
    res.status(500).json({ success: false, message: error });
  }
};

// ... keep other methods (getBookings, getMyBookings, updateBooking, deleteBooking, etc.)
// Make sure to export them!
export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?._id;
    const { carId, startDate, endDate, totalPrice, status, note } = req.body;

    if (!userId) {
      res.status(401).json({ success: false, message: "Not authorized" });
      return;
    }

    const booking = await Booking.create({
      car: carId,
      user: userId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      totalPrice: totalPrice || 0,
      status: status || "pending",
      paymentStatus: "pending",
      note,
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    console.error("CREATE BOOKING ERROR:", error);
    res.status(500).json({ success: false, message: error });
  }
};

export const getBookings = async (req: Request, res: Response) => {
  // ... implementation
  const bookings = await Booking.find(req.query);
  res.status(200).json({ success: true, data: bookings });
};

export const getMyBookings = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: "Not authorized" });
      return;
    }

    const bookings = await Booking.find({ user: userId })
      .populate("car")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("car")
      .populate("user");

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const checkAvailabilityofCar = async (req: Request, res: Response) => {
  try {
    const { carId, startDate, endDate } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();

    const conflictingBooking = await Booking.findOne({
      car: carId,
      $or: [
        { status: "confirmed" },
        { status: "completed" },
        {
          status: "locked",
          expiresAt: { $gt: now }, // Check for active locks
        },
      ],
      // Overlap Logic: (StartA < EndB) and (EndA > StartB)
      // MongoDB: { startDate: { $lt: end }, endDate: { $gt: start } }
      $and: [{ startDate: { $lt: end } }, { endDate: { $gt: start } }],
    });

    if (conflictingBooking) {
      res.status(200).json({ success: true, available: false });
    } else {
      res.status(200).json({ success: true, available: true });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error });
  }
};

export const changeBookingStatus = async (req: Request, res: Response) => {
  try {
    const { bookingId, status } = req.body;

    if (!bookingId || !status) {
      res.status(400).json({
        success: false,
        message: "Please provide bookingId and status",
      });
      return;
    }

    const booking = await Booking.findByIdAndUpdate(
      bookingId,
      { status },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    // Send Notification
    const user = await User.findById(booking.user);
    if (user && user.email) {
      // Only send confirmation email if confirmed.
      // We might want to add other emails for cancellation etc later.
      if (status === "confirmed") {
        await EmailService.sendBookingConfirmation(
          user.email,
          booking._id.toString(),
        );
      }
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const getAllOwnerBookings = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    // In a real multi-tenant app, filter by owner's cars.
    // For now, assuming admin/owner sees all bookings.
    const bookings = await Booking.find()
      .populate("car")
      .populate("user")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const getCarBookings = async (req: Request, res: Response) => {
  try {
    const { carId } = req.params;
    const now = new Date();

    // Fetch active bookings that block the calendar
    // 1. Confirmed, Completed, OR Pending (Paid)
    // 2. Locked AND Not Expired (temporarily block)
    const bookings = await Booking.find({
      car: carId,
      $or: [
        { status: "confirmed" },
        { status: "completed" },
        { status: "pending" }, // Blocks after payment even if not approved yet
        {
          status: "locked",
          expiresAt: { $gt: now },
        },
      ],
    }).select("startDate endDate status expiresAt");

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const approveBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("user");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Backfill ownerId if missing (Legacy Support)
    if (!booking.ownerId) {
      const car = await Car.findById(booking.car);
      if (car && car.ownerId) {
        booking.ownerId = car.ownerId;
      }
    }

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be approved",
      });
    }

    booking.status = "confirmed";
    await booking.save();

    // NOTIFICATIONS
    const user: any = booking.user;
    const message =
      "Your booking has been confirmed. We look forward to serving you.";

    if (user.email) {
      await EmailService.sendBookingConfirmation(
        user.email,
        booking._id.toString(),
      );
    }

    if (user.phone) {
      await SmsService.sendMockNotification(user.phone, message);
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const rejectBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Backfill ownerId if missing (Legacy Support)
    if (!booking.ownerId) {
      const car = await Car.findById(booking.car);
      if (car && car.ownerId) {
        booking.ownerId = car.ownerId;
      }
    }

    if (booking.status !== "pending" && booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only pending or confirmed bookings can be cancelled",
      });
    }

    booking.status = "cancelled";
    // Optional: If paid, move to refunded or handle paymentStatus
    if (booking.paymentStatus === "paid") {
      booking.paymentStatus = "refunded";
    }
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const completeBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Backfill ownerId if missing (Legacy Support)
    if (!booking.ownerId) {
      const car = await Car.findById(booking.car);
      if (car && car.ownerId) {
        booking.ownerId = car.ownerId;
      }
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Only confirmed bookings can be marked as completed",
      });
    }

    booking.status = "completed";
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
