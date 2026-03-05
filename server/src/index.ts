import express, { Request, Response } from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

// Config must load before other imports if they rely on env vars immediately
dotenv.config();

import bookingRoutes from "./routes/bookingRoutes";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import ownerRoutes from "./routes/ownerRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import { errorHandler } from "./middlewares/errorHandler";
import connectDB from "./config/db";

const app = express();
const PORT = process.env.PORT || 3001;

// ---------------------------------------------------------------------------
// CORS — allow localhost in dev and the production Vercel URL in production.
// Set NEXT_PUBLIC_CLIENT_URL in your Vercel environment variables to your
// frontend deployment URL, e.g. https://car-rental.vercel.app
// ---------------------------------------------------------------------------
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://car-rental-client-6khh.vercel.app",
  "https://car-rental-client.vercel.app",
  ...(process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`CORS: origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());

// ---------------------------------------------------------------------------
// Connect to DB via middleware so it's guaranteed to be established BEFORE
// any route handler runs in serverless mode.
// ---------------------------------------------------------------------------
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("MongoDB connection failed in middleware:", error);
    next(error); // Passes the error to the errorHandler middleware
  }
});

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Car Rental API is running.");
});

// Health check — useful for verifying Vercel env vars and DB connectivity
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    env: {
      MONGODB_URL: !!process.env.MONGODB_URL,
      JWT_SECRET: !!process.env.JWT_SECRET,
      IMAGEKIT_PRIVATE_KEY: !!process.env.IMAGEKIT_PRIVATE_KEY,
      IMAGEKIT_PUBLIC_KEY: !!process.env.IMAGEKIT_PUBLIC_KEY,
      CLIENT_URL: process.env.CLIENT_URL || "(not set)",
      NODE_ENV: process.env.NODE_ENV || "(not set)",
      VERCEL: !!process.env.VERCEL,
    },
  });
});

app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/payment", paymentRoutes);

// Error Handler
app.use(errorHandler);

// ---------------------------------------------------------------------------
// Start a persistent server only in local development.
// On Vercel (serverless), the exported `app` is used directly.
// ---------------------------------------------------------------------------
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(
      (colors as any).rainbow(`Server started at http://localhost:${PORT}`),
    );
  });
}

export default app;
