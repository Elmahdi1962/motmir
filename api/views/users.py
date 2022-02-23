from api.views import app_views
from api.forms import RegistrationForm
from models.user import User
from flask_login import login_required
from api.app import bcrypt, storage
from flask import url_for, flash, redirect, jsonify



@app_views.route('/orders', methods=['GET'], strict_slashes=False)
@login_required
def get_orders(current_user):
    """
    Retrieves the list of all available orders
    """
    # check if user is admin
    if current_user.is_admin:
        # return all orders
        all_orders = storage.all(User).values()
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


@app_views.route('/users', methods=['POST'])
@login_required
def add_user():
    form = RegistrationForm()
    if form.validate_on_submit():
        if storage._DBStorage__session.query(User).filter(User.username==form.username.data).first():
            flash(f'Username Already Exist!', 'danger')
            return redirect(url_for('app_views.admin_get_users'))
        if storage._DBStorage__session.query(User).filter(User.username==form.email.data).first():
            flash(f'Email Already Exist!', 'danger')
            return redirect(url_for('app_views.admin_get_users'))

        hashed_password = bcrypt.generate_password_hash(form.password.data).decode('utf-8')
        user = User(username=form.username.data, email=form.email.data, password=hashed_password)
        user.save()
        flash(f'Account created for {form.username.data}!', 'success')
        return redirect(url_for('app_views.admin_get_users'))
