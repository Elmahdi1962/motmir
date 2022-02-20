#!/usr/bin/python3
""" Blueprint for API """
from flask import Blueprint

app_views = Blueprint('app_views', __name__, url_prefix='/api/')
auth_views = Blueprint('auth_views', __name__, url_prefix='/user/')

from api.views.products import *
from api.views.orders import *
from api.views.orders_details import *
from api.views.users_details import *
from api.views.images import *
from api.views.admin import *

# auth_views
from api.views.authentication import *
