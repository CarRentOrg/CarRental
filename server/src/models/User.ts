import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  [x: string]: any;
  email: string;
  password?: string;
  name: string;
  role: "user" | "owner";
  image?: string;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false, // Optional for OAuth, but required for local auth (handled in controller)
    },
    name: {
      type: String,
      required: true,
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
