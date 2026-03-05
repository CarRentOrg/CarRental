import mongoose from "mongoose";
import colors from "colors";

// Cache the connection across serverless warm invocations
let cached = (global as any).__mongooseConn as
  | Promise<typeof mongoose>
  | undefined;

const connectDB = async (): Promise<void> => {
  if (cached) {
    await cached;
    return;
  }

  const uri = process.env.MONGODB_URL;

  if (!uri) {
    throw new Error(
      "MONGODB_URL environment variable is not set. " +
      "Add it in your Vercel project → Settings → Environment Variables.",
    );
  }

  try {
    // Insert the database name before any query string parameters.
    // e.g. "mongodb+srv://host/?appName=X" → "mongodb+srv://host/car-rental?appName=X"
    const uriWithDb = uri.includes("?")
      ? uri.replace("?", "/car-rental?")
      : `${uri}/car-rental`;

    cached = mongoose.connect(uriWithDb);
    (global as any).__mongooseConn = cached;

    const conn = await cached;
    console.log(
      (colors as any).cyan.underline(
        `MongoDB Connected: ${conn.connection.host}`,
      ),
    );
  } catch (error: any) {
    cached = undefined;
    (global as any).__mongooseConn = undefined;
    // Log but do NOT call process.exit() — that kills the serverless container
    console.error((colors as any).red.bold(`MongoDB Error: ${error.message}`));
    throw error;
  }
};

export default connectDB;
