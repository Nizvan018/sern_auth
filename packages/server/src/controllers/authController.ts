import { Request, Response } from "express";
import { UserRegistrationSchema } from "@/schemas/userRegistrationForm";
import { UserLoginSchema } from "@/schemas/userLoginForm";
import db from "@/config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import transporter from "@/config/nodemailer";
import crypto from "crypto";

/**
 * Register a new user in the database and create a JWT
 * After registration, send welcome email to the user
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns Reponse with status 201 and a message indicating that the user was registered successfully.
 */
export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validate the form data (request body):

        const result = UserRegistrationSchema.safeParse({ name, email, password, confirmPassword });

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        // Validate if the email already exists:

        const existingUser = await db.select().from(user).where(eq(user.email, email)).get();

        if (existingUser) {
            return res.status(400).json({ error: "Email already in use" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user in the database:
        const newUser = await db.insert(user).values({
            id: crypto.randomUUID(),
            name,
            email,
            password: hashedPassword,
            createdAt: new Date(),
            updatedAt: new Date()
        }).returning().get();

        // Create the JWT:

        const token = jwt.sign(
            { id: newUser.id },
            process.env.JWT_SECRET!,
            { expiresIn: "8h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        // Send welcome email:

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to SERN sample authentication app",
            text: `
                Welcome to SERN sample authentication app.
                Your account has been created with your ${email} email
            `
        });

        return res.status(201).json({
            id: newUser.id,
            name: newUser.name,
            email: newUser.email
        });
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error has ocurred" });
    }
}

/**
 * Login an existing user and create a JWT
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns Response with status 200 and a message indicating that the user was logged in successfully
 */
export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        // Validate the form data (request body):

        const result = UserLoginSchema.safeParse({ email, password });

        if (!result.success) {
            return res.status(400).json({ error: result.error })
        }

        // Check if the user exists:

        const userData = await db.select().from(user).where(eq(user.email, email)).get();

        if (!userData) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Check if the password matches:

        const passwordMatch = await bcrypt.compare(password, userData.password);

        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Create the JWT:

        const token = jwt.sign(
            { id: userData.id },
            process.env.JWT_SECRET!,
            { expiresIn: "8h" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        return res.status(200).json({
            id: userData.id,
            name: userData.name,
            email: userData.email
        });
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error has ocurred" });
    }
}

/**
 * Logout the user by clearing the JWT cookie
 * 
 * @param {Request} _req 
 * @param {Response} res 
 * @returns Response with status 200 and a message indicating that the user was logged out successfully
 */
export const logout = async (_req: Request, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        return res.status(200).json({ message: "User logged out successfully" });
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error has ocurred" });
    }
}

/**
 * Send OTP by email to verify the user's account
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns Response with status 200 and a message indicating that the OTP was sent successfully
 */
export const sendVerifyOtp = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        // If user is not authorized
        if (!userId) {
            return res.status(401).json({ error: "Not authorized" });
        }

        // Get the user
        const userFound = await db.select().from(user).where(eq(user.id, userId)).get();

        // If the user doesn't exist
        if (!userFound) {
            return res.status(404).json({ error: "User not found" });
        }

        // If the user is already verified
        if (userFound.isAccountVerified) {
            return res.status(400).json({ error: "Account is already verified" });
        }

        // Rate limiting (check if OTP was sent recently)
        if (userFound.verifyOtpExpiresAt && userFound.verifyOtpExpiresAt > Date.now()) {
            return res.status(400).json({ error: "OTP already sent. Please wait before requesting a new one" })
        }

        // Generate a 6-digit OTP and set expiration time (10 minutes):

        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex"); // hash the OTP before storeing it in the database
        const expireAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        // Update the user
        await db.update(user).set({
            verifyOtp: otpHash,
            verifyOtpExpiresAt: expireAt
        }).where(eq(user.id, userId));

        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: userFound.email,
            subject: "Account Verification OTP",
            text: `
                Your OTP is ${otp}.
                Verify your account using this OTP. It will expire in 10 minutes.
            `
        });

        return res.status(200).json({ message: "OTP sent successfully" });
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error has ocurred during sending OTP verification" });
    }
}

