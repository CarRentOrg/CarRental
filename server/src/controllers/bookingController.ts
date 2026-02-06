import { Request, Response, NextFunction } from "express";
import Booking from "../models/Booking";
import { AuthenticatedRequest } from "../types";
import mongoose from "mongoose";

export const getBookings = async (req: Request, res: Response) => {
  try {
    const { status, car_id, page, limit } = req.query;
    const bookings = await Booking.find({
      status: status as string,
      car_id: car_id as string,
    });
    res.status(200).json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: { error } });
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

export const createBooking = async (req: Request, res: Response) => {
  try {
    const { car_id, start_date, end_date } = req.body;
    if (!car_id || !start_date || !end_date) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: car_id, start_date, and end_date are required.",
      });
      return;
    }
    const booking = await Booking.create(req.body);
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

export const getOwnerBookingUsers = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const ownerId = req.user._id;

    const users = await Booking.aggregate([
      {
        $match: { ownerId },
      },
      {
        $group: {
          _id: "$userId",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: "$user._id",
          name: "$user.name",
          email: "$user.email",
          createdAt: "$user.createdAt",
        },
      },
    ]);

    res.status(200).json({
      success: true,
      totalUsers: users.length,
      users,
    });
  } catch (error) {
    console.error("GET OWNER BOOKING USERS ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
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

    const bookings = await Booking.find()
      .populate({
        path: "car",
        select: "name brand model thumbnail ownerId price_per_day",
        match: { ownerId },
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    const ownerBookings = bookings.filter((b) => b.car !== null);

    res.status(200).json({
      success: true,
      total: ownerBookings.length,
      bookings: ownerBookings,
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
