#!/usr/bin/python3
""" methods that handle all default RestFul API actions for OrderDetails """

from models import storage
from models.order_details import OrderDetails
from api.views import app_views
from flask import jsonify
from api.utils.auth_utils import token_required

@app_views.route('/orders_details', methods=['GET'], strict_slashes=False)
@token_required
def get_orders_details(current_user):
    """
    Retrieves the list of all OrderDetails objects or rows in the table
    """
    if not current_user.is_admin:
        return jsonify({'status': 401, 'message': 'Not Allowed'})

    all_orders_details = storage.all('OrderDetails').values()
    list_orders_details = []
    for order_detail in all_orders_details:
        list_orders_details.append(order_detail.to_dict())
    return jsonify(list_orders_details)
