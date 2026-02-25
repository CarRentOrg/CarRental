import mongoose from "mongoose";
import dotenv from "dotenv";
import colors from "colors";
import User from "../models/User";
import Car from "../models/Car";
import Booking from "../models/Booking";
import bcrypt from "bcrypt";

dotenv.config({ path: "./.env" });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "");
    console.log((colors as any).green.inverse("MongoDB Connected..."));

    // Clear existing data
    await User.deleteMany();
    await Car.deleteMany();
    await Booking.deleteMany();
    console.log((colors as any).red.inverse("Data Destroyed..."));

    // Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    const adminUser = await User.create({
      name: "Admin User",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
    });

    const ownerUser = await User.create({
      name: "Owner User",
      email: "owner@example.com",
      password: hashedPassword,
      role: "owner",
    });

    const normalUser = await User.create({
      name: "John Doe",
      email: "john@example.com",
      password: hashedPassword,
      role: "user",
    });

    console.log((colors as any).green.inverse("Users Created..."));

    // Cars
    const carsData: any[] = [
      {
        name: "Tesla Model S",
        brand: "Tesla",
        model: "Model S",
        year: 2023,
        type: "Sedan",
        transmission: "automatic",
        fuelType: "electric",
        seats: 5,
        pricePerDay: 150,
        available: true,
        images: [
          "https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        ],
        description: "Luxury electric sedan with autopilot.",
        ownerId: ownerUser._id,
      },
      {
        name: "BMW X5",
        brand: "BMW",
        model: "X5",
        year: 2022,
        type: "SUV",
        transmission: "automatic",
        fuelType: "petrol",
        seats: 5,
        pricePerDay: 120,
        available: true,
        images: [
          "https://images.unsplash.com/photo-1555215695-3004980adade?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        ],
        description: "Premium SUV for comfort and style.",
        ownerId: ownerUser._id,
      },
      {
        name: "Toyota Camry",
        brand: "Toyota",
        model: "Camry",
        year: 2021,
        type: "Sedan",
        transmission: "automatic",
        fuelType: "hybrid",
        seats: 5,
        pricePerDay: 60,
        available: true,
        images: [
          "https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
        ],
        description: "Reliable and fuel-efficient sedan.",
        ownerId: ownerUser._id,
      },
    ];

    const cars = await Car.create(carsData);

    console.log((colors as any).green.inverse("Cars Created..."));

    // Bookings
    await Booking.create([
      {
        user: normalUser._id,
        car: cars[0]._id,
        ownerId: ownerUser._id, // Added ownerId
        startDate: new Date(),
        endDate: new Date(new Date().setDate(new Date().getDate() + 3)),
        totalPrice: 450,
        status: "confirmed",
        paymentStatus: "paid",
      },
      {
        user: normalUser._id,
        car: cars[1]._id,
        ownerId: ownerUser._id, // Added ownerId
        startDate: new Date(new Date().setDate(new Date().getDate() + 5)),
        endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
        totalPrice: 240,
        status: "pending",
        paymentStatus: "pending",
      },
    ]);

    console.log((colors as any).green.inverse("Bookings Created..."));

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();
