import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  [x: string]: any;
  email?: string;
  password?: string;
  phone?: string;
  name?: string;
  role: "user" | "owner";
  image?: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: false,
      sparse: true, // Allows multiple null/empty values while still being unique for non-null values
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
      sparse: true,
      unique: true,
    },
    name: {
      type: String,
      required: false, // Name might not be known during first OTP booking
    },
    role: {
      type: String,
      enum: ["user", "owner"],
      default: "user",
    },
    image: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

import bcrypt from "bcrypt";
userSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model<IUser>("User", userSchema);
