CREATE TABLE IF NOT EXISTS `Users` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(100) NULL DEFAULT NULL,
	`password` VARCHAR(100) NULL DEFAULT NULL,
	`picture` VARCHAR(2147483645) NULL DEFAULT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `Events` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`eventname` VARCHAR(100) NULL DEFAULT NULL,
	`timestamp` VARCHAR(100) NULL DEFAULT NULL,
	PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS `UserEvents` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`user_id` INTEGER NOT NULL,
	`event_id` INTEGER NOT NULL,
	`created_by` BOOLEAN NULL DEFAULT NULL,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`user_id`) REFERENCES Users(`id`),
	FOREIGN KEY(`event_id`) REFERENCES Events(`id`)
);

CREATE TABLE IF NOT EXISTS `Friends` (
	`id` INTEGER NOT NULL AUTO_INCREMENT,
	`user_id1` INTEGER NOT NULL,
	`user_id2` INTEGER NOT NULL,
	`status` INTEGER,
	PRIMARY KEY(`id`),
	FOREIGN KEY(`user_id1`) REFERENCES Users(`id`),
	FOREIGN KEY(`user_id2`) REFERENCES Users(`id`)

 );
