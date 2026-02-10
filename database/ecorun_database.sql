CREATE TABLE `users`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `username` VARCHAR(50) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `eco_points` INT NULL,
    `role` ENUM('user', 'admin') NOT NULL DEFAULT 'user',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `users` ADD UNIQUE `users_username_unique`(`username`);
ALTER TABLE
    `users` ADD UNIQUE `users_email_unique`(`email`);
CREATE TABLE `runs`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `run_name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `distance_km` DECIMAL(8, 2) NOT NULL,
    `duration_minutes` INT NOT NULL,
    `start_time` DATETIME NOT NULL,
    `end_time` DATETIME NOT NULL,
    `run_date` DATETIME NOT NULL,
    `points_earned` INT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `runs` ADD INDEX `runs_user_id_index`(`user_id`);
CREATE TABLE `challenges`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `goal_type` ENUM('distance', 'count') NOT NULL,
    `goal_value` DECIMAL(8, 2) NOT NULL,
    `start_date` DATE NULL,
    `end_date` DATE NULL,
    `reward_points` INT NULL,
    `difficulty` ENUM('easy', 'medium', 'hard') NOT NULL,
    `category` VARCHAR(50) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT 'DEFAULT TRUE'
);
CREATE TABLE `user_challenges`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `challenge_id` INT NOT NULL,
    `progress` DECIMAL(8, 2) NULL,
    `status` ENUM(
        'pending',
        'in_progress',
        'completed',
        'failed'
    ) NOT NULL DEFAULT 'pending',
    `joined_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `user_challenges` ADD INDEX `user_challenges_user_id_index`(`user_id`);
ALTER TABLE
    `user_challenges` ADD INDEX `user_challenges_challenge_id_index`(`challenge_id`);
CREATE TABLE `posts`(
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `run_id` INT NOT NULL,
    `user_id` INT NOT NULL,
    `published_at` DATETIME NULL DEFAULT CURRENT_TIMESTAMP());
ALTER TABLE
    `posts` ADD INDEX `posts_run_id_index`(`run_id`);
ALTER TABLE
    `posts` ADD INDEX `posts_user_id_index`(`user_id`);
ALTER TABLE
    `posts` ADD CONSTRAINT `posts_run_id_foreign` FOREIGN KEY(`run_id`) REFERENCES `runs`(`id`);
ALTER TABLE
    `runs` ADD CONSTRAINT `runs_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `posts` ADD CONSTRAINT `posts_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `user_challenges` ADD CONSTRAINT `user_challenges_user_id_foreign` FOREIGN KEY(`user_id`) REFERENCES `users`(`id`);
ALTER TABLE
    `user_challenges` ADD CONSTRAINT `user_challenges_challenge_id_foreign` FOREIGN KEY(`challenge_id`) REFERENCES `challenges`(`id`);