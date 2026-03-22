-- SEO / Open Graph fields for articles, services, team_members
ALTER TABLE `articles` ADD `meta_description_en` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `meta_description_ka` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `seo_title_en` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `seo_title_ka` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `og_title_en` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `og_title_ka` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `og_description_en` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `og_description_ka` text;--> statement-breakpoint
ALTER TABLE `articles` ADD `og_image` text;--> statement-breakpoint
ALTER TABLE `services` ADD `meta_description_en` text;--> statement-breakpoint
ALTER TABLE `services` ADD `meta_description_ka` text;--> statement-breakpoint
ALTER TABLE `services` ADD `seo_title_en` text;--> statement-breakpoint
ALTER TABLE `services` ADD `seo_title_ka` text;--> statement-breakpoint
ALTER TABLE `services` ADD `og_title_en` text;--> statement-breakpoint
ALTER TABLE `services` ADD `og_title_ka` text;--> statement-breakpoint
ALTER TABLE `services` ADD `og_description_en` text;--> statement-breakpoint
ALTER TABLE `services` ADD `og_description_ka` text;--> statement-breakpoint
ALTER TABLE `services` ADD `og_image` text;--> statement-breakpoint
ALTER TABLE `team_members` ADD `meta_description_en` text;--> statement-breakpoint
ALTER TABLE `team_members` ADD `meta_description_ka` text;--> statement-breakpoint
ALTER TABLE `team_members` ADD `seo_title_en` text;--> statement-breakpoint
ALTER TABLE `team_members` ADD `seo_title_ka` text;--> statement-breakpoint
ALTER TABLE `team_members` ADD `og_title_en` text;--> statement-breakpoint
ALTER TABLE `team_members` ADD `og_title_ka` text;--> statement-breakpoint
ALTER TABLE `team_members` ADD `og_description_en` text;--> statement-breakpoint
ALTER TABLE `team_members` ADD `og_description_ka` text;--> statement-breakpoint
ALTER TABLE `team_members` ADD `og_image` text;
