#!/usr/bin/python3
""" methods that handle all default RestFul API actions for Order """

from models import storage
from models.order import Order
from api.views import app_views
from flask import abort, jsonify, make_response, request


@app_views.route('/orders', methods=['GET'], strict_slashes=False)
def get_orders():
    """
    Retrieves the list of all State objects
    """

    all_orders = storage.all(Order).values()
    list_orders = []
    for order in all_orders:
        list_orders.append(order.to_dict())
    return jsonify(list_orders)
