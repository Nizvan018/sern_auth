import * as z from 'zod';

/**
 * Schema for user registration form validation
 */
export const UserRegistrationSchema = z.object(
    {
        name: z.string()
            .min(1, "Name is required")
            .min(3, "Name must be at least 3 characters long")
            .max(50, "Name must be at most 50 characters long"),
        email: z.email("Invalid email format"),
        password: z.string()
            .min(8, "Password must be at least 8 characters long")
            .max(50, "Password must be at most 50 characters long")
            .superRefine((val, ctx) => {
                const rules = [
                    // ENABLE THESE RULES IF YOU WANT TO ENFORCE STRONG PASSWORDS
                    // { regex: /(?=.*?[A-Z])/, message: "Password must contain at least one uppercase letter" },
                    // { regex: /(?=.*?[a-z])/, message: "Password must contain at least one lowercase letter" },
                    // { regex: /(?=.*?[0-9])/, message: "Password must contain at least one number" },
                    // { regex: /(?=.*?[#?!@$%^&*-])/, message: "Password must contain at least one special character" },
                    // { regex: /^\S+$/, message: "Password must not contain spaces" },
                    { regex: /^[A-Za-z0-9#?!@$%^&*-]+$/, message: "Password contains invalid characters" }
                ];

                for (const rule of rules) {
                    if (!rule.regex.test(val)) {
                        ctx.addIssue({
                            code: "custom",
                            message: rule.message
                        })
                    }
                }
            }),
        confirmPassword: z.string()
    }
).refine((data) => data.password === data.confirmPassword, {
    error: "Passwords do not match",
    path: ["confirmPassword"]
});

/**
 * Type for user registration data based on the schema
 */
export type UserRegistrationType = z.infer<typeof UserRegistrationSchema>;
