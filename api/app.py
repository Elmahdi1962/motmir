#!/usr/bin/python3
""" Flask Application """

from dotenv import load_dotenv
load_dotenv()

from api.views import app_views
from os import environ
from flask import Flask, render_template, make_response, jsonify
from flask_cors import CORS
from models.product import Product
import pathlib, os
from api.config import *
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from models import storage
from models.user import User

app = Flask(__name__)
bcrypt = Bcrypt(app)

if app.config['ENV'] == 'production':
    app.config.from_object(ProductionConfig)
else:
    app.config.from_object(DevelopmentConfig)

app.config['SECRET_KEY'] = 'e8d623e7c9988114bfa39f27fc4cf9c8'
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.config['IMAGE_STORAGE_PATH'] = os.path.join(pathlib.Path(__file__).parent.resolve(), 'static/images')
app.config['ALLOWED_IMAGE_EXT'] = ['png', 'jpg', 'jpeg']
app.register_blueprint(app_views)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

# login manager
login_manager = LoginManager(app)
login_manager.login_view = 'app_views.admin_login'
login_manager.login_message_category = 'info'

@login_manager.user_loader
def load_user(user_id):
    from api.app import storage
    return storage.get(User, user_id)


@app.route('/')
def home():
    for name in ['aziza', 'bofakous', '3asian', 'majhoul', 'aziza manzou', 'lbalah', 'lahmira']:
        product = Product(name=name,
                        price='15',
                        organic=0,
                        description=f'{name} is a date originated from figuig')
        product.save()

    return 'created products Successfully'

@app.teardown_appcontext
def close_db(error):
    """ Close Storage """
    storage.close()


@app.errorhandler(404)
def not_found(error):
    """ 404 Error
    ---
    responses:
      404:
        description: a resource was not found
    """
    if error:
        return make_response(jsonify({'error': error.description}), 404)
    return make_response(jsonify({'error': "Not found"}), 404)


if __name__ == "__main__":
    """ Main Function """
    host = environ.get('API_HOST', '0.0.0.0')
    port = environ.get('API_PORT', '5000')
    app.run(host=host, port=port, threaded=True)
