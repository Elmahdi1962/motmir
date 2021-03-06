#!/usr/bin/python3
""" objects that handle all default RestFul API actions for User registration and login """

from datetime import datetime
from api.app import storage
from api.views import auth_views
from api.utils.json_response import create_response
from api.utils.gmail_utils import get_gmail_service, create_gmail_message, send_gmail_message
from api.app import bcrypt
from models.user import User
from flask import jsonify, make_response, request, abort, current_app
from os import getenv
import jwt
import datetime


@auth_views.route('/register', methods=['POST'], strict_slashes=False)
def register():
    '''register method'''
    data = request.get_json()
    
    if not data:
        return jsonify({'message': 'Data is Not Json!'}, 400)
    
    try:
        # check if ther is already a user with same username
        user = storage.get_user(data['username'])
        if user:
            return make_response(jsonify({'status': 409, 'message': 'Username already exist!'}), 409)
        
        # check if ther is already a user with same email
        user = storage.get_user_by_email(data['email'])
        if user:
            return make_response(jsonify({'status': 409, 'message': 'Email already exist!'}), 409)

        hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')

        new_user = User(username=data['username'], password=hashed_password, email=data['email'])
        new_user.save()

        # creating confirmation token
        user_dict = new_user.to_dict()
        new_dict = {}
        for key,value in user_dict.items():
            if key in ['username', 'email', 'is_admin']:
                new_dict[key] = value
        token = jwt.encode({'user': new_dict, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)}, current_app.config['SECRET_KEY'], algorithm='HS256')

        # send confirmation email
        service = get_gmail_service()
        user_id = 'me'
        subject = 'Motmir Account Confirmation'
        body = f"""\
            Hello {new_dict['username']},
            Please confirm your account by clicking in the link below
            {getenv('FRONTEND_BASE_URL')}confirm_account/{token}
        """
        
        msg = create_gmail_message(data['email'],
                                   subject,
                                   body)

        send_gmail_message(service, user_id, msg)
        
        return jsonify({'message': 'new user created!'})
    
    except Exception as error:
        print(error)
        try:
            storage.delete(new_user)
        except Exception as err:
            print(err)
            return make_response(jsonify({'status': 500, 'message': 'Something went wrong. try again later! UDF'}), 500)
        return make_response(jsonify({'status': 500, 'message': 'Something went wrong. try again later'}), 500)

@auth_views.route('/login', methods=['GET'], strict_slashes=False)
def login():
    '''login method'''
    auth = request.authorization

    if not auth or not auth.username or not auth.password:
        return jsonify({'message': 'Could not verify', 'WWW-Authenticate': 'Basic realm="Login required!"'}), 401
    try:
        user = storage.get_user(auth.username)

        if not user:
            # user not found
            return jsonify({'message': 'Wrong Password or Username', 'WWW-Authenticate': 'Basic realm="Login required!"'}), 401
        
        if user.status == 'pending':
            # user email not verified
            return jsonify(create_response('fail', {'verification': 'Email verification is Required. An email is sent to your Email Address.'})), 401

        if bcrypt.check_password_hash(user.password, auth.password):
            user_dict = user.to_dict()
            new_dict = {}
            for key,value in user_dict.items():
                if key in ['username', 'email', 'is_admin']:
                    new_dict[key] = value

            remember = request.headers.get('x-remember', None)
            if remember and remember == 'true':
                token = jwt.encode({'user': new_dict, 'exp': datetime.datetime.utcnow() + datetime.timedelta(days=30)}, current_app.config['SECRET_KEY'], algorithm='HS256')
            else:
                token = jwt.encode({'user': new_dict, 'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=120)}, current_app.config['SECRET_KEY'], algorithm='HS256')

            return jsonify({'token' : token})
        # wrong password
        return jsonify({'message': 'Wrong Password or Username', 'WWW-Authenticate': 'Basic realm="Login required!"'}), 401
    except Exception as e:
        print(e)
        abort(500, description='Something went wrong. try again later')

@auth_views.route('/confirm_account/<token>', methods=['GET'], strict_slashes=False)
def confirm_account(token=None):
    '''confirms user's account by changing users status from pending to confirmed
    if token is valid
    '''
    if token is None:
        return jsonify(create_response('fail', data={'token': 'Token Required To confirm Account'})), 400
    
    try:
        # check if token is valid
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])

    except Exception as e:
        # token is invalid
        print(e)
        return jsonify(create_response('error', error='Token is invalid')), 401
    
    try:
        # check if user exist
        current_user = storage.get_user(data['user']['username'])
        if not current_user:
            return jsonify(create_response('fail', data={'token': 'Token is invalid'})), 401
        
    except Exception as e:
        # failed to get user from storage
        return jsonify(create_response('error', error='Confirmation Failed!')), 500
        
    try:
        # update user's status
        current_user.status = 'confirmed'
        current_user.save()
        return jsonify(create_response('success', data={'account': 'Account Confirmed'})), 200

    except Exception as e:
        # failed to save user status
        return jsonify(create_response('error', error='Confirmation Failed!')), 500
