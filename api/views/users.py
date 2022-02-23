from api.views import app_views
from api.utils.auth_utils import token_required
from models.user import User
from api.app import bcrypt, storage
from flask import url_for, flash, redirect, jsonify



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


@app_views.route('/users', methods=['POST'])
@token_required
def add_user(current_user):

        return redirect(url_for('app_views.admin_get_users'))
