#!/usr/bin/python3
""" methods that handle all default RestFul API actions for Order """

from models import storage
from models import order_details
from models.order import Order
from models.order_details import OrderDetails
from models.user_details import UserDetails
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
        dct = order.to_dict()
        dct['orders_details'] = [o.id for o in order.orders_details]
        list_orders.append(dct)
    return jsonify(list_orders)

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

@app_views.route('/users', methods=['GET'], strict_slashes=False)
def get_orders1():
    """
    Retrieves the list of all State objects
    """

    all_orders = storage.all(UserDetails).values()
    list_orders = []
    for order in all_orders:
        list_orders.append(order.to_dict())
    return jsonify(list_orders)
