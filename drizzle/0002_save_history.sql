CREATE TABLE `save_history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`section` text NOT NULL,
	`label` text NOT NULL,
	`action` text NOT NULL,
	`saved_at` text NOT NULL
);
