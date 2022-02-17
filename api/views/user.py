#!/usr/bin/python3
""" objects that handle all default RestFul API actions for User registration and login """

from api.views import app
from flask import abort, render_template, url_for, flash, redirect
from api.forms import RegistrationForm, LoginForm

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        flash(f'Account created for {form.username.data}!', 'success')
        return redirect(url_for('app_views.admin_panel'))
    return render_template('register.html', title='Register', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if form.email.data == 'admin@blog.com' and form.password.data == 'passwordd':
            flash('You have been logged in!', 'success')
            redirect(url_for('app_views.admin_panel'))
        else:
            flash('login unsuccessful. Please check username and password', 'danger')
    return render_template('login.html', title='Login', form=form)
