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
  startTime?: string;
  endTime?: string;
  totalPrice: number;
  note?: string;
  withDriver?: boolean;
  driverFee?: number;
  depositAmount?: number;
  user?: {
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
      startTime,
      endTime,
      totalPrice,
      note,
      withDriver,
      driverFee,
      depositAmount,
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

    if (startTime) {
      const [h, m] = startTime.split(":").map(Number);
      start.setHours(h, m, 0, 0);
    }

    if (endTime) {
      const [h, m] = endTime.split(":").map(Number);
      end.setHours(h, m, 0, 0);
    } else if (!startTime && !endTime) {
      end.setHours(23, 59, 59, 999);
    }

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
    // Check for any booking that is Confirmed or Completed
    // Overlap Logic: (StartA < EndB) and (EndA > StartB)
    const conflictingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ["confirmed", "completed"] }, // Blocked statuses
      $and: [{ startDate: { $lt: end } }, { endDate: { $gt: start } }],
    });

    if (conflictingBooking) {
      res.status(409).json({
        success: false,
        message: "Car is not available for the selected dates.",
        conflict: true,
      });
      return;
    }

    // 2. CREATE DRAFT
    // Set expiry to 30 minutes from now
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const booking = await Booking.create({
      car: carId,
      ownerId: car.ownerId || carId,
      startDate: start,
      endDate: end,
      startTime,
      endTime,
      totalPrice,
      note,
      user: userId,
      status: "draft",
      paymentStatus: "pending",
      expiresAt: expiresAt,
      withDriver: withDriver || false,
      driverFee: driverFee || 0,
      depositAmount: depositAmount || 0,
    });

    res.status(201).json({
      success: true,
      data: booking,
      message: "Draft booking created.",
      expiresAt,
    });
  } catch (error) {
    console.error("INIT BOOKING ERROR:", error);
    res.status(500).json({ success: false, message: { error } });
  }
};

