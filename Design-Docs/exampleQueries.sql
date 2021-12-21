USE nasa_picture_rating_system;
SELECT U.user_email, P.picture_URI, R.rating_value
FROM rating R
LEFT JOIN user U on r.user_id = u.user_id
LEFT JOIN picture p on r.picture_id = p.picture_id
WHERE user_email like "Melons@melonmail.com";

-- get a single picture by date

SELECT *
FROM picture
WHERE date_posted = '2020-11-21';


-- select all pictures in a date range
SELECT *
FROM picture
WHERE (date_posted BETWEEN '2020-11-15' AND '2020-11-25'); 


-- add a picture to the database

-- add a user to the database

INSERT INTO user (user_email) VALUES('email@email.com');

-- update a user in the database 

UPDATE user
SET user_email = 'new@email.com'
WHERE user_email = 'old@email.com';

-- delete a user and all ratings

DELETE 
FROM user
WHERE user_email = 'new@email.com';

-- add a rating to the database
INSERT INTO rating (rating_value, user_id, picture_id) VALUES
(
5, 
(SELECT user_id
FROM user
WHERE user_email like 'melons@melonmail.com'),
(SELECT picture_id
FROM picture
WHERE date_posted = '2020-11-24'))

