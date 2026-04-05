ALTER TABLE `applicants` MODIFY COLUMN `education` json;--> statement-breakpoint
ALTER TABLE `applicants` MODIFY COLUMN `experience` json;--> statement-breakpoint
ALTER TABLE `applicants` ADD `projects` json;