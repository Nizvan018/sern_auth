import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/** JWT Payload interface */
interface JwtPayload {
    /** User ID */
    id: string;
}

/**
 * Authenticate the user
 * 
 * @param {Request} req - The request
 * @param {Response} res - The response
 * @param {NextFunction} next - Next function
 * @returns 
 */
const userAuth = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.cookies;

        if (!token) {
            return res.status(401).json({ error: "Not authorized" });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined");
        }

        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload;

        if (!tokenDecode.id) {
            return res.status(401).json({ error: "Not authorized" });
        }

        req.userId = tokenDecode.id;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An unexpected error has ocurred during user authentication" });
    }
}

export default userAuth;
