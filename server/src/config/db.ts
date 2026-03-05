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

  // If already connected, do not create a new connection
  if (mongoose.connection.readyState === 1) {
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
    // Clean the URI (trim spaces and remove quotes if present)
    const cleanUri = uri.trim().replace(/^["']|["']$/g, "");

    let uriWithDb = cleanUri;

    // Inject database name only if no path exists in the URL
    // Standard Atlas URI: mongodb+srv://host[:port]/?options
    // We look for a "/" that isn't part of "mongodb+srv://" and see if it has content after it
    const hasExistingDb = /\/[^/?]/.test(cleanUri.replace("mongodb+srv://", ""));

    if (!hasExistingDb) {
      if (cleanUri.includes("?")) {
        const [base, query] = cleanUri.split("?");
        const separator = base.endsWith("/") ? "" : "/";
        uriWithDb = `${base}${separator}car-rental?${query}`;
      } else {
        const separator = cleanUri.endsWith("/") ? "" : "/";
        uriWithDb = `${cleanUri}${separator}car-rental`;
      }
    }

    const clientOptions = {
      // Required for modern MongoDB Atlas serverless environments
      serverApi: { version: '1' as const, strict: true, deprecationErrors: true },
      // Important to prevent timeouts in serverless
      bufferCommands: false
    };

    // Mask password in logs to verify URI structure safely
    const maskedUri = uriWithDb.replace(/:([^:@]+)@/, ":****@");
    console.log(`[connectDB] Attempting connection to: ${maskedUri}`);

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
