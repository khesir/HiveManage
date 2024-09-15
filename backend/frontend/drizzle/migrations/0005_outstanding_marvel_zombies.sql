CREATE TABLE `arrived_Items` (
	`order_id` int,
	`filePath` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp
);
--> statement-breakpoint
CREATE TABLE `category` (
	`category_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`content` varchar(255),
	CONSTRAINT `category_category_id` PRIMARY KEY(`category_id`)
);
--> statement-breakpoint
CREATE TABLE `item` (
	`item_id` int AUTO_INCREMENT NOT NULL,
	`product_id` int,
	`stock` float,
	`re_order_level` float,
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `item_item_id` PRIMARY KEY(`item_id`)
);
--> statement-breakpoint
CREATE TABLE `order` (
	`order_id` int AUTO_INCREMENT NOT NULL,
	`product_id` int,
	`items_ordered` int,
	`expected_arrival` date,
	`status` enum('Pending','Processing','Delivered','Cancelled','Return','Shipped'),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `order_order_id` PRIMARY KEY(`order_id`)
);
--> statement-breakpoint
CREATE TABLE `product` (
	`product_id` int AUTO_INCREMENT NOT NULL,
	`category_id` int,
	`supplier_id` int,
	`name` varchar(255),
	`description` varchar(255),
	`price` decimal(10,2),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `product_product_id` PRIMARY KEY(`product_id`)
);
--> statement-breakpoint
CREATE TABLE `supplier` (
	`supplier_id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255),
	`contact_number` varchar(255),
	`remarks` varchar(255),
	`created_at` timestamp DEFAULT (now()),
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`deleted_at` timestamp,
	CONSTRAINT `supplier_supplier_id` PRIMARY KEY(`supplier_id`)
);
--> statement-breakpoint
ALTER TABLE `arrived_Items` ADD CONSTRAINT `arrived_Items_order_id_order_order_id_fk` FOREIGN KEY (`order_id`) REFERENCES `order`(`order_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `item` ADD CONSTRAINT `item_product_id_product_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `order` ADD CONSTRAINT `order_product_id_product_product_id_fk` FOREIGN KEY (`product_id`) REFERENCES `product`(`product_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_category_id_category_category_id_fk` FOREIGN KEY (`category_id`) REFERENCES `category`(`category_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `product` ADD CONSTRAINT `product_supplier_id_supplier_supplier_id_fk` FOREIGN KEY (`supplier_id`) REFERENCES `supplier`(`supplier_id`) ON DELETE no action ON UPDATE no action;