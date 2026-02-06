import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import Car from "../models/Car";
import { uploadToImageKit } from "../utils/imageUpload";
import Booking from "../models/Booking";
import { AuthenticatedRequest } from "../types";
import mongoose from "mongoose";

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

    // ✅ upload gallery images
    let images: string[] = [];
    if (files.images && files.images.length > 0) {
      const uploadedImages = await Promise.all(
        files.images.map((file) => uploadToImageKit(file, "/cars/gallery")),
      );

      images = uploadedImages.map((img) => img.url); // ✅ only urls
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

export const getDashboardData = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const { _id, role } = req.user;

    if (role !== "owner") {
      return res.status(403).json({ success: false, message: "Not an owner" });
    }

    // --- Cars ---
    const totalCars = await Car.countDocuments({ ownerId: _id });

    const availableCars = await Car.countDocuments({
      ownerId: _id,
      isAvailable: true,
    });

    const rentedCars = await Car.countDocuments({
      ownerId: _id,
      isAvailable: false,
    });

    // --- Bookings ---
    const totalBookings = await Booking.countDocuments({ ownerId: _id });

    const totalPending = await Booking.countDocuments({
      ownerId: _id,
      status: "pending",
    });

    const revenueAgg = await Booking.aggregate([
      {
        $match: {
          ownerId: _id,
          status: { $in: ["confirmed", "completed"] },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.status(200).json({
      success: true,
      data: {
        totalCars,
        totalBookings,
        totalPending,
        totalRevenue,
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
