#!/usr/bin/python3
""" objects that handle all default RestFul API actions for States """

from models import storage
from models.product import Product
from api.views import app_views
from flask import abort, jsonify, make_response, request


@app_views.route('/products', methods=['GET', 'POST'], strict_slashes=False)
def get_products():
    """
    Retrieves the list of all State objects
    """
    if request.method == 'GET':
        all_products = storage.all(Product).values()
        list_products = []
        for product in all_products:
            dct = product.to_dict()
            dct['orders_details'] = [o.id for o in product.orders_details]
            list_products.append(dct)
        return jsonify(list_products)
    else:
        return jsonify({'status': 'posting products not implemented yet'})
