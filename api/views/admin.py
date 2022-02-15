#!/usr/bin/python3
""" objects that handle all default RestFul API actions for admin panel """

from api.views import app_views
from flask import abort, render_template


@app_views.route('/admin/<int:password>', methods=['GET'])
def admin_panel(password=''):
    '''renders admin panel template'''
    if password != 1962:
        abort(404)
    return render_template('admin_panel.html')
