#!/usr/bin/python3
""" objects that handle all default RestFul API actions for User registration and login """

from datetime import datetime
from api.app import storage
from api.views import auth_views
from api.app import app, bcrypt
from models.user import User
from flask import jsonify, make_response, request, abort, render_template, url_for, flash, redirect
import jwt
import datetime


@auth_views.route('/register', methods=['POST'], strict_slashes=False)
def register():
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'Data is Not Json!'}, 400)
    
    try:
        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
        
        new_user = User(username=data['username'], password=hashed_password, email=data['email'])
        new_user.save()
        
        return jsonify({'message': 'new user created!'})
    except:
        try:
            storage.delete(new_user)
        except:
            abort(500, description='Something went wrong. try again later')
        abort(500, description='Something went wrong. try again later')

@auth_views.route('/login', methods=['GET'], strict_slashes=False)
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return jsonify({'message': 'Could not verify', 'WWW-Authenticate': 'Basic realm="Login required!"'}), 401
    try:
        user = storage.get_user(auth.username)

        if not user:
            # user not found
            return jsonify({'message': 'Wrong Password or Username', 'WWW-Authenticate': 'Basic realm="Login required!"'}), 401

        if bcrypt.check_password_hash(user.password, auth.password):
            user_dict = user.to_dict()
            new_dict = {}
            for key,value in user_dict.items():
                if key in ['username', 'email']:
                    new_dict[key] = value

            token = jwt.encode({'user': new_dict, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1)}, app.config['SECRET_KEY'])

            return jsonify({'token' : token})
        # wrong password
        return jsonify({'message': 'Wrong Password or Username', 'WWW-Authenticate': 'Basic realm="Login required!"'}), 401
    except:
        abort(500, description='Something went wrong. try again later')
