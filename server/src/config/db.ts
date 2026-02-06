import mongoose from "mongoose";
import colors from "colors";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(
      `${process.env.MONGODB_URL}/car-rental`,
    );

    console.log(
      (colors as any).cyan.underline(
        `MongoDB Connected: ${conn.connection.host}`,
      ),
    );
  } catch (error: any) {
    console.error((colors as any).red.bold(`Error: ${error.message}`));
    process.exit(1);
  }
};

export default connectDB;