export const updateDraftBooking = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { id } = req.params;
    const {
      startDate,
      endDate,
      startTime,
      endTime,
      totalPrice,
      note,
      withDriver,
      driverFee,
      depositAmount,
    } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }

    if (booking.user.toString() !== req.user?._id?.toString()) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    if (booking.status !== "draft" && booking.status !== "payment_pending") {
      res.status(400).json({
        success: false,
        message: "Only draft or payment_pending bookings can be updated.",
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (startTime) {
      const [h, m] = startTime.split(":").map(Number);
      start.setHours(h, m, 0, 0);
    }

    if (endTime) {
      const [h, m] = endTime.split(":").map(Number);
      end.setHours(h, m, 0, 0);
    } else if (!startTime && !endTime) {
      end.setHours(23, 59, 59, 999);
    }

    // Check overlap again
    const conflictingBooking = await Booking.findOne({
      car: booking.car,
      status: { $in: ["confirmed", "completed"] },
      $and: [{ startDate: { $lt: end } }, { endDate: { $gt: start } }],
    });

    if (conflictingBooking) {
      res.status(409).json({
        success: false,
        message: "Car is not available for the selected dates.",
        conflict: true,
      });
      return;
    }

    booking.startDate = start;
    booking.endDate = end;
    booking.startTime = startTime;
    booking.endTime = endTime;
    booking.totalPrice = totalPrice;
    booking.note = note;
    booking.withDriver = withDriver || false;
    booking.driverFee = driverFee || 0;
    booking.depositAmount = depositAmount || 0;
    booking.expiresAt = new Date(Date.now() + 30 * 60 * 1000); // refresh expiry

    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    console.error("UPDATE DRAFT ERROR:", error);
    res.status(500).json({ success: false, message: error });
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

    if (booking.status !== "draft" && booking.status !== "payment_pending") {
      res.status(400).json({
        success: false,
        message: "Booking is not in draft state (maybe expired or cancelled)",
      });
      return;
    }

    // Verify Expiry
    if (booking.expiresAt && new Date() > booking.expiresAt) {
      booking.status = "expired";
      await booking.save();
      res
        .status(400)
        .json({ success: false, message: "Booking draft expired" });
      return;
    }

    // 3. FINALIZE (Move to Pending directly based on new flow)
    booking.status = "pending";
    booking.paymentStatus = "paid";
    booking.transactionId = paymentId;
    booking.expiresAt = undefined; // Remove expiry
    await booking.save();

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
    const { carId, startDate, endDate, startTime, endTime } = req.body;
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (startTime) {
      const [h, m] = startTime.split(":").map(Number);
      start.setHours(h, m, 0, 0);
    }

    if (endTime) {
      const [h, m] = endTime.split(":").map(Number);
      end.setHours(h, m, 0, 0);
    } else if (!startTime && !endTime) {
      end.setHours(23, 59, 59, 999);
    }

    const now = new Date();

    const conflictingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ["confirmed", "completed"] },
      // Overlap Logic: (StartA < EndB) and (EndA > StartB)
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

    const authReq = req as AuthenticatedRequest;
    if (status === "confirmed" && authReq.user) {
      const existingBooking = await Booking.findById(bookingId);
      if (
        existingBooking &&
        existingBooking.user.toString() === authReq.user._id.toString()
      ) {
        res.status(403).json({
          success: false,
          message: "Users cannot confirm their own booking",
        });
        return;
      }
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
    const car = await Car.findById(booking.car);
    if (user && user.email && status === "confirmed") {
      await EmailService.sendBookingConfirmation(user.email, {
        bookingId: booking._id.toString(),
        carName: car ? `${car.brand} ${car.model}` : "Your Car",
        startDate: booking.startDate.toLocaleDateString(),
        endDate: booking.endDate.toLocaleDateString(),
        totalPrice: booking.totalPrice.toLocaleString(),
      });
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
    // 1. Confirmed, Completed
    const bookings = await Booking.find({
      car: carId,
      status: { $in: ["confirmed", "completed"] },
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

    const authReq = req as AuthenticatedRequest;
    if (
      authReq.user &&
      booking.user._id.toString() === authReq.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Users cannot confirm their own booking",
      });
    }

    if (booking.status !== "payment_pending" && booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Only pending bookings can be approved",
      });
    }

    booking.status = "confirmed";
    await booking.save();

    // NOTIFICATIONS
    const user: any = booking.user;
    const car = await Car.findById(booking.car);

    if (user.email) {
      await EmailService.sendBookingConfirmation(user.email, {
        bookingId: booking._id.toString(),
        carName: car ? `${car.brand} ${car.model}` : "Your Car",
        startDate: booking.startDate.toLocaleDateString(),
        endDate: booking.endDate.toLocaleDateString(),
        totalPrice: booking.totalPrice.toLocaleString(),
      });
    }

    if (user.phone) {
      await SmsService.sendMockNotification(
        user.phone,
        "Your booking has been confirmed. We look forward to serving you.",
      );
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const rejectBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId, reason } = req.body;
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

    if (
      booking.status !== "payment_pending" &&
      booking.status !== "pending" &&
      booking.status !== "confirmed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Only pending or confirmed bookings can be rejected",
      });
    }

    booking.status = "rejected";
    // Optional: If paid, move to refunded or handle paymentStatus
    if (booking.paymentStatus === "paid") {
      booking.paymentStatus = "refunded";
    }
    await booking.save();

    // Send rejection email
    const user: any = booking.user;
    const car = await Car.findById(booking.car);
    if (user?.email) {
      await EmailService.sendBookingRejection(user.email, {
        bookingId: booking._id.toString(),
        carName: car ? `${car.brand} ${car.model}` : "Your Car",
        reason,
      });
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const completeBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("car");

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
        message: "Only confirmed bookings can be finished",
      });
    }

    // Guard: Trip can only be finished after rental start time
    if (new Date() < new Date(booking.startDate)) {
      return res.status(400).json({
        success: false,
        message: "Cannot finish trip before the rental start date",
      });
    }

    // Calculate remaining payment
    const rentalTotal = booking.totalPrice;
    const driverFee = booking.driverFee || 0;
    const depositPaid = booking.depositAmount || 0;
    const remainingPayment = rentalTotal + driverFee - depositPaid;

    // If no remaining payment, complete immediately
    if (remainingPayment <= 0) {
      booking.status = "completed";
      booking.finalPaymentStatus = "paid";
      await booking.save();
      return res.status(200).json({
        success: true,
        data: booking,
        breakdown: {
          rentalTotal,
          driverFee,
          depositPaid,
          remainingPayment: 0,
        },
      });
    }

    // Return breakdown for frontend to show payment UI
    res.status(200).json({
      success: true,
      data: booking,
      requiresPayment: true,
      breakdown: {
        rentalTotal,
        driverFee,
        depositPaid,
        remainingPayment,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

/**
 * @desc    Confirm final payment after trip and mark booking as completed
 * @route   POST /api/bookings/finish-payment
 */
export const finishTripPayment = async (req: Request, res: Response) => {
  try {
    const { bookingId, paymentId } = req.body;

    if (!bookingId || !paymentId) {
      return res.status(400).json({
        success: false,
        message: "Missing bookingId or paymentId",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({
        success: false,
        message: "Booking is not in a finishable state",
      });
    }

    booking.status = "completed";
    booking.finalTransactionId = paymentId;
    booking.finalPaymentStatus = "paid";
    await booking.save();

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

/**
 * @desc    Cancel a booking (user action)
 * @route   POST /api/bookings/cancel
 */
export const cancelBooking = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { bookingId } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const booking = await Booking.findById(bookingId).populate("user");

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    // Must be the user who created it
    if (booking.user._id.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({
          success: false,
          message: "You can only cancel your own bookings",
        });
    }

    if (booking.status === "cancelled" || booking.status === "rejected") {
      return res
        .status(400)
        .json({
          success: false,
          message: "Booking is already cancelled or rejected",
        });
    }

    if (booking.status === "completed") {
      return res
        .status(400)
        .json({ success: false, message: "Booking is already completed" });
    }

    // 24 Hour check
    const now = new Date();
    const startDate = new Date(booking.startDate);

    // Calculate the difference in milliseconds
    const timeDiffMs = startDate.getTime() - now.getTime();

    // Convert to hours
    const hoursDifference = timeDiffMs / (1000 * 60 * 60);

    if (hoursDifference < 24) {
      return res.status(400).json({
        success: false,
        message:
          "You can only cancel a booking if it is at least 24 hours before the rental start time.",
      });
    }

    booking.status = "cancelled";

    if (booking.paymentStatus === "paid") {
      booking.paymentStatus = "refunded";
    }

    await booking.save();

    res
      .status(200)
      .json({
        success: true,
        data: booking,
        message: "Booking cancelled successfully",
      });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
