#!/usr/bin/python3
""" methods that handle all default RestFul API actions for OrderDetails """

from models import storage
from models.order_details import OrderDetails
from api.views import app_views
from flask import jsonify

@app_views.route('/orders_details', methods=['GET'], strict_slashes=False)
def get_orders2():
    """
    Retrieves the list of all State objects
    """

    all_orders = storage.all(OrderDetails).values()
    list_orders = []
    for order in all_orders:
        list_orders.append(order.to_dict())
    return jsonify(list_orders)