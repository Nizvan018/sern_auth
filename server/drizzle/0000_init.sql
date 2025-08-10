CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`password` text NOT NULL,
	`verify_otp` text DEFAULT '',
	`verify_otp_expires_at` integer DEFAULT 0,
	`is_account_verified` integer DEFAULT false,
	`reset_otp` text DEFAULT '',
	`reset_otp_expires_at` integer DEFAULT 0,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);