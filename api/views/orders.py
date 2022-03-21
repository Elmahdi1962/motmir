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
        all_orders = storage.all('Order').values()
        list_orders = []
        for order in all_orders:
            dct = order.to_dict()
            list_orders.append(dct)
        return jsonify(list_orders)
    
    # if not admin
    else:
        return jsonify({'status': 401, 'message': 'Not allowed'}), 401


@app_views.route('/orders/<id>', methods=['GET'], strict_slashes=False)
@token_required
def get_order_with_id(current_user, id=None):
    """
    Retrieves the order with the id
    but for none admin users it will return the order only
    if the order id is the id of one of the orders of the user
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
    Update the order with id with the attributes passed in the request
    """
    # check if user is admin
    if not current_user.is_admin:
        return jsonify({'status': 401, 'message': 'Not allowed'}), 401

    #get request data
    data = dict(request.form)

    # if data is not valid
    if not data or type(data) is not dict:
        return make_response(jsonify({'status': 400, 'message': 'No data received or Not a Form'}), 400)

    # check if id is valid
    if id is None or id == '' or len(id) <= 0 or type(id) is not str:
        return make_response(jsonify({'status': 400, 'message': 'the passed id is not of valid'}), 400)

    # get the order with the id
    order = storage.get('Order', id)

    try:
        # if found
        if order:
            # set new values
            for key, value in data.items():
                if key in ['paid', 'status']:
                    if key == 'paid':
                        setattr(order, key, 1)
                    else:
                        setattr(order, key, value)

            order.save()
            # return 200 response
            return jsonify({'status': 200, 'message': 'order updated successfully'}), 200

        # if not found
        else:
            return jsonify({'status': 404, 'message': 'order not found'}), 404
    except Exception as error:
        print('womething went wrong when trying to update a order in orders.py file PUT function line 106.')
        print(error)
        return jsonify({'status': 500, 'message': 'Somethign went wrong on server side while trying to update an order'}), 500


@app_views.route('/orders/<order_id>', methods=['DELETE'], strict_slashes=False)
@token_required
def delete_order(current_user, order_id=None):
    '''deletes an order with the id passed in the request '''
    
    # if user not an admin respond with 401
    if not current_user.is_admin:
        return jsonify({'status': 401, 'message': 'Not Allowed'}), 401
    
    # check if the id is not None
    if order_id is None:
        return jsonify({'status': 400, 'message': 'No id received!'}), 400
    
    # search for an order with that id
    order = storage.get('Order', order_id)
    # check if not found the order
    if order is None:
        return jsonify({'status': 404, 'message': 'No order found with that id'}), 404
    
    # try delete the order and save changes
    try:
        storage.delete(order)
        storage.save()
        return jsonify({'status': 200, 'message': 'Deleted order successfully.'}), 200
    except Exception as error:
        print('Error happened while trying to delete and order object from database. in orders.py file line 140')
        print(error)
        return jsonify({'status': 500, 'message': 'Something went wrong in server side while trying to delete the order'}), 500


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
