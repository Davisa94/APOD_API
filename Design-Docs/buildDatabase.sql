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
   PRIMARY KEY (picture_id)
);