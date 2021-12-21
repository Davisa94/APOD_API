USE nasa_picture_rating_system;
SELECT U.user_email, P.picture_URI, R.rating_value
FROM rating R
LEFT JOIN user U on r.user_id = u.user_id
LEFT JOIN picture p on r.picture_id = p.picture_id
WHERE user_email like "Melons@melonmail.com"

