import { Request, Response } from "express";
import db from "@/config/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Get the safe user data by userId
 * 
 * @param {Request} req 
 * @param {Response} res 
 * @returns Reponse with status 200 and the safe user data
 */
export const getUserById = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        // Validate userId
        if (!userId) {
            return res.status(400).json({ error: "User ID not provided" });
        }

        // Get user data
        const userData = await db
            .select({
                id: user.id,
                name: user.name,
                email: user.email,
                isAccountVerified: user.isAccountVerified,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            })
            .from(user)
            .where(eq(user.id, userId))
            .get();

        // If the user doesn't exist
        if (!userData) {
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json(userData);
    } catch (error) {
        res.status(500).json({ error: "An unexpected error has occurred while fetching user data" });
    }
}
