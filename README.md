# Motmir

## Introduction
Motmir is a Full E-Commerce Web App with an API Powered by Python(v3.8.10) and flask(v2.0.2), and Reactjs(v17.0.2) for Front-End, and Mysql(v8.0.27) for the database.

## Configuration

### API:

In api/.env Update your Database and API host informations

    MYSQL_USER=Database username
    MYSQL_PWD=Database user's password
    MYSQL_HOST=Database Host url or ip
    MYSQL_DB=Database Name
    MYSQL_ENV=prod
    TYPE_STORAGE=db

    API_HOST=0.0.0.0
    API_PORT=5000

And if you are testing you can change the variable `MYSQL_ENV` value to `test` which will drop all the tables in the database on every app Start/Restart

    MYSQL_ENV=test

And if you created your own Storage class for another type of storage like File Storage you can use the variable `TYPE_STORAGE` To initialize the right Storage Instance that you wanted which can be done in this file

    models/__init__.py

### Front-End:
in `motmirfrontend/src/index.js` Update the variables `baseUrl` and `imagesUrl`

    baseUrl   = API's URL
    imagesUrl = Your imagekit.io URL-endpoint to fetch images from as im using imagekit's service to store my products images

example:

    export const baseUrl = 'https://motmir-api.herokuapp.com'; //'http://localhost:5000'
    export const imagesUrl = 'https://ik.imagekit.io/motmir/'; // exact folder not specified in case you have different folders by default images are stored in a folder called `products-images`


