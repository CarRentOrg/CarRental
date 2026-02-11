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
  status: "pending" | "confirmed" | "cancelled";
  paymentStatus: "pending" | "paid" | "failed";
  rateApplied?: "daily" | "weekly" | "monthly";
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
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
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

export default mongoose.model<IBooking>("Booking", bookingSchema);
