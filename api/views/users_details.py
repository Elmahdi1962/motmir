#!/usr/bin/python3
""" methods that handle all default RestFul API actions for UserDetails """

from models import storage
from models.user_details import UserDetails
from api.views import app_views
from flask import jsonify

@app_views.route('/usersdetails', methods=['GET'], strict_slashes=False)
def get_usersDetails():
    """
    Retrieves the list of all State objects
    """

    all_orders = storage.all(UserDetails).values()
    list_orders = []
    for order in all_orders:
        list_orders.append(order.to_dict())
    return jsonify(list_orders)