# <svg id="SvgjsSvg1001" width="50" height="50" xmlns="http://www.w3.org/2000/svg" version="1.1" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:svgjs="http://svgjs.com/svgjs"><defs id="SvgjsDefs1002"></defs><g id="SvgjsG1008"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 570 380" width="50" height="50"><!--! Font Awesome Pro 6.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc.--><path d="M64 95.1H0c0 123.8 100.3 224 224 224v128C224 465.6 238.4 480 255.1 480S288 465.6 288 448V320C288 196.3 187.7 95.1 64 95.1zM448 32c-84.25 0-157.4 46.5-195.8 115.3c27.75 30.12 48.25 66.88 59 107.5C424 243.1 512 147.9 512 32H448z" fill="#15ab08" class="color000 svgShape"></path></svg></g></svg>Motmir (MVP)

## Introduction
Motmir is a Full E-Commerce Web App with an API Powered by Python(v3.8.10) and flask(v2.0.2), and Reactjs(v17.0.2) for Front-End, and Mysql(v8.0.27) for the database.

[Author Linkedin](https://www.linkedin.com/in/elmahdi-mamoun-a74a1a1bb/) || 
[Live Demo](https://motmir.netlify.app/)

## Quick-start (in Ubuntu v20.04)

##### 0 - Clone the Repository and cd to it :3

##### 1 - Install Python >= v3.8 and pip3

##### 2 - Install required packages in `requirements.txt`
    pip3 install -r requirements.txt

##### 3 - Install React Dependencies
    cd motmirfrontend
    npm install
    cd ..

##### 4 - Install Mysql 8
    sudo apt install mysql-client mysql-community-server mysql-server

##### 5 - Update ENV Variables in `api/.env`
    # Note : Most commented variables will be added directly to the app host server envirenment variables

    FLASK_ENV=production  # change this to `development` if needed
    FLASK_APP=app         # default

    # production db
    # MYSQL_USER= db user name
    # MYSQL_PWD= db password
    # MYSQL_HOST= db host domain or ip
    # MYSQL_DB= db name

    # test db
    MYSQL_USER=motmir_dev  # default
    MYSQL_PWD=motmir_pwd   # default
    MYSQL_HOST=localhost   # default
    MYSQL_DB=motmir_db     # default

    TYPE_STORAGE=db  # default
    MYSQL_ENV=prod   # change this to `test` if you want the databases tables to be dropped on every api app restart

    API_HOST=0.0.0.0 # default
    API_PORT=5000    # default

    # if you didn't specify these variables the app will fail on sending emails to clients which may or may not result in other problems
    # GMAIL_SENDER_EMAIL= the senders email (required)
    # GMAIL_CREDENTIALS= Your gmail api credentials json object (required)
    # GMAIL_TOKEN= Your gmail api token json object which will be created automatically on first login so this can be empty until you have the token

    FRONTEND_BASE_URL=localhost:3000/


##### 6 - Run the service and Create Mysql database and user
    # You can update the file setup_mysql_dev.sql
    # with the names and previliges you want
    # but you will need to update the envirenement
    # variables. check Configuration section for that.

    sudo service mysql start
    sudo mysql -p < setup_mysql_dev.sql


##### 7 - Create admin Account (You can skip this)
    python3 -m api.create_admin_profile
    # You can access admin panel in localhost:3000/admin after you start the app


##### 8 - Run API
    python3 -m api.app

##### 9 - Run React App
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

## Contributing
If you would like to contribute to the project, you may create a Pull Request containing your proposed changes and we will review it as soon as we are able! Please review our [contributing guidelines](CODE_OF_CONDUCT.md) first.

## Code of Conduct
Before interacting with our community, please read our [Code of Conduct](CODE_OF_CONDUCT.md).

## Licensing
Motmir is free and open-source software licensed under the GNU General Public License v3.0. Everything created by [Elmahdi1962](https://github.com/Elmahdi1962).

## Authors
Elmahdi1962 <elmahdimamoun1962@gmail.com>
