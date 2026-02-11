import { Request, Response, NextFunction } from "express";
import Booking from "../models/Booking";
import Car from "../models/Car";
import { AuthenticatedRequest } from "../types";
import mongoose from "mongoose";

interface BookingRequest {
  carId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  note?: string;
}
export const getBookings = async (req: Request, res: Response) => {
  try {
    const { status, car_id } = req.query;

    // Build dynamic filter
    const filter: any = {};
    if (status) filter.status = status;
    if (car_id) filter.car_id = car_id;

    const bookings = await Booking.find(filter);

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const getMyBookings = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const bookings = await Booking.find({ user: user._id })
      .populate("car")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);
    if (!booking) {
      res.status(404).json({ success: false, message: "Booking not found" });
      return;
    }
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: { error } });
  }
};

export const createBooking = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const user = req.user;
    if (!user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const { carId, startDate, endDate, totalPrice, note }: BookingRequest =
      req.body;

    if (!carId || !startDate || !endDate) {
      res.status(400).json({
        success: false,
        message: "Missing required fields: carId, startDate, endDate.",
      });
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({
        success: false,
        message: "Invalid date format.",
      });
      return;
    }

    if (start >= end) {
      res.status(400).json({
        success: false,
        message: "End date must be after start date.",
      });
      return;
    }

    // Check availability
    const conflictingBooking = await Booking.findOne({
      car: carId,
      status: { $in: ["confirmed", "pending"] },
      $or: [{ startDate: { $lt: end }, endDate: { $gt: start } }],
    });

    if (conflictingBooking) {
      res.status(400).json({
        success: false,
        message: "Car is not available for the selected dates.",
      });
      return;
    }

    const booking = await Booking.create({
      car: carId, // Use 'car' as per schema
      car_id: carId, // Keep 'car_id' for string reference if needed by other logical parts, though schema has 'car_id' too.
      startDate: start,
      endDate: end,
      totalPrice,
      note,
      user: user._id,
      status: "pending",
      userSnapshot: {
        name: user.name,
        email: user.email,
      },
    });

    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: { error } });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (Object.keys(req.body).length === 0) {
      res
        .status(400)
        .json({ success: false, message: "No update data provided." });
      return;
    }
    const booking = await Booking.findByIdAndUpdate(id, req.body);
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: { error } });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Booking.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Booking deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: { error } });
  }
};

export const checkAvailabilityofCar = async (req: Request, res: Response) => {
  try {
    const { carId, startDate, endDate } = req.body;
    // Logic to check if car is available in these dates
    res.status(200).json({ success: true, available: true });
  } catch (error) {
    res.status(500).json({ success: false, message: { error } });
  }
};

export const getOwnerCustomers = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const ownerId = new mongoose.Types.ObjectId(req.user._id);

    const customers = await Booking.aggregate([
      // 1️⃣ car → owner
      {
        $lookup: {
          from: "cars",
          localField: "car",
          foreignField: "_id",
          as: "car",
        },
      },
      { $unwind: "$car" },
      {
        $match: {
          "car.owner": ownerId,
        },
      },

      // 2️⃣ group by user
      {
        $group: {
          _id: "$user",
          total_bookings: { $sum: 1 },
          total_spent: { $sum: "$totalPrice" },
          userSnapshot: { $first: "$userSnapshot" },
        },
      },

      // 3️⃣ lookup users collection (optional)
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true,
        },
      },

      // 4️⃣ final shape (snapshot fallback)
      {
        $project: {
          id: "$_id",

          full_name: {
            $ifNull: ["$user.full_name", "$userSnapshot.name"],
          },
          email: {
            $ifNull: ["$user.email", "$userSnapshot.email"],
          },
          phone: "$user.phone",
          role: { $ifNull: ["$user.role", "customer"] },
          avatar_url: "$user.avatar_url",
          created_at: "$user.created_at",

          total_bookings: 1,
          total_spent: 1,
        },
      },
    ]);

    res.json({
      success: true,
      total: customers.length,
      data: customers,
    });
  } catch (err) {
    console.error("GET OWNER CUSTOMERS ERROR 👉", err);
    res.status(500).json({ success: false });
  }
};

export const getAllOwnerBookings = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized, no user",
      });
    }

    const ownerId = req.user._id;

    // 1. Find all cars owned by this user
    const ownerCars = await Car.find({ ownerId });
    const carIds = ownerCars.map((c) => c._id);

    // 2. Find all bookings for these cars
    const ownerBookings = await Booking.find({ car: { $in: carIds } })
      .populate({
        path: "car",
        select:
          "name brand model thumbnail images ownerId price_per_day price_rates",
      })
      .populate("user", "name email phone")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: ownerBookings.length,
      data: ownerBookings,
    });
  } catch (error: any) {
    console.error("GET ALL BOOKINGS ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const changeBookingStatus = async (req: Request, res: Response) => {
  try {
    const { bookingId, status } = req.body;
    const booking = await Booking.findByIdAndUpdate(bookingId, { status });
    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: { error } });
  }
};
