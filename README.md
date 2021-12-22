# APOD_API

An ExpressJS API for interacting with the NASA APOD system. Backend only.

The structure of the App is as follows:

![](image/README/1640070408568.svg)

Updated graphics courtesy of my wife.

Please note that a secrets file is used instead of environment variables for ease of use but I recomend setting up environment variables for additional security and hashing the password for even more.

EndPoints:

# Get a picture

To get today's picture from the app use:

```http
/picture
```

To get a picture from a specific date add a `pictureDate` parameter

```http
/picture?pictureDate=12/21/2022
```

NOTE: The expected date format is as follows:

`mm/dd/YYYY`

Anything else will result in a rejection, this may be changed in the future with advanced regex  but is out of the scope of the MVP

# NOTE: User Managment

It is important to note that the MVP does not have user authentication but that feature may be added in the future.

# Add a User

To add a user to the rating system we must provide an email for the user, Note that multiple user managment actions all use the same endpoint but use different methods.

the endpoint must be POST ed to:

```http
/user
```

with a body containing a `newEmail` value like below:

```json
{
    "newEmail" : "example@email.com"
}
```

NOTE: Email validation is out of the scope of the MVP but may be added in the future


# Update a User

To update an existing user within the rating system you need the old email and the new email

the endpoint must be POST ed to:

```http
/user
```

with a body containing an `oldEmail` and `newEmail` values as below:

```json
{
    "newEmail" : "example@email.com",
    "oldEmail" : "newEmail@example.com"
}
```

# Delete a User

To delete an existing user within the rating system you need email of the account you want to delete

the endpoint must use the DELETE method:

```http
/user
```

with a body containing the `email` value as below:

```json
{
    "email" : "example@email.com",
}
```

NOTE: Deleting a user will also delete all of their reviews.

# Add a Rating

The system allows for rating the images between 1-5 stars inclusive. To add a rating to the system you need to have, the users `email` , the desired `rating` and the `pictureDate` (the date the picture was featured in APOD)

The endpoint below is used to add a rating and uses the POST method:

```http
/userRating
```

with a body containing the users `email` , the desired `rating` and the `pictureDate` :

```json
{
    "rating" : 2,
    "email" : "email@melonmail.com",
    "pictureDate" : "10/22/2020"
}
```

`pictureDate` as with all other dates externaly facing is in the format `mm-dd-YYYY`

# Update a Rating

To update an existing rating within the system we need the same data as from before to update with a new rating value. To update a rating in the system you need to have, the users `email` , the desired `rating` and the `pictureDate` (the date the picture was featured in APOD)


The endpoint below is used to update a rating and uses the POST method:

```http
/userRating
```

with a body containing the users `email` , the desired `rating` and the `pictureDate` :

```json
{
    "rating" : 1,
    "email" : "email@melonmail.com",
    "pictureDate" : "10/22/2020"
}
```

`pictureDate` as with all other dates externaly facing is in the format `mm-dd-YYYY`

# Delete a Rating

To delete an existing rating within the system we need the users `email` and the`pictureDate` (the date the picture was featured in APOD) of the rating they want to have deleted

The endpoint below is used to delete a rating and uses the DELETE method:

```http
/userRating
```

with a body containing the users `email` and the `pictureDate` :

```json
{
    "email" : "email@melonmail.com",
    "pictureDate" : "10/22/2020"
}
```

`pictureDate` as with all other dates externaly facing is in the format `mm-dd-YYYY`

NOTE: Deleting a user will also delete all of their reviews.

# Get all of a Users Ratings

To fetch all of a users rating from the database we only need the users `email`

The endpoint below is used to get all ratings and uses the GET method:

```http
/userRatings
```

The endpoint must be provided an `email` query parameter to function:

```http
/userRatings?email=email@melonmail.com
```

response includes an array of JSON objects which include the users email, the picture URI/URL and the rating value
