import * as z from "zod";

export const loginFormSchema = z.object({
    email: z.email()
        .min(1, "The email is required"),
    password: z.string()
        .min(1, "The password is required")
        .min(8, "At least 8 characters")
        .max(50, "The password is too long")
});

export type LoginForm = z.infer<typeof loginFormSchema>;
