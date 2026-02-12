import mongoose, { Document, Schema } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Types.ObjectId;
  car: mongoose.Types.ObjectId;
  car_id: string;
  userSnapshot: {
    name: string;
    email: string;
  };
  startDate: Date;
  endDate: Date;
  totalPrice: number;
  note?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "locked";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  rateApplied?: "daily" | "weekly" | "monthly";
  transactionId?: string;
  expiresAt?: Date;
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
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      // 'locked' = reserved for short time while paying
      enum: ["pending", "confirmed", "cancelled", "completed", "locked"],
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
      // TTL Index: Specific method to auto-delete documents that have expired
      // But we only want to expire 'locked' ones.
      // MongoDB TTL removes docs where field > now.
      // We will set this field ONLY for 'locked' bookings.
      index: { expireAfterSeconds: 0 },
    },
    car_id: {
      type: String,
    },
    rateApplied: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
    },
  },
  {
    timestamps: true,
  },
);

// Index for finding overlaps quickly including locked ones
bookingSchema.index({ car: 1, status: 1, startDate: 1, endDate: 1 });

export default mongoose.model<IBooking>("Booking", bookingSchema);
