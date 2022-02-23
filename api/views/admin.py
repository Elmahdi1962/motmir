#!/usr/bin/python3
""" objects that handle all default RestFul API actions for admin panel """

from api.views import app_views
from api.app import bcrypt, storage
from models.user import User
from models.product import Product
from models.order import Order
from flask import render_template, url_for, flash, redirect, request
from api.forms import LoginForm
from flask_login import login_user, current_user, logout_user, login_required


@app_views.route('/admin', methods=['GET'])
@login_required
def admin_panel():
    '''renders admin panel template'''
    return render_template('admin_panel_layout.html', count=storage.count)


@app_views.route('/admin/products', methods=['GET'])
@login_required
def admin_get_products():
    '''renders admin panel template'''
    products = storage.all(Product)
    return render_template('products.html', products=products.values(), count=storage.count)


@app_views.route('/admin/orders', methods=['GET'])
@login_required
def admin_get_orders():
    '''renders admin panel template'''
    orders = storage.all(Order)
    return render_template('orders.html', orders=orders.values(), count=storage.count)


@app_views.route('/admin/orders_details', methods=['GET'])
@login_required
def admin_get_orders_details():
    '''renders admin panel template'''

    return render_template('orders_details.html', orders_details=[0,0,0], count=storage.count)


@app_views.route('/admin/users_details', methods=['GET'])
@login_required
def admin_get_users_details():
    '''renders admin panel template'''

    return render_template('users_details.html', users_details=[0,0,0], count=storage.count)


@app_views.route('/admin/users', methods=['GET'])
@login_required
def admin_get_users():
    return render_template('users.html', title='Users', count=storage.count)


@app_views.route('/admin/login', methods=['GET', 'POST'])
def admin_login():
    if current_user.is_authenticated:
        return redirect(url_for('app_views.admin_panel'))
    form = LoginForm()
    if form.validate_on_submit():
        user = storage._DBStorage__session.query(User).filter(User.email == form.email.data).first()
        if user and bcrypt.check_password_hash(user.password, form.password.data):
            login_user(user, remember=form.remember.data)
            next_page = request.args.get('next')
            flash('You have been logged in!', 'success')
            return redirect(next_page) if next_page else redirect(url_for('app_views.admin_panel'))
        else:
            flash('login unsuccessful. Please check username and password', 'danger')
    return render_template('login.html', title='Login', form=form)


@app_views.route('/admin/logout')
def admin_logout():
    logout_user()
    return redirect(url_for('app_views.admin_panel'))
    
@app_views.route('/admin/account')
@login_required
def admin_account():
    return render_template('account.html', title='Account')
