-- Homepage content extensions: services, benefits, process steps
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `show_on_home` integer DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `home_order` integer DEFAULT 0;
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `home_short_description_en` text;
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `home_short_description_ka` text;
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `home_learn_more_url` text;
--> statement-breakpoint
ALTER TABLE `services` ADD COLUMN `home_card_image` text;
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

