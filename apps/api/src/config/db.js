import { env } from "#config/env.js";
import mongoose from "mongoose";

/**
 * Connects to MongoDB using the validated MONGO_URI.
 * Throws on failure instead of calling process.exit().
 */
export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`MongoDB connection error: ${error.message}`);
        throw error;
    }
};
