CREATE TABLE `mpesaMessages` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`counterparty` text,
	`amount` integer,
	`balance` integer,
	`number` integer,
	`dueDate` text,
	`message` text,
	`rawTime` text,
	`parsedDate` text,
	`parsedTime` text,
	`account` text,
	`fee` integer,
	`limit` integer,
	`outstanding` integer,
	`paid` integer,
	`transactionCost` integer
);
