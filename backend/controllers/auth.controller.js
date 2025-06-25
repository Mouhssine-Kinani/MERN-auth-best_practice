import bcryptjs from "bcryptjs";
import { User } from "../models/user.model.js";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail, sendPasswordResetEmail } from "../mailtrap/emails.js";
import crypto from "crypto";

function tokenOf6Digits(){
  return Math.floor(100000 + Math.random() * 900000).toString();
}
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) {
      throw new Error("All fields are required");
    }
    const isTheUserExist = await User.findOne({ email });
    if (isTheUserExist)
      return res.status(400).json({
        message: "this emaile is already related to an account, please login",
      });
    const hashedPassword = await bcryptjs.hash(password, 12);
    const verificationToken = tokenOf6Digits();
    const newUser = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
    });

    await newUser.save();

    // jwt :
    generateTokenAndSetCookie(res, newUser._id);
    await sendVerificationEmail(newUser.email, verificationToken);
    res.status(201).json({
      success: true,
      message: "user created successfully",
      user: {
        ...newUser._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const verifyEmail = async (req, res) => {
  const { verificationToken } = req.body;
  try {
    if (!verificationToken)
      throw new Error("The verification token are required");
    const user = await User.findOne({
      verificationToken,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user)
      return res.status(400).json({
        success: false,
        message: "Invalid or expired verification token",
      });
    if (user.verificationToken !== verificationToken)
      return res.status(400).json({
        success: false,
        message: "Invalid verificaion token",
      });
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    await sendWelcomeEmail(user.email, user.name);
    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found, please signup",
      });
    }
    const isPasswordMatch = await bcryptjs.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "password is incorrect",
      });
    }
    if (!user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }
    // jwt :
    generateTokenAndSetCookie(res, user._id);
    user.lastLogin = Date.now();
    await user.save();
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};
export const forgotPassword = async (req, res)=>{
  const { email } = req.body;
  try {
    if(!email){
      return res.status(400).json({
        success: false,
        message: "Email is required"
      })
    }
    const user = await User.findOne({ email});
    if(!user){
      return res.status(404).json({
        success: false,
        message: "User not found, please signup"
      })
    }
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiresAt = Date.now() + 1000 * 60 * 60 * 1; // 1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;
    await user.save();
    await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`);

  } catch (error) {
    
  }
}