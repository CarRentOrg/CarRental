import mongoose from "mongoose";
import path from "path";
import dotenv from "dotenv";
import Car from "../models/Car";
import { getNextCarId } from "../utils/carIdGenerator";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

/**
 * Migration script: assigns a sequential `carId` to every car that doesn't
 * already have one. Cars are processed in `createdAt` order so the oldest car
 * gets the lowest ID.
 *
 * Usage:
 *   npx ts-node src/scripts/migrateCarIds.ts
 */
async function migrate() {
  try {
    const uri = process.env.MONGODB_URL;
    if (!uri) {
      throw new Error("MONGODB_URL environment variable is not set.");
    }

    await mongoose.connect(`${uri}/car-rental`);
    console.log("✅ Connected to MongoDB");

    const carsWithoutId = await Car.find({
      $or: [{ carId: { $exists: false } }, { carId: null }, { carId: "" }],
    }).sort({ createdAt: 1 });

    console.log(`📦 Found ${carsWithoutId.length} car(s) without carId`);

    for (const car of carsWithoutId) {
      const carId = await getNextCarId();
      car.carId = carId;
      await car.save();
      console.log(
        `   → ${car.name || car.brand + " " + car.model} → carId: ${carId}`,
      );
    }

    console.log("🎉 Migration complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
}

migrate();
