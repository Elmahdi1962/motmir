#!/usr/bin/python3
""" methods that handle all default RestFul API actions for Order """
from api.app import storage
from api.utils.auth_utils import token_required
from models.order import Order
from models.order_details import OrderDetails
from models.user_details import UserDetails
from api.views import app_views
from flask import jsonify, request, abort, make_response
from sys import stderr
import sys
from sqlalchemy.exc import IntegrityError
from api.utils.auth_utils import token_required


classes = {'Order': Order, 'OrderDetails': OrderDetails, 'UserDetails': UserDetails}


@app_views.route('/orders', methods=['GET'], strict_slashes=False)
@token_required
def get_orders(current_user):
    """
    Retrieves the list of all available orders
    """
    # check if user is admin
    if current_user.is_admin:
        # return all orders
        all_orders = storage.all(Order).values()
        list_orders = []
        for order in all_orders:
            dct = order.to_dict()
            list_orders.append(dct)
        return jsonify(list_orders)
    
    # if not admin
    else:
        # return only user's orders
        orders = storage.get_user_orders(current_user.username)
        if orders is None:
            abort(404, description='User not found')

        return jsonify(orders)


@app_views.route('/orders/<id>', methods=['GET'], strict_slashes=False)
@token_required
def get_order_with_id(current_user, id=None):
    """
    Retrieves the order with the id
    """
    # check if id is valid
    if id is None or id == '' or len(id) <= 0 or type(id) is not str:
        return make_response(jsonify({'error': 'the passed id is not of valid type'}), 400)

    # check if user is admin
    if current_user.is_admin:
        # run a query on Order class and compare id with the wanted one
        order = Order.query().filter(Order.id == id).first()

        # if found
        if order:
            return jsonify(order.to_dict())
        
        # if not found
        else:
            return make_response(jsonify({'error': 'order not found'}), 400)

    else:
        orders = storage.get_user_orders(current_user.username)
        # if user not found
        if orders is None:
            abort(404, description='User not Found')

        wanted_order = None
        for order in orders:
            if order.id == id:
                wanted_order = order
                break 
        # if wanted order found
        if wanted_order is not None:
            return jsonify({'order': wanted_order})
        # if wanted order not found
        return abort(404, description='order not found.')

@app_views.route('/orders/<id>', methods=['PUT'], strict_slashes=False)
@token_required
def update_order_with_id(current_user, id=None):
    """
    Update the order with the id
    """
    # check if user is admin
    if not current_user.is_admin:
        abort(401, description='Not Allowed.')

    #get request body
    body = request.get_json()

    # if body is not json
    if body is None:
        return make_response(jsonify({'error': 'Data is Not JSON'}), 400)

    # check if id is valid
    if id is None or id == '' or len(id) <= 0 or type(id) is not str:
        return make_response(jsonify({'error': 'the passed id is not of valid type'}), 400)

    # run a query on Order class and compare id with the wanted one
    order = Order.query().filter(Order.id == id).first()

    # if found
    if order:
        # set new values
        for key, value in body.items():
            if key not in ['__class__', 'created_at', 'updated_at', 'id']:
                    setattr(order, key, value)
        storage.save()
        # return 200 response
        return make_response(jsonify({'status': 'order updated successfully'}), 200)

    # if not found
    else:
        return make_response(jsonify({'error': 'order not found'}), 400)


@app_views.route('/shipping_cost', methods=['POST'], strict_slashes=False)
@token_required
def calculate_shipping_cost(current_user):
    '''calculates the shipping cost depends on the client's distination'''
    data = request.get_json()
    # check if data is not none and if data in right format 
    if not data:
        return jsonify({'status': 400, 'message': 'No Data or Not Json'}), 400

    user_details = current_user.user_details

    # check if user has shipping details
    if not user_details:
        return jsonify({'status': 401, 'message': 'User has no shipping details saved.'}), 401
    
    # if he is from morocco
    if user_details.country.lower() == 'morocco' or user_details.country.lower() == 'maroc':
        return jsonify({'status': 200, 'shipping_cost': 6 * data['quantity']}), 200
    # if he is not from morocco
    else:
        return jsonify({'status': 200, 'shipping_cost': 15 * data['quantity']}), 200
