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
    // Robustly inject the database name using the URL parser to avoid "//" issues
    const parsedUri = new URL(uri);
    // If no specific DB is targeted, set it to car-rental
    if (parsedUri.pathname === "/" || parsedUri.pathname === "") {
      parsedUri.pathname = "/car-rental";
    }
    const uriWithDb = parsedUri.toString();

    const clientOptions = {
      serverApi: { version: '1' as const, strict: true, deprecationErrors: true }
    };

    cached = mongoose.connect(uriWithDb, clientOptions);
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
