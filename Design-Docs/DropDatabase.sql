-- WARNING DO NOT USE THIS FILE IT WILL DROP THE WHOLE DATABSE AND IS FOR TESTING PURPOSES ONLY
USE NASA_PICTURE_RATING_SYSTEM;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS picture;
DROP TABLE IF EXISTS rating;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS pictureTags;

SET FOREIGN_KEY_CHECKS = 1;