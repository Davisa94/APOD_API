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

# User Managment

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

# Add a Rating

The system allows for rating the images between 1-5 stars inclusive. To add a rating to the system you need to have, the users `email` , the desired `rating` and the `pictureDate` (the date the picture was featured in APOD)

the endpoint below is used to add a rating and uses the POST method to add a new rating:

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
