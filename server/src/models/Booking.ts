import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
  car_id: string;
  ownerId: mongoose.Types.ObjectId;
  userSnapshot: {
    name: string;
    email: string;
  };
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  note?: string;
  status:
    | "draft"
    | "pending"
    | "payment_pending"
    | "confirmed"
    | "rejected"
    | "cancelled"
    | "completed"
    | "expired";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  rateApplied?: "daily" | "weekly" | "monthly";
  transactionId?: string;
  expiresAt?: Date;
  startTime?: string;
  endTime?: string;
  // Payment: Deposit + Driver
  withDriver: boolean;
  driverFee: number;
  depositAmount: number;
  depositTransactionId?: string;
  finalTransactionId?: string;
  finalPaymentStatus?: "pending" | "paid";
}

const bookingSchema = new Schema<IBooking>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car: {
      type: Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userSnapshot: {
      name: String,
      email: String,
    },

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
    startTime: {
      type: String,
      required: false,
    },
    endTime: {
      type: String,
      required: false,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending",
        "payment_pending",
        "confirmed",
        "rejected",
        "cancelled",
        "completed",
        "expired",
      ],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      required: false,
    },
    expiresAt: {
      type: Date,
      // Standard date field for tracking expiry. No TTL index to avoid unpredictable deletion.
      // We will handle expiry via cron or lazy evaluation.
    },
    car_id: {
      type: String,
    },
    rateApplied: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
    },
    // ── Payment: Deposit + Driver ──
    withDriver: { type: Boolean, default: false },
    driverFee: { type: Number, default: 0 },
    depositAmount: { type: Number, default: 0 },
    depositTransactionId: { type: String },
    finalTransactionId: { type: String },
    finalPaymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  },
);

// Index for finding overlaps quickly including locked ones
bookingSchema.index({ car: 1, status: 1, startDate: 1, endDate: 1 });

// Scalability Indexes
bookingSchema.index({ ownerId: 1, status: 1 }); // Dashboard stats
bookingSchema.index({ ownerId: 1, createdAt: -1 }); // Recent bookings list

export default mongoose.model<IBooking>("Booking", bookingSchema);
