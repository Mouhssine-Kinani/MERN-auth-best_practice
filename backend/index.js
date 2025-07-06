// envirement variable
import dotenv from "dotenv";
dotenv.config();
// server 
import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
// connection to mongodb db
import { connectDB } from "./db/connectDB.js";
// auth
import authRoutes from "./routes/auth.route.js";
import cors from "cors";


const app = express();
//the port
const PORT = process.env.BACK_END_PORT ||5000;
const __dirname = path.resolve();
app.use(cors({
  origin: process.env.CLIENT_URL , // Replace with your frontend URL
  credentials: true
}));
// to be able to deal with json
app.use(express.json());
app.use(cookieParser())
// routes
app.use('/api/auth',authRoutes)

if(process.env.NODE_ENV === "production"){
  app.use(express.static(path.join(__dirname, "frontend/dist")));
  app.get("*",  (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  })
}
//listen
app.listen(PORT, async () => {
  try {
    await connectDB(); 
    console.log(`DB connected, server running at http://localhost:${PORT}`);
  } catch (err) {
    console.error('DB connection failed', err);
  }
});