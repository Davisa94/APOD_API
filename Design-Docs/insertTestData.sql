-- some users
INSERT INTO `nasa_picture_rating_system`.`user` (`user_email`) VALUES ('Melons@melonmail.com');
INSERT INTO `nasa_picture_rating_system`.`user` (`user_email`) VALUES ('herc@yahoo.com');
INSERT INTO `nasa_picture_rating_system`.`user` (`user_email`) VALUES ('jon@gmail.com');
INSERT INTO `nasa_picture_rating_system`.`user` (`user_email`) VALUES ('null@nullmail.com');
INSERT INTO `nasa_picture_rating_system`.`user` (`user_email`) VALUES ('null');


-- some pictures
INSERT INTO `nasa_picture_rating_system`.`picture` (`picture_URI`, `date_posted`) VALUES ('C:/Documents/Pictures/11-21-2020', '2020-11-21');
INSERT INTO `nasa_picture_rating_system`.`picture` (`picture_URI`, `date_posted`) VALUES ('C:/Documents/Pictures/11-22-2020', '2020-11-22');
INSERT INTO `nasa_picture_rating_system`.`picture` (`picture_URI`, `date_posted`) VALUES ('C:/Documents/Pictures/11-23-2020', '2020-11-23');
INSERT INTO `nasa_picture_rating_system`.`picture` (`picture_URI`, `date_posted`) VALUES ('C:/Documents/Pictures/11-24-2020', '2020-11-24');

-- some ratings
INSERT INTO `nasa_picture_rating_system`.`rating` (`rating_value`, `user_id`, `picture_id`) VALUES ('4', '1', '1');
INSERT INTO `nasa_picture_rating_system`.`rating` (`rating_value`, `user_id`, `picture_id`) VALUES ('5', '2', '1');
INSERT INTO `nasa_picture_rating_system`.`rating` (`rating_value`, `user_id`, `picture_id`) VALUES ('1', '3', '1');

