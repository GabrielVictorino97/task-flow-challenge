import mongoose from "mongoose";
import { env } from "../../helpers/env";

export async function connectDatabase(): Promise<void> {
  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected. Reconnecting...");
    setTimeout(() => mongoose.connect(env.MONGO_URI).catch(console.error), 3000);
  });

  mongoose.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
  });

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected.");
  });

  await mongoose.connect(env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
    heartbeatFrequencyMS: 10000
  });
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