/**
 * Verify user account using its OTP
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns Response with status 200 and a message indicating that the user was verified successfully
 */
export const verifyEmail = async (req: Request, res: Response) => {
    try {
        const { otp } = req.body;
        const userId = req.userId;

        // If the data is not valid
        if (!userId || !otp) {
            return res.status(400).json({ error: "Missing data" });
        }

        // Get the user
        const userFound = await db.select().from(user).where(eq(user.id, userId)).get();

        // If the user doesn't exist
        if (!userFound) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify OTP expiration
        if (
            !userFound.verifyOtpExpiresAt ||
            userFound.verifyOtpExpiresAt < Date.now()
        ) {
            return res.status(400).json({ error: "OTP expired" });
        }

        // Verify OTP hash:

        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        if (otpHash !== userFound.verifyOtp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Verify user account
        await db.update(user).set({
            isAccountVerified: true,
            verifyOtp: null,
            verifyOtpExpiresAt: null
        }).where(eq(user.id, userId));

        return res.status(200).json({ message: "Account verified successfully" });
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error has ocurred during email verification" });
    }
}

/**
 * Verify if an user is authenticated
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns Response with status 200 and a message indicating that the user is authenticated
 */
export const isAuthenticated = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        if (!userId) {
            return res.status(401).json({ error: "Not authorized" });
        }

        const userData = await db.select({
            id: user.id,
            name: user.name,
            email: user.email
        })
            .from(user)
            .where(eq(user.id, userId))
            .get();

        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(userData);
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error has ocurred during verification" });
    }
}

/**
 * Send reset password OTP by email
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns Response with status 200 and a message indicating that the reset OTP was sent successfully
 */
export const sendResetOTP = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        // If the email doesn't exist
        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        // Get the user
        const userData = await db.select()
            .from(user)
            .where(eq(user.email, email))
            .get();

        // If the user doesn't exist
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        // Generate a 6-digit OTP and set expiration time (10 minutes):

        const otp = crypto.randomInt(100000, 1000000).toString();
        const otpHash = crypto.createHash("sha256").update(otp).digest("hex"); // hash the OTP before storeing it in the database
        const expireAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

        // Update reset OTP and its expiration of the user
        await db.update(user).set({
            resetOtp: otpHash,
            resetOtpExpiresAt: expireAt
        }).where(eq(user.id, userData.id));

        // Send the reset OTP to the user's email
        await transporter.sendMail({
            from: process.env.SENDER_EMAIL,
            to: userData.email,
            subject: "Password Reset OTP",
            text: `Your OTP for resetting your password is ${otp}. It will expire in 10 minutes.`
        });

        return res.status(200).json({ message: "Reset OTP sent successfully" });
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error has ocurred during sending reset OTP" });
    }
}

/**
 * Reset user's password using OTP
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns Response with status 200 and a message indicating that the user's password was reset successfully
 */
export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, otp, newPassword } = req.body;

        // Verify if the data exists
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: "Missing data" });
        }

        // Get the user
        const userData = await db.select()
            .from(user)
            .where(eq(user.email, email))
            .get();

        // Verify if the user exists
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify OTP expiration
        if (
            !userData.resetOtpExpiresAt ||
            userData.resetOtpExpiresAt < Date.now()
        ) {
            return res.status(400).json({ error: "OTP expired" });
        }

        // Verify OTP hash:

        const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

        if (otpHash !== userData.resetOtp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Reset the user's password:

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await db.update(user).set({
            password: hashedPassword,
            resetOtp: null,
            resetOtpExpiresAt: null
        }).where(eq(user.id, userData.id));

        return res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        return res.status(500).json({ error: "An unexpected error has ocurred during resetting password" });
    }
}
