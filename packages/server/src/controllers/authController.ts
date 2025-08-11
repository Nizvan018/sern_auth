import { Request, Response } from "express";
import { UserRegistrationSchema } from "@/schemas/userRegistrationForm";
import { UserLoginSchema } from "@/schemas/userLoginForm";
import db from "@/config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Register a new user in the database and create a JWT
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
            { expiresIn: "8h" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
            maxAge: 8 * 60 * 60 * 1000 // 8 hours
        });

        return res.status(201).json({ message: "User registered successfully" });
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

        return res.status(200).json({ message: "User logged in successfully" });
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
