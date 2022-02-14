#!/usr/bin/python3
""" methods that handle all default RestFul API actions for Order """

from models import storage
from models.order import Order
from models.order_details import OrderDetails
from models.user_details import UserDetails
from api.views import app_views
from flask import abort, jsonify, make_response, request


@app_views.route('/orders', methods=['GET'], strict_slashes=False)
def get_orders():
    """
    Retrieves the list of all available orders
    """

    all_orders = storage.all(Order).values()
    list_orders = []
    for order in all_orders:
        dct = order.to_dict()
        dct['orders_details'] = [o.id for o in order.orders_details]
        list_orders.append(dct)
    return jsonify(list_orders)


@app_views.route('/orders', methods=['Post'], strict_slashes=False)
def add_orders():
    """
    create a new order and store it in database
    """
    if not request.get_json():
        abort(400, description='Not a JSON')

    data = request.get_json()
    models = []

    try:
        order = Order(total_quantity=data['total_quantity'],
                      total_price=data['total_price'],
                      payment_method=data['payment_method'])
        models.append(order)

        userdetails = UserDetails(full_name=data['full_name'],
                                  email=data['email'],
                                  country=data['country'],
                                  city=data['city'],
                                  zip_code=data['zip_code'],
                                  state=data['state'],
                                  full_address=data['full_address'],
                                  phone_number=data['phone_number'],
                                  order_id=order.id)
        models.append(userdetails)

        t_price = 0
        t_quantity = 0
        for product in data['ordered_products']:
            t_price += product.total_price
            t_quantity += product.quantity
            orderdetails = OrderDetails(order_id=order.id,
                                        product_id=product.id,
                                        quantity=product.quantity,
                                        total_price=product.total_price)
            models.append(orderdetails)
        if (t_price != data['total_amount']):
            make_response(jsonify({'orderStatus': 'Failed to Place Order in server level',
                                   'error': 'total_price got from client not same as counted in server'}), 400)
        if (t_quantity != data['total_quantity']):
            make_response(jsonify({'orderStatus': 'Failed to Place Order in server level',
                                   'error': 'total_quantity got from client not same as counted in server'}), 400)
        
        for model in models:
            model.save()
    except Exception:
        return make_response(jsonify({'orderStatus': 'Failed to Place Order in server level',
                                      'error': 'exception raised when trying to place order'}), 400)
        
    return make_response(jsonify({'orderStatus': 'Successfully Placed Order'}), 201)
