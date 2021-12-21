-- Build a MySQL Database, Built and tested with MySQL 8
CREATE DATABASE IF NOT EXISTS NASA_PICTURE_RATING_SYSTEM;
USE NASA_PICTURE_RATING_SYSTEM;

-- User table for storing the relation between user ID and email:
CREATE TABLE `user` (
   `user_id` SERIAL NOT NULL,
   `user_email` VARCHAR(255) NOT NULL,
   PRIMARY KEY (`user_id`),
   UNIQUE KEY `user_email_UQ` (`user_email`)
);

-- Picture Table containing relation between image URI , date posted, and the ID
CREATE TABLE `picture` (
   `picture_id` SERIAL NOT NULL,
   `picture_URI` VARCHAR(255) NOT NULL,
   `date_posted` DATE DEFAULT(curdate()),
   PRIMARY KEY (`picture_id`)
);

-- Ratings table to store ratings in the relation to the user and the picture
CREATE TABLE `rating` (
   `rating_id` SERIAL NOT NULL,
   `rating_value` TINYINT,
   `user_id` BIGINT UNSIGNED NOT NULL,
   `picture_id` BIGINT UNSIGNED NOT NULL,
   `date_rated` DATETIME NOT NULL DEFAULT(curdate()),
   PRIMARY KEY (`rating_id`),
   UNIQUE KEY `unique_rating_id` (`user_id`, `picture_id`),
   CONSTRAINT user_rating
      FOREIGN KEY (user_id)
      REFERENCES `user`(`user_id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   CONSTRAINT picture_rating
      FOREIGN KEY (picture_id)
      REFERENCES `picture`(`picture_id`)
      ON DELETE CASCADE
      ON UPDATE CASCADE,
   CONSTRAINT verify_rating CHECK(rating_value <= 5 AND rating_value >= 1)
);
