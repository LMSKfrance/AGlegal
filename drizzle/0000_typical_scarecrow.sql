CREATE TABLE `articles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title_en` text NOT NULL,
	`title_ka` text,
	`description_en` text,
	`description_ka` text,
	`content_en` text,
	`content_ka` text,
	`image` text,
	`date` text NOT NULL,
	`time` text,
	`tags` text,
	`type` text,
	`sort_order` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `articles_slug_unique` ON `articles` (`slug`);--> statement-breakpoint
CREATE TABLE `faqs` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`question_en` text NOT NULL,
	`question_ka` text,
	`answer_en` text NOT NULL,
	`answer_ka` text,
	`sort_order` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `services` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title_en` text NOT NULL,
	`title_ka` text,
	`description_en` text,
	`description_ka` text,
	`text1_en` text,
	`text1_ka` text,
	`text2_en` text,
	`text2_ka` text,
	`quote_en` text,
	`quote_ka` text,
	`image` text,
	`thumbnail_image` text,
	`sort_order` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `services_slug_unique` ON `services` (`slug`);--> statement-breakpoint
CREATE TABLE `site_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value_en` text,
	`value_ka` text,
	`group` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `site_settings_key_unique` ON `site_settings` (`key`);--> statement-breakpoint
CREATE TABLE `team_member_socials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`team_member_id` integer NOT NULL,
	`platform` text NOT NULL,
	`link` text NOT NULL,
	FOREIGN KEY (`team_member_id`) REFERENCES `team_members`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `team_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title_en` text NOT NULL,
	`title_ka` text,
	`position_en` text,
	`position_ka` text,
	`description_en` text,
	`description_ka` text,
	`quote_en` text,
	`quote_ka` text,
	`text1_en` text,
	`text1_ka` text,
	`text2_en` text,
	`text2_ka` text,
	`image` text,
	`sort_order` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `team_members_slug_unique` ON `team_members` (`slug`);--> statement-breakpoint
CREATE TABLE `testimonials` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`quote_en` text NOT NULL,
	`quote_ka` text,
	`author_name` text NOT NULL,
	`author_position` text,
	`author_image` text,
	`row` text DEFAULT 'top',
	`sort_order` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
