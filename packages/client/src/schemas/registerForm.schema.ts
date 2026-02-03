import * as z from "zod";

export const registerFormSchema = z.object({
    name: z.string()
        .min(1, "The name is required")
        .min(3, "The name is too short")
        .max(50, "The name is too long"),
    email: z.email()
        .min(1, "The email is required"),
    password: z.string()
        .min(1, "The password is required")
        .min(8, "At least 8 characters")
        .max(50, "The password is too long"),
    confirmPassword: z.string()
        .min(1, "Confirm password required")
})
    .refine(data => data.password === data.confirmPassword, {
        error: "Passwords don't match",
        path: ["confirmPassword"]
    });

export type RegisterForm = z.infer<typeof registerFormSchema>;
