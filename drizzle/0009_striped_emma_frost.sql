CREATE TABLE `subCategories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`categoryId` integer NOT NULL,
	`title` text NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `subCategories_title_unique` ON `subCategories` (`title`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`name` text NOT NULL,
	`icons` text
);
--> statement-breakpoint
INSERT INTO `__new_categories`("id", "title", "name", "icons") SELECT "id", "title", "name", "icons" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `categories_title_unique` ON `categories` (`title`);--> statement-breakpoint
CREATE TABLE `__new_mpesaMessages` (
	`id` integer PRIMARY KEY NOT NULL,
	`counterparty` text NOT NULL,
	`amount` integer,
	`balance` integer,
	`categoryId` integer,
	`number` integer,
	`dueDate` text,
	`message` text NOT NULL,
	`parsedDate` text,
	`parsedTime` text,
	`account` text,
	`fee` integer,
	`limit` integer,
	`outstanding` integer,
	`paid` integer,
	`transactionCost` integer,
	`type` text
);
--> statement-breakpoint
INSERT INTO `__new_mpesaMessages`("id", "counterparty", "amount", "balance", "categoryId", "number", "dueDate", "message", "parsedDate", "parsedTime", "account", "fee", "limit", "outstanding", "paid", "transactionCost", "type") SELECT "id", "counterparty", "amount", "balance", "categoryId", "number", "dueDate", "message", "parsedDate", "parsedTime", "account", "fee", "limit", "outstanding", "paid", "transactionCost", "type" FROM `mpesaMessages`;--> statement-breakpoint
DROP TABLE `mpesaMessages`;--> statement-breakpoint
ALTER TABLE `__new_mpesaMessages` RENAME TO `mpesaMessages`;