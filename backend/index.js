// envirement variable
import dotenv from "dotenv";
dotenv.config();
// server 
import express from "express";
import cookieParser from "cookie-parser";
// connection to mongodb db
import { connectDB } from "./db/connectDB.js";
// auth
import authRoutes from "./routes/auth.route.js";
import cors from "cors";


const app = express();
//the port
const PORT = process.env.BACK_END_PORT ||5000;
app.use(cors({
  origin: process.env.CLIENT_URL, // Replace with your frontend URL
  credentials: true
}));
// to be able to deal with json
app.use(express.json());
app.use(cookieParser())
// routes
app.use('/api/auth',authRoutes)
//listen
app.listen(PORT, async () => {
  try {
    await connectDB(); 
    console.log(`DB connected, server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error('DB connection failed', err);
  }
});