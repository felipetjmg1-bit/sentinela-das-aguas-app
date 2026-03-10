CREATE TABLE `ai_analysis_results` (
	`id` int AUTO_INCREMENT NOT NULL,
	`image_url` varchar(500) NOT NULL,
	`analysis_timestamp` timestamp NOT NULL,
	`detected_patterns` json,
	`confidence_scores` json,
	`generated_alert_id` int,
	`batch_job_id` varchar(100),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `ai_analysis_results_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alert_notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`alert_id` int NOT NULL,
	`recipient_id` int NOT NULL,
	`notification_type` enum('email','push','sms') NOT NULL,
	`status` enum('pending','sent','failed') DEFAULT 'pending',
	`sent_at` timestamp,
	`error_message` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `alert_notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `alerts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`monitoring_point_id` int,
	`alert_level` enum('low','medium','high','critical') NOT NULL,
	`description` text,
	`detected_by` enum('ai_analysis','manual_report','sensor') NOT NULL,
	`ai_confidence` decimal(3,2),
	`image_url` varchar(500),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`is_active` boolean DEFAULT true,
	`resolved_at` timestamp,
	`resolved_by` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `alerts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `heatmap_data` (
	`id` int AUTO_INCREMENT NOT NULL,
	`region` varchar(255) NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`risk_score` decimal(3,2) NOT NULL,
	`incident_count_30d` int DEFAULT 0,
	`last_updated` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `heatmap_data_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `inspections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`monitoring_point_id` int NOT NULL,
	`inspector_id` int NOT NULL,
	`inspection_date` timestamp NOT NULL,
	`photos` json,
	`findings` text,
	`maintenance_required` boolean DEFAULT false,
	`status` varchar(50),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `inspections_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `monitoring_points` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`latitude` decimal(10,8) NOT NULL,
	`longitude` decimal(11,8) NOT NULL,
	`type` enum('sewer','drain','river_section','flood_zone') NOT NULL,
	`risk_level` enum('low','medium','high','critical') NOT NULL DEFAULT 'low',
	`status` enum('operational','maintenance','blocked','flooded') NOT NULL DEFAULT 'operational',
	`last_inspection` timestamp,
	`inspection_notes` text,
	`created_by` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `monitoring_points_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reports` (
	`id` int AUTO_INCREMENT NOT NULL,
	`report_type` enum('daily','weekly','monthly','incident') NOT NULL,
	`period_start` timestamp NOT NULL,
	`period_end` timestamp NOT NULL,
	`total_alerts` int DEFAULT 0,
	`critical_alerts` int DEFAULT 0,
	`affected_areas` json,
	`response_time_avg` int,
	`generated_by` int,
	`pdf_url` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reports_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`openId` varchar(64) NOT NULL,
	`name` text,
	`email` varchar(320),
	`loginMethod` varchar(64),
	`role` enum('user','admin','analyst','responder') NOT NULL DEFAULT 'user',
	`organization` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`lastSignedIn` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_openId_unique` UNIQUE(`openId`)
);
