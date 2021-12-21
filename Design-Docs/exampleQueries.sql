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
