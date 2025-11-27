PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_mpesaMessages` (
	`id` integer PRIMARY KEY NOT NULL,
	`counterparty` text,
	`amount` integer,
	`balance` integer,
	`purpose` text,
	`number` integer,
	`dueDate` text,
	`message` text,
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
INSERT INTO `__new_mpesaMessages`("id", "counterparty", "amount", "balance", "purpose", "number", "dueDate", "message", "parsedDate", "parsedTime", "account", "fee", "limit", "outstanding", "paid", "transactionCost", "type") SELECT "id", "counterparty", "amount", "balance", "purpose", "number", "dueDate", "message", "parsedDate", "parsedTime", "account", "fee", "limit", "outstanding", "paid", "transactionCost", "type" FROM `mpesaMessages`;--> statement-breakpoint
DROP TABLE `mpesaMessages`;--> statement-breakpoint
ALTER TABLE `__new_mpesaMessages` RENAME TO `mpesaMessages`;--> statement-breakpoint
PRAGMA foreign_keys=ON;