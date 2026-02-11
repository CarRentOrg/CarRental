import mongoose, { Document, Schema } from "mongoose";

export interface IOTP extends Document {
  identifier: string; // email or phone
  code: string;
  expiresAt: Date;
}

const otpSchema = new Schema<IOTP>(
  {
    identifier: {
      type: String,
      required: true,
      index: true,
    },
    code: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index: document will be deleted at expiresAt
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IOTP>("OTP", otpSchema);
