import { sqliteTable, text, integer, } from "drizzle-orm/sqlite-core";

const timestamps = {
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull()
}

export const user = sqliteTable("user", {
    id: text().primaryKey(),
    name: text().notNull(),
    email: text().notNull().unique(),
    password: text().notNull(),
    // Verification
    verifyOtp: text("verify_otp").default(""),
    verifyOtpExpiresAt: integer("verify_otp_expires_at").default(0),
    isAccountVerified: integer("is_account_verified", { mode: "boolean" }).default(false),
    // Reset Password
    resetOtp: text("reset_otp").default(""),
    resetOtpExpiresAt: integer("reset_otp_expires_at").default(0),
    // Timestamps
    ...timestamps
});

export type SelectedUser = typeof user.$inferSelect;
export type InsertedUser = typeof user.$inferInsert;
