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
// Connect to DB on module load so the connection is established even in
// serverless mode (where app.listen() is never called).
// ---------------------------------------------------------------------------
connectDB();

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Car Rental API is running.");
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
