#!/usr/bin/python3
""" Flask Application """

from dotenv import load_dotenv
load_dotenv()

from os import environ
from flask import Flask, render_template, make_response, jsonify
from flask_cors import CORS
from models.product import Product
import pathlib, os
from api.config import *
from flask_bcrypt import Bcrypt
from models import storage
from models.user import User
from imagekitio import ImageKit


imagekit = ImageKit(
    private_key='private_jNliRzpQ4Q8UWtFlGWFZWq5QcCk=',
    public_key='public_nzu98T+T43IzjgA81gfxQh5gRCg=',
    url_endpoint = 'https://ik.imagekit.io/motmir'
)

app = Flask(__name__)
bcrypt = Bcrypt(app)

from api.views import app_views
from api.views import auth_views

if app.config['ENV'] == 'production':
    app.config.from_object(ProductionConfig)
else:
    app.config.from_object(DevelopmentConfig)

app.config['SECRET_KEY'] = 'e8d623e7c9988114bfa39f27fc4cf9c8'
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.config['IMAGE_STORAGE_PATH'] = os.path.join(pathlib.Path(__file__).parent.resolve(), 'static/images')
app.config['ALLOWED_IMAGE_EXT'] = ['png', 'jpg', 'jpeg']
app.register_blueprint(app_views)
app.register_blueprint(auth_views)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/')
def home():
    return "Welcome to Motmir Api ('^')"

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
