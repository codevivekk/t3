CREATE TABLE `t3_todo` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(256) NOT NULL,
	`description` text(1024) NOT NULL,
	`due_date` integer,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer
);
--> statement-breakpoint
CREATE INDEX `title_idx` ON `t3_todo` (`title`);--> statement-breakpoint
CREATE INDEX `due_date_idx` ON `t3_todo` (`due_date`);