import express from "express";
import { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOTP, resetPassword, getSession } from "@/controllers/authController";
import userAuth from "@/middleware/userAuth";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp); // with middleware
authRouter.post("/verify-email", userAuth, verifyEmail); // with middleware
authRouter.post("/is-auth", userAuth, isAuthenticated); // with middleware
authRouter.post("/get-session", userAuth, getSession); // with middleware
authRouter.post("/send-reset-otp", sendResetOTP);
authRouter.post("/reset-password", resetPassword);

export default authRouter;
