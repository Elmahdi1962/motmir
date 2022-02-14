#!/usr/bin/python3
""" Flask Application """
from models import storage
from api.views import app_views
from os import environ
from flask import Flask, render_template, make_response, jsonify
from flask_cors import CORS
from models import order_details
from models.order import Order
from models.order_details import OrderDetails
from models.product import Product

from models.user_details import UserDetails


app = Flask(__name__)
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True
app.register_blueprint(app_views)
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

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
    return make_response(jsonify({'error': "Not found"}), 404)


if __name__ == "__main__":
    """ Main Function """
    host = environ.get('API_HOST', '0.0.0.0')
    port = environ.get('API_PORT', '5000')
    app.run(host=host, port=port, threaded=True)
