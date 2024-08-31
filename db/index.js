import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
import dotenv from 'dotenv';
dotenv.config();
const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}`,  // Correct placement
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(`MONGODB CONNECTED!! DB HOST : ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error(`MONGODB connection ERROR: ${error.message}`);
    process.exit(1); // Optionally exit the process if the connection fails
  }
};

export default connectDB;
