import express, { Request, Response } from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import bookingRoutes from "./routes/bookingRoutes";
// import statsRoutes from './routes/statsRoutes';
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes";
import ownerRoutes from "./routes/ownerRoutes";
import { errorHandler } from "./middlewares/errorHandler";

import connectDB from "./config/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.send("Hello Express Server");
});

app.use("/api/bookings", bookingRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/owner", ownerRoutes);

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
