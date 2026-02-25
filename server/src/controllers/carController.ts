import { Request, Response } from "express";
import Car, { ICar } from "../models/Car";
import mongoose from "mongoose";
import { deleteFromImageKit, uploadToImageKit } from "../utils/imageUpload";
import { AuthenticatedRequest } from "../types";

export const getCars = async (req: Request, res: Response) => {
  try {
    const {
      brand,
      model,
      transmission,
      fuel_type,
      is_available,
      page = "1",
      limit = "10",
    } = req.query;

    const filter: any = {};

    if (brand) filter.brand = brand;
    if (model) filter.model = model;
    if (transmission) filter.transmission = transmission;
    if (fuel_type) filter.fuel_type = fuel_type;
    if (is_available !== undefined)
      filter.is_available = is_available === "true";

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const cars = await Car.find(filter)
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    res.status(200).json({
      success: true,
      data: cars,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : error,
    });
  }
};

export const getCarById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);
    if (!car) {
      res.status(404).json({ success: false, message: "Car not found" });
      return;
    }
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const createCar = async (req: Request, res: Response) => {
  try {
    const { brand, model, price_per_day, type } = req.body;

    if (!brand || !model || !price_per_day || !type) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: brand, model, price_per_day, and type are required.",
      });
      return;
    }

    const carData = {
      ...req.body,
      is_available: req.body.is_available ?? true,
      year: req.body.year
        ? parseInt(req.body.year.toString())
        : new Date().getFullYear(),
    };

    const car = await Car.create(carData);
    res.status(201).json({ success: true, data: car });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};

export const updateCar = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const carId = req.params.id;

    if (!carId || !mongoose.Types.ObjectId.isValid(carId)) {
      return res.status(400).json({ success: false, message: "Invalid carId" });
    }

    const car = await Car.findOne({ _id: carId, ownerId: userId });
    if (!car) {
      return res
        .status(404)
        .json({ success: false, message: "Car not found or unauthorized" });
    }

    const files = req.files as {
      thumbnail?: Express.Multer.File[];
      images?: Express.Multer.File[];
    };

    if (files?.thumbnail?.[0]) {
      if (car.thumbnail?.fileId) {
        await deleteFromImageKit(car.thumbnail.fileId);
      }
      const newThumbnail = await uploadToImageKit(
        files.thumbnail[0],
        "/cars/thumbnail",
      );
      car.thumbnail = { url: newThumbnail.url, fileId: newThumbnail.fileId };
    }

    // 2️⃣ Gallery images update
    if (files?.images?.length) {
      const newImages = await Promise.all(
        files.images.map((file) => uploadToImageKit(file, "/cars/gallery")),
      );
      // append new images
      car.images = [...(car.images || []), ...newImages];
    }

    // 3️⃣ Update other car data
    const updateFields: Partial<ICar> = req.body.carData
      ? JSON.parse(req.body.carData)
      : req.body;

    for (const key in updateFields) {
      if (Object.prototype.hasOwnProperty.call(updateFields, key)) {
        const k = key as keyof ICar; // 🔹 type-safe index
        if (k !== "thumbnail" && k !== "images") {
          (car[k] as any) = updateFields[k]; // TS-д cast хэрэгтэй
        }
      }
    }

    // Increment version to avoid Mongoose VersionError on array mutations
    car.increment();
    await car.save();

    res
      .status(200)
      .json({ success: true, message: "Car updated successfully", car });
  } catch (error: any) {
    console.error("UPDATE CAR ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const deleteCar = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await Car.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Car deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
};
