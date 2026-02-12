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

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Important for credentials (cookies)
    credentials: true,
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser()); // Parse cookies

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello Express Server");
});

app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/owner", ownerRoutes);
app.use("/api/payment", paymentRoutes);

// Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(
      (colors as any).rainbow(`Server started at http://localhost:${PORT}`),
    );

    // Connect to MongoDB
    await connectDB();
  });
}

export default app;
