# Motmir (MVP)

## Introduction
Motmir is a Full E-Commerce Web App with an API Powered by Python(v3.8.10) and flask(v2.0.2), and Reactjs(v17.0.2) for Front-End, and Mysql(v8.0.27) for the database.

[Author Linkedin](https://www.linkedin.com/in/elmahdi-mamoun-a74a1a1bb/)
[Live Demo](https://motmir.netlify.app/)

## Quick-start (in Ubuntu v20.04)

##### 0 - Clone the Repository and cd to it :3

##### 1 - Install Python >= v3.8

##### 2 - Install required packages in `requirements.txt`
    pip3 install -r requirements.txt

##### 3 - Install React Dependencies
    cd motmirfrontend
    npm install
    cd ..

##### 4 - Install Mysql 8
    sudo apt install mysql-client mysql-community-server mysql-server

##### 5 - Create Mysql database and user
    # You can update the file setup_mysql_dev.sql
    # with the names and previliges you want
    # but you will need to update the envirenement
    # variables. check Configuration section for that.

    sudo mysql -p < setup_mysql_dev.sql

##### 6 - Create admin Account (You can skip this)
    python3 -m api.create_admin_profile
    # You can access admin panel in localhost:3000/admin after you start the app


##### 7 - Run API
    python3 -m api.app

##### 8 - Run React App
    cd motmirfrontend
    npm run start

##### Congrats You can now access the app from the browser in localhost:3000



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
