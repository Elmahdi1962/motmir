#!/usr/bin/python3
""" objects that handle all default RestFul API actions for products """

from math import prod
from models import storage
from models.product import Product
from api.views import app_views
from flask import abort, jsonify, make_response, redirect, request, current_app, url_for, flash
from werkzeug.utils import secure_filename
from sys import stderr
import sys, os


@app_views.route('/products', methods=['GET'], strict_slashes=False)
def get_products():
    """
    Retrieves the list of all product objects
    """
    all_products = storage.all(Product).values()
    list_products = []
    for product in all_products:
        dct = product.to_dict()
        list_products.append(dct)
    return jsonify(list_products)


@app_views.route('/products/<id>', methods=['GET'], strict_slashes=False)
def get_product_with_id(id=None):
    """
    Retrieves the product with the id
    """
    # check if id is valid
    if id is None or id == '' or len(id) <= 0 or type(id) is not str:
        return make_response(jsonify({'error': 'the passed id is not of valid type'}), 400)

    # run a query on Product class and compare id with the wanted one
    product = Product.query().filter(Product.id == id).first()

    # if found
    if product:
        return jsonify(product.to_dict())
    
    # if not found
    else:
        return make_response(jsonify({'error': 'product not found'}), 400)


@app_views.route('/products/<id>', methods=['PUT'], strict_slashes=False)
def update_product_with_id(id=None):
    """
    Update the product with the id
    """
    #get request body
    body = request.get_json()

    # if body is not json
    if body is None:
        return make_response(jsonify({'error': 'Data is Not JSON'}), 400)

    # check if id is valid
    if id is None or id == '' or len(id) <= 0 or type(id) is not str:
        return make_response(jsonify({'error': 'the passed id is not of valid type'}), 400)

    # run a query on Order class and compare id with the wanted one
    product = Product.query().filter(Product.id == id).first()

    # if found
    if product:
        # set new values
        for key, value in body.items():
            if key not in ['__class__', 'created_at', 'updated_at', 'id']:
                    setattr(product, key, value)
        storage.save()
        # return 200 response
        return make_response(jsonify({'status': 'product updated successfully'}), 200)

    # if not found
    else:
        return make_response(jsonify({'error': 'product not found'}), 400)


def allowed_image(image):
    '''checks if an image is allowed'''
    if '.' not in image.filename:
        return False

    if image.filename.rsplit('.', 1)[1] not in current_app.config['ALLOWED_IMAGE_EXT']:
        return False

    return True


@app_views.route('/products', methods=['POST'], strict_slashes=False)
def add_product():
    """
    create a new product and store it in database
    """
    data = dict(request.form)
    if not data or type(data) is not dict:
        abort(400, description='Not a JSON')

    image = request.files['image']
    # check filename is not empty
    if image.filename == '':
        make_response(jsonify({'error': 'image file name should not be empty'}), 400)
    # check if extention is allowed
    if not allowed_image(image):
        make_response(jsonify({'error': 'image extention not allowed'}), 400)

    filename = secure_filename(image.filename)
    organic = 0
    for k in data.keys():
        if k == 'organic':
            organic = 1

    try:
        # save image
        img_path = os.path.join(current_app.config['IMAGE_STORAGE_PATH'], filename)
        image.save(img_path)
        # create new product
        newproduct = Product(name=data['name'],
                             price=data['price'],
                             organic=organic,
                             description=data['description'],
                             img_url=filename)
        # save it to db
        newproduct.save()
    # if something went wrong this will catch it so it dosen't break the server
    except Exception as err:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        print('the exception from products.py in POST route is  : \n', err, exc_type, exc_tb.tb_lineno, file=stderr)
        return make_response(jsonify({'status': 'Failed to Crate Product in server level',
                                      'error': 'exception raised when trying to create a product '}), 400)
    flash('Created Product Successfully', 'success')
    return redirect(url_for('app_views.admin_get_products'))

@app_views.route('/products/delete/<id>', methods=['POST'], strict_slashes=False)
def delete_product(id):
    """
    Retrieves the list of all product objects
    """
    product = storage.get(Product, id)
    if product:
        storage.delete(product)
        storage.save()
        return make_response('deleted successfuly!', 200)
    else:
        return abort(400, description='Product deletion failed wrong id')
