from api.views import app_views
from api.utils.auth_utils import token_required
from models.user_details import UserDetails
from models.order import Order
from models.order_details import OrderDetails
from api.app import storage
from flask import jsonify, request
from sys import stderr
import sys
from sqlalchemy.exc import IntegrityError


classes = {'Order': Order, 'OrderDetails': OrderDetails}


@app_views.route('/users', methods=['GET'], strict_slashes=False)
@token_required
def get_users(current_user):
    """
    Retrieves the list of all users
    return:
        list of dicts that present each user
    """
    # check if user is admin
    if current_user.is_admin:
        # return all users
        all_users = storage.all('User').values()
        list_users = []
        for user in all_users:
            dct = user.to_dict()
            list_users.append(dct)
        return jsonify(list_users)
    else:
        return jsonify({'status': 401, 'message': 'Not allowed'}), 401


@app_views.route('/user/orders', methods=['GET'], strict_slashes=False)
@token_required
def get_user_orders(current_user):
    '''returns a list of users's orders'''
    orders = storage.get_user_orders(current_user.username)
    if orders is None:
        return jsonify({'status': 404, 'message':'User Not Found'}), 404

    return jsonify(orders), 200


@app_views.route('/user/user_details', methods=['GET'], strict_slashes=False)
@token_required
def get_user_details(current_user):
    '''returns user details of the current user'''
    user_details = current_user.user_details
    if user_details:
        return jsonify({'status': 200, 'data': user_details.to_dict()}), 200
    else:
        return jsonify({'status': 404, 'message': 'User has no details saved'}), 404


@app_views.route('/user/user_details', methods=['POST', 'PUT'], strict_slashes=False)
@token_required
def add_update_user_details(current_user):
    """
    add or update usersdetails to current user
    """
    data = request.get_json()
    if not data:
        return jsonify({'status': 400, 'message': 'No data received or not Json'}), 400

    try:
        # define UserDetails object with the new details
        new_details = UserDetails(full_name=data['full_name'],
                                  country=data['country'],
                                  city=data['city'],
                                  zip_code=data['zip_code'],
                                  state=data['state'],
                                  full_address=data['full_address'],
                                  phone_number=data['phone_number'],
                                  user_id=current_user.id)
        # delete old details
        user_details = current_user.user_details
        if user_details:
            storage.delete(user_details)
        
        # save new details
        storage.new(new_details)
        storage.save()
        
        return jsonify({'status': 200, 'message': 'User details updated successfully.', 'data': new_details.to_dict()}), 200
    except:
        print('something wrong happened while trying to update user details in users_details.py try block line 41')
        return jsonify({'status': 500, 'message': 'Something wrong happened while trying to update your details'}), 500


@app_views.route('/user/order', methods=['POST'], strict_slashes=False)
@token_required
def add_user_order(current_user):
    """
    create a new order for current user and store it in database
    """
    if not request.get_json():
        return jsonify({'status': 400, 'message': 'Not Json'}), 400

    data = request.get_json()

    models = []

    try:
        order = Order(total_quantity=data['total_quantity'],
                      total_price=data['total_price'],
                      payment_method=data['payment_method'],
                      shipping_cost=data['shipping_cost'],
                      user_id=current_user.id)
        models.append(order)

        t_price = 0
        t_quantity = 0
        for product in data['ordered_products']:
            t_price += product['price'] * product['quantity']
            t_quantity += product['quantity']
            orderdetails = OrderDetails(order_id=order.id,
                                        product_id=product['id'],
                                        quantity=product['quantity'],
                                        total_price=product['price'] * product['quantity'])
            models.append(orderdetails)

        if (t_price != data['total_price']):
            jsonify({'status': 'Failed to Place Order in server level',
                     'error': 'total_price got from client not same as counted in server'}), 400

        if (t_quantity != data['total_quantity']):
            jsonify({'status': 'Failed to Place Order in server level',
                     'error': 'total_quantity got from client not same as counted in server'}), 400

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
        return jsonify({'status': 'Failed to Place Order in server level',
                        'error': 'exception raised when trying to place order sqlalchemy.exc..IntegrityError'}), 400

    except Exception as err:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        print('the exception from users.py in POST route is  : \n', err, exc_type, exc_tb.tb_lineno, file=stderr)
        return jsonify({'status': 'Failed to Place Order in server level',
                        'error': 'exception raised when trying to place order '}), 400
        
    return jsonify({'status': 'Successfully Placed Order'}), 201
