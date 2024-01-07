import mongoose from "mongoose";

async function connectDatabase(url) {
  await mongoose.connect(url);
  console.log("Connected to database");
}

async function disconnectDatabase() {
  await mongoose.disconnect();
  console.log("Disconnected from database");
}

export { connectDatabase, disconnectDatabase };
