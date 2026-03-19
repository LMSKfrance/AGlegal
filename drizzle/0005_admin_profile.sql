CREATE TABLE IF NOT EXISTS `admin_profile` (
  `id` integer PRIMARY KEY NOT NULL,
  `name` text NOT NULL DEFAULT 'Admin',
  `email` text NOT NULL,
  `password_hash` text NOT NULL,
  `updated_at` text NOT NULL
);
