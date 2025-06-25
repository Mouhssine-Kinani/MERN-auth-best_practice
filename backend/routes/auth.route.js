import { Router } from "express";
import { signup, login, logout, verifyEmail, forgotPassword } from "../controllers/auth.controller.js";

const authRoutes = Router();

authRoutes.post('/signup', signup)
authRoutes.post('/login', login)
authRoutes.post('/logout', logout)
authRoutes.post('/verify-email', verifyEmail);
authRoutes.post('/forgot-password', forgotPassword);


export default authRoutes;