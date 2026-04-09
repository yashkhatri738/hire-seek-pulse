CREATE TABLE `conversation_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversation_id` int NOT NULL,
	`user_id` int NOT NULL,
	CONSTRAINT `conversation_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`conversation_id` int NOT NULL,
	`sender_id` int NOT NULL,
	`content` text NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `job_applications` ADD `linkedin_url` varchar(255);--> statement-breakpoint
ALTER TABLE `job_applications` ADD `github_url` varchar(255);--> statement-breakpoint
ALTER TABLE `job_applications` ADD `portfolio_url` varchar(255);--> statement-breakpoint
ALTER TABLE `job_applications` ADD `years_of_experience` varchar(50);--> statement-breakpoint
ALTER TABLE `conversation_members` ADD CONSTRAINT `conversation_members_conversation_id_conversations_id_fk` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `messages` ADD CONSTRAINT `messages_conversation_id_conversations_id_fk` FOREIGN KEY (`conversation_id`) REFERENCES `conversations`(`id`) ON DELETE cascade ON UPDATE no action;