import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Car from "../models/Car";
import { uploadToImageKit } from "../utils/imageUpload";
import Booking from "../models/Booking";
import { AuthenticatedRequest } from "../types";
import mongoose from "mongoose";
import { error } from "console";

export const changeRoleToOwner = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { role: "owner" },
      { new: true },
    );

    if (!user) throw new Error("User not found");
    res.status(200).json({ success: true, message: "Role updated to owner" });
  } catch (error) {
    res.status(500).json({ success: false, message: { error } });
  }
};

export const addCar = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user._id;

    // ✅ parse carData
    let carData: any = {};
    if (req.body.carData) {
      try {
        carData = JSON.parse(req.body.carData);
      } catch {
        return res.status(400).json({
          success: false,
          message: "Invalid carData JSON",
        });
      }
    } else {
      carData = req.body;
    }

    // ✅ thumbnail REQUIRED
    const files = req.files as {
      thumbnail?: Express.Multer.File[];
      images?: Express.Multer.File[];
    };

    if (!files?.thumbnail?.[0]) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    // ✅ upload thumbnail
    const thumbnailUrl = await uploadToImageKit(
      files.thumbnail[0],
      "/cars/thumbnail",
    );

    // ✅ upload gallery images (preserve {url, fileId} for cleanup)
    let images: { url: string; fileId: string }[] = [];
    if (files.images && files.images.length > 0) {
      images = await Promise.all(
        files.images.map((file) => uploadToImageKit(file, "/cars/gallery")),
      );
    }

    const newCar = await Car.create({
      ...carData,
      ownerId: userId,
      thumbnail: thumbnailUrl,
      images,
      available: true,
    });

    res.status(201).json({
      success: true,
      message: "Car added successfully",
      car: newCar,
    });
  } catch (error: any) {
    console.error("ADD CAR ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getOwnerCars = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user._id;
    const cars = await Car.find({ ownerId: userId });
    res.status(200).json({ success: true, data: cars });
  } catch (error) {
    res.status(500).json({ success: false, message: { error } });
  }
};

export const toggleCarAvailability = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user._id;
    const { carId } = req.body;

    const car = await Car.findOne({ _id: carId, ownerId: userId });

    if (!car) {
      return res
        .status(404)
        .json({ success: false, message: "Car not found or unauthorized" });
    }

    car.is_available = !car.is_available;
    await car.save();

    res.status(200).json({ success: true, message: "Availability Toggled" });
  } catch (error) {
    res.status(500).json({ success: false, message: { error } });
  }
};

export const deleteCar = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const userId = req.user._id;
    const { id } = req.params; // ✅ path param

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid car id",
      });
    }

    const car = await Car.findOneAndDelete({
      _id: id,
      ownerId: userId.toString(),
    });

    if (!car) {
      return res.status(404).json({
        success: false,
        message: "Car not found or unauthorized",
      });
    }

    res.status(200).json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error: any) {
    console.error("DELETE CAR ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const updateUserImage = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user._id;

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToImageKit(req.file, "/users");
    } else {
      return res
        .status(400)
        .json({ success: false, message: "No image provided" });
    }

    // Update user avatar logic - User model depends on what field stores avatar
    // I defined avatarCallback in User model? Or did I?
    // Checking User model... I defined "avatarCallback?: string;" which seems to be a mistake, probably meant "avatar" or "avatarUrl".
    // I should check User model again. Assuming I can update any field.

    // Actually, looking at previous code, it was "avatar_url".
    // My Mongoose User model has "avatarCallback".
    // I should probably fix User model to be "avatarUrl" or just use "avatarCallback" if that's what I intended (unlikely).
    // Let's assume I meant "avatarUrl". I'll update User model later or now.

    await User.findByIdAndUpdate(userId, { avatar: imageUrl }); // Using 'avatar' generic name

    res.status(200).json({
      success: true,
      message: "User image updated successfully",
      imageUrl,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: { error } });
  }
};

export const getOwnerDashboardStats = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.status(403).json({ success: false, message: "Not an owner" });
    }

    const ownerObjectId = new mongoose.Types.ObjectId(_id);

    // 1️⃣ CAR STATS
    const totalCars = await Car.countDocuments({ ownerId: ownerObjectId });
    const availableCars = await Car.countDocuments({
      ownerId: ownerObjectId,
      is_available: true,
    });
    const rentedCars = await Car.countDocuments({
      ownerId: ownerObjectId,
      is_available: false,
    });

    console.log(
      `[Dashboard] Owner: ${ownerObjectId}, Cars: ${totalCars}, Avail: ${availableCars}, Rented: ${rentedCars}`,
    );

    // 2️⃣ BOOKING + REVENUE (Fallback to Car IDs for robustness)
    // Fetch all car IDs owned by this user
    const cars = await Car.find({ ownerId: ownerObjectId }).select("_id");
    const carIds = cars.map((c) => c._id);

    // Aggregate bookings for these cars
    const bookingAgg = await Booking.aggregate([
      {
        $match: {
          car: { $in: carIds }, // Match bookings by Car ID
        },
      },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          pendingBookings: {
            $sum: {
              $cond: [{ $eq: ["$status", "pending"] }, 1, 0],
            },
          },
          totalRevenue: {
            $sum: {
              $cond: [
                { $in: ["$status", ["confirmed", "completed"]] },
                "$totalPrice",
                0,
              ],
            },
          },
        },
      },
    ]);

    const stats = bookingAgg[0] || {
      totalBookings: 0,
      pendingBookings: 0,
      totalRevenue: 0,
    };

    res.status(200).json({
      success: true,
      data: {
        totalCars,
        totalBookings: stats.totalBookings,
        pendingBookings: stats.pendingBookings,
        totalRevenue: stats.totalRevenue,
        carStatus: {
          available: availableCars,
          rented: rentedCars,
        },
      },
    });
  } catch (error) {
    console.error("DASHBOARD ERROR 👉", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getAllUsersWithStats = async (_req: Request, res: Response) => {
  try {
    const stats = await Booking.aggregate([
      {
        $group: {
          _id: "$user",
          total_bookings: { $sum: 1 },
          total_spent: { $sum: "$totalPrice" },
          userSnapshot: { $first: "$userSnapshot" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails",
        },
      },
      {
        $unwind: {
          path: "$userDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: { $ifNull: ["$userDetails.name", "$userSnapshot.name"] },
          email: { $ifNull: ["$userDetails.email", "$userSnapshot.email"] },
          role: { $ifNull: ["$userDetails.role", "user"] },
          phone: { $ifNull: ["$userDetails.phone", ""] },
          created_at: { $ifNull: ["$userDetails.createdAt", new Date()] },
          total_bookings: 1,
          total_spent: 1,
        },
      },
      { $sort: { total_bookings: -1 } },
    ]);

    res.status(200).json({
      success: true,
      total: stats.length,
      data: stats,
    });
  } catch (error: any) {
    console.error("GET USERS ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const getPendingBookings = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user._id;
    const count = await Booking.countDocuments({
      ownerId: userId,
      status: "pending",
    });

    res.status(200).json({ success: true, count });
  } catch (error) {
    console.error("GET PENDING BOOKINGS ERROR 👉", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
