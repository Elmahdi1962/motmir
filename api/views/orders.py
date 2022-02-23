#!/usr/bin/python3
""" methods that handle all default RestFul API actions for Order """
from api.app import storage
from models.order import Order
from models.order_details import OrderDetails
from models.user_details import UserDetails
from api.views import app_views
from flask import abort, jsonify, make_response, request
from flask_login import login_user, current_user, logout_user, login_required
from sys import stderr
import sys
from sqlalchemy.exc import IntegrityError
from api.utils.auth_utils import token_required


classes = {'Order': Order, 'OrderDetails': OrderDetails, 'UserDetails': UserDetails}


@app_views.route('/admin/orders', methods=['POST'], strict_slashes=False)
@login_required
def admin_add_order(current_user):
    """
    create a new order and store it in database for admin
    """
    if not current_user.is_admin:
        abort(401, description='Not allowed')
    if not request.get_json():
        abort(400, description='Not a JSON')

    data = request.get_json()
    

    models = []

    try:
        order = Order(total_quantity=data['total_quantity'],
                      total_price=data['total_price'],
                      payment_method=data['payment_method'],
                      shipping_cost=data['shipping_cost'],
                      user_id=current_user.id)
        models.append(order)

        '''userdetails = UserDetails(full_name=data['full_name'],
                                  email=data['email'],
                                  country=data['country'],
                                  city=data['city'],
                                  zip_code=data['zip_code'],
                                  state=data['state'],
                                  full_address=data['full_address'],
                                  phone_number=data['phone_number'],
                                  order_id=order.id)
        models.append(userdetails)'''

        t_price = 0
        t_quantity = 0
        for product in data['ordered_products']:
            t_price += product['total_price']
            t_quantity += product['quantity']
            orderdetails = OrderDetails(order_id=order.id,
                                        product_id=product['name'],
                                        quantity=product['quantity'],
                                        total_price=product['total_price'])
            models.append(orderdetails)
        if (t_price != data['total_price']):
            make_response(jsonify({'status': 'Failed to Place Order in server level',
                                   'error': 'total_price got from client not same as counted in server'}), 400)
        if (t_quantity != data['total_quantity']):
            make_response(jsonify({'status': 'Failed to Place Order in server level',
                                   'error': 'total_quantity got from client not same as counted in server'}), 400)

        for model in models:
            model.save()

    except IntegrityError as err:
        storage._DBStorage__session.rollback()
        for model in models:
            q = storage._DBStorage__session.query(classes[model.__class__.__name__]).filter(classes[model.__class__.__name__].id == model.id).first()
            if q:
                print('deleted : ', model)
                storage.delete(model)
        storage.save()

        exc_type, exc_obj, exc_tb = sys.exc_info()
        print('the exception error from orders.py in POST route is  : \n', err, exc_type, exc_tb.tb_lineno, file=stderr)
        return make_response(jsonify({'status': 'Failed to Place Order in server level',
                                      'error': 'exception raised when trying to place order sqlalchemy.exc..IntegrityError'}), 400)
    except Exception as err:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        print('the exception from orders.py in POST route is  : \n', err, exc_type, exc_tb.tb_lineno, file=stderr)
        return make_response(jsonify({'status': 'Failed to Place Order in server level',
                                      'error': 'exception raised when trying to place order '}), 400)
        
    return make_response(jsonify({'orderStatus': 'Successfully Placed Order'}), 201)



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

        return jsonify({'orders': orders})


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



@app_views.route('/orders', methods=['POST'], strict_slashes=False)
@token_required
def add_order(current_user):
    """
    create a new order and store it in database for clients
    """
    if not request.get_json():
        abort(400, description='Not a JSON')

    data = request.get_json()
    

    models = []

    try:
        order = Order(total_quantity=data['total_quantity'],
                      total_price=data['total_price'],
                      payment_method=data['payment_method'],
                      shipping_cost=data['shipping_cost'],
                      user_id=current_user.id)
        models.append(order)

        '''userdetails = UserDetails(full_name=data['full_name'],
                                  email=data['email'],
                                  country=data['country'],
                                  city=data['city'],
                                  zip_code=data['zip_code'],
                                  state=data['state'],
                                  full_address=data['full_address'],
                                  phone_number=data['phone_number'],
                                  order_id=order.id)
        models.append(userdetails)'''

        t_price = 0
        t_quantity = 0
        for product in data['ordered_products']:
            t_price += product['total_price']
            t_quantity += product['quantity']
            orderdetails = OrderDetails(order_id=order.id,
                                        product_id=product['name'],
                                        quantity=product['quantity'],
                                        total_price=product['total_price'])
            models.append(orderdetails)
        if (t_price != data['total_price']):
            make_response(jsonify({'status': 'Failed to Place Order in server level',
                                   'error': 'total_price got from client not same as counted in server'}), 400)
        if (t_quantity != data['total_quantity']):
            make_response(jsonify({'status': 'Failed to Place Order in server level',
                                   'error': 'total_quantity got from client not same as counted in server'}), 400)

        for model in models:
            model.save()

    except IntegrityError as err:
        storage._DBStorage__session.rollback()
        for model in models:
            q = storage._DBStorage__session.query(classes[model.__class__.__name__]).filter(classes[model.__class__.__name__].id == model.id).first()
            if q:
                print('deleted : ', model)
                storage.delete(model)
        storage.save()

        exc_type, exc_obj, exc_tb = sys.exc_info()
        print('the exception error from orders.py in POST route is  : \n', err, exc_type, exc_tb.tb_lineno, file=stderr)
        return make_response(jsonify({'status': 'Failed to Place Order in server level',
                                      'error': 'exception raised when trying to place order sqlalchemy.exc..IntegrityError'}), 400)
    except Exception as err:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        print('the exception from orders.py in POST route is  : \n', err, exc_type, exc_tb.tb_lineno, file=stderr)
        return make_response(jsonify({'status': 'Failed to Place Order in server level',
                                      'error': 'exception raised when trying to place order '}), 400)
        
    return make_response(jsonify({'orderStatus': 'Successfully Placed Order'}), 201)
