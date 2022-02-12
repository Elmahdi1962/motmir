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
    userdetails = UserDetails(full_name='elmahdi mamoun',
                              country='morocco',
                              city='figuig',
                              code_postal=61000,
                              province='oriental',
                              full_address='bv mohamed V zenaga',
                              phone_number='+212682826906')
    product = Product(name='aziza',
                      price='15',
                      organic=0,
                      description='aziza is a unique date that exists only in figuig')
    orderdetails = OrderDetails(product=product,
                                quantity=5,
                                unit_price=product.price)
    orderdetails2 = OrderDetails(product=product,
                                quantity=1,
                                unit_price=product.price)
    order = Order(total_quantity=6,
                  total_amount=90,
                  orders_details=[orderdetails, orderdetails2],
                  user_details=userdetails)
    userdetails.save()
    product.save()
    orderdetails.save()
    order.save()
    return 'created objects'

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
