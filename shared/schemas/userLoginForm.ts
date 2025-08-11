import * as z from 'zod';

/**
 * Schema for user registration form validation
 */
export const UserLoginSchema = z.object(
    {
        email: z.email("Invalid email format"),
        password: z.string()
            .min(8, "Password must be at least 8 characters long")
            .max(50, "Password must be at most 50 characters long")
            .regex(/^[A-Za-z0-9#?!@$%^&*-]+$/, "Password contains invalid characters")
    }
);

/**
 * Type for user registration data based on the schema
 */
export type UserLoginType = z.infer<typeof UserLoginSchema>;
