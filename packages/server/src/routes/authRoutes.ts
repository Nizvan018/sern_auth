import express from "express";
import { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated } from "@/controllers/authController";
import userAuth from "@/middleware/userAuth";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/send-verify-otp", userAuth, sendVerifyOtp);
authRouter.post("/verify-email", userAuth, verifyEmail);
authRouter.post("/is-auth", userAuth, isAuthenticated);

export default authRouter;
