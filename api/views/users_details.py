#!/usr/bin/python3
""" methods that handle all default RestFul API actions for UserDetails """

from models import storage
from models.user_details import UserDetails
from api.views import app_views
from flask import jsonify, request
from api.utils.auth_utils import token_required

@app_views.route('/users_details', methods=['GET'], strict_slashes=False)
@token_required
def get_users_details(current_user):
    """
    Retrieves the list of all usersdetails objects
    """
    if current_user.is_admin:
        all_orders = storage.all('UserDetails').values()
        list_orders = []
        for order in all_orders:
            list_orders.append(order.to_dict())
        return jsonify(list_orders)
    
    else:
        user_details = current_user.user_details
        if user_details:
            return jsonify(user_details.to_dict())
        else:
            return jsonify({'status': 404, 'message': 'User has no details saved'}), 404
        

@app_views.route('/users_details', methods=['POST', 'PUT'], strict_slashes=False)
@token_required
def add_update_users_details(current_user):
    """
    add or update usersdetails to current user
    """
    data = request.json()
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
        
        return jsonify({'status': 200, 'message': 'User details updated successfully.'}), 200
    except:
        print('something wrong happened while trying to update user details in users_details.py try block line 41')
        return jsonify({'status': 500, 'message': 'Something wrong happened while trying to update your details'}), 500
