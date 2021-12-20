CREATE DATABASE IF NOT EXISTS NASA_PICTURE_RATING_SYSTEM;
USE NASA_PICTURE_RATING_SYSTEM;

--User table for storing the relation between user ID and email:
CREATE TABLE user (
   user_id SERIAL NOT NULL,
   user_email VARCHAR(255) NOT NULL,
   PRIMARY KEY (user_id),
   UNIQUE(user_id),
   UNIQUE(user_email)
);

--