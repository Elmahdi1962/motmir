#!/usr/bin/python3
""" objects that handle all default RestFul API actions for User registration and login """

from datetime import datetime
from api.app import storage
from api.views import auth_views
from api.app import app, bcrypt
from models.user import User
from flask import jsonify, make_response, request, abort, render_template, url_for, flash, redirect
import jwt
from functools import wraps
import datetime
from werkzeug.security import generate_password_hash, check_password_hash


def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = None
        
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
            
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'])
            current_user = storage.get('User', data['user']['id'])
            if not current_user:
                return jsonify({'message': 'Token is invalid'}), 401
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return func(current_user, *args, **kwargs)
    
    return decorated

@auth_views.route('/register', methods=['POST'], strict_slashes=False)
def register():
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'Data is Not Json!'}, 400)
    
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    new_user = User(username=data['username'], password=hashed_password, email=data['email'])
    new_user.save()
    
    return jsonify({'message': 'new user created!'})

@auth_views.route('/login', methods=['GET'], strict_slashes=False)
def login():
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return jsonify({'message': 'Could not verify', 'WWW-Authenticate': 'Basic realm="Login required!"'}), 401

    user = storage._DBStorage__session.query(User).filter(User.username == auth.username).first()

    if not user:
        # user not found
        return jsonify({'message': 'Wrong Password or Username', 'WWW-Authenticate': 'Basic realm="Login required!"'}), 401

    if bcrypt.check_password_hash(user.password, auth.password):
        token = jwt.encode({'user': user.to_dict(), 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=1)}, app.config['SECRET_KEY'])

        return jsonify({'token' : token})
    # wrong password
    return jsonify({'message': 'Wrong Password or Username', 'WWW-Authenticate': 'Basic realm="Login required!"'}), 401
