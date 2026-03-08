CREATE TABLE `contact_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title_en` text,
	`title_ka` text,
	`subtitle_en` text,
	`subtitle_ka` text,
	`address_en` text,
	`address_ka` text,
	`email` text,
	`phone` text,
	`secondary_phone` text,
	`facebook_url` text,
	`instagram_url` text,
	`linkedin_url` text,
	`x_url` text,
	`map_embed_url` text,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `home_benefits` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title_en` text NOT NULL,
	`title_ka` text,
	`description_en` text,
	`description_ka` text,
	`icon_path` text,
	`sort_order` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `home_process_steps` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`tab_title_en` text NOT NULL,
	`tab_title_ka` text,
	`title_en` text NOT NULL,
	`title_ka` text,
	`description_en` text,
	`description_ka` text,
	`image` text,
	`step_number` text,
	`sort_order` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title_en` text NOT NULL,
	`title_ka` text,
	`content_en` text,
	`content_ka` text,
	`meta_description_en` text,
	`meta_description_ka` text,
	`seo_title_en` text,
	`seo_title_ka` text,
	`og_title_en` text,
	`og_title_ka` text,
	`og_description_en` text,
	`og_description_ka` text,
	`og_image` text,
	`sort_order` integer DEFAULT 0,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `pages_slug_unique` ON `pages` (`slug`);--> statement-breakpoint
ALTER TABLE `services` ADD `show_on_home` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `services` ADD `home_order` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `services` ADD `home_short_description_en` text;--> statement-breakpoint
ALTER TABLE `services` ADD `home_short_description_ka` text;--> statement-breakpoint
ALTER TABLE `services` ADD `home_learn_more_url` text;--> statement-breakpoint
ALTER TABLE `services` ADD `home_card_image` text;--> statement-breakpoint
ALTER TABLE `team_members` ADD `show_on_home` integer DEFAULT 0;--> statement-breakpoint
ALTER TABLE `team_members` ADD `home_order` integer DEFAULT 0;