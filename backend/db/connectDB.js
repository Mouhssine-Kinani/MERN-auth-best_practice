import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const connected = await mongoose.connect(process.env.MONGO_URI);
    console.log(`mongoDB : ${connected}`);
  } catch (error) {
    console.log(`error connecting to mongodb : ${error.message}`);
    process.exit(1); // hadi kat3ni failure
  }
};
