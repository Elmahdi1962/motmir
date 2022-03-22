import jwt
from functools import wraps
from flask import jsonify, request
from api.app import storage, app

def token_required(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = None
        
        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']
            
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = storage.get_user(data['user']['username'])
            if not current_user:
                return jsonify({'message': 'Token is invalid UNF'}), 401
        except Exception as e:
            print(e)
            return jsonify({'message': 'Token is invalid'}), 401
        
        return func(current_user, *args, **kwargs)
    
    return decorated
