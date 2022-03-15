#!/usr/bin/python3
""" objects that handle all default RestFul API actions for products """

from models import storage
from models.product import Product
from api.views import app_views
from flask import abort, jsonify, make_response, redirect, request, current_app, url_for, flash
from werkzeug.utils import secure_filename
from api.utils.auth_utils import token_required
from sys import stderr
from api.app import imagekit
import sys, os


@app_views.route('/products', methods=['GET'], strict_slashes=False)
def get_products():
    """
    Retrieves the list of all product objects
    """
    all_products = storage.all('Product').values()
    list_products = []
    for product in all_products:
        new_dct = {}
        dct = product.to_dict()
        for key in dct.keys():
            if key not in ['created_at', 'updated_at']:
                new_dct[key] = dct[key]

        list_products.append(new_dct)
    return jsonify(list_products)

@app_views.route('/products/full', methods=['GET'], strict_slashes=False)
@token_required
def get_products_full(current_user):
    """
    Retrieves the list of all product objects with full details for admins only
    """
    # check if user is admin or not
    if not current_user.is_admin:
        abort(401, description='Not allowed')

    all_products = storage.all('Product').values()
    list_products = []
    for product in all_products:
        dct = product.to_dict()
        list_products.append(dct)
    return jsonify(list_products)


@app_views.route('/products/<id>', methods=['GET'], strict_slashes=False)
@token_required
def get_product_with_id(current_user, id=None):
    """
    Retrieves the product with the id
    """
    # check if user is admin or not
    if not current_user.is_admin:
        abort(401, description='Not allowed')

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


def allowed_image(image):
    '''checks if an image is allowed'''
    if '.' not in image.filename:
        return False

    if image.filename.rsplit('.', 1)[1] not in current_app.config['ALLOWED_IMAGE_EXT']:
        return False

    return True


@app_views.route('/products/<product_id>', methods=['PUT'], strict_slashes=False)
@token_required
def update_product_with_id(current_user, product_id=None):
    """
    Update the product with the id
    """
    # check if user is admin or not
    if not current_user.is_admin:
        abort(401, description='Not allowed')

    data = dict(request.form)

    if not data or type(data) is not dict:
        return jsonify({'status': 400, 'message': 'No data received or Not a Form'}), 400

    image = request.files['img_name']
    # check filename is not empty
    if image.filename == '':
        return make_response(jsonify({'error': 'image file name should not be empty'}), 400)
    # check if extention is allowed
    if not allowed_image(image):
        return make_response(jsonify({'error': 'image extention not allowed'}), 400)

    filename = secure_filename(image.filename)
    
    product = storage.get('Product', product_id)
    
    if not product:
        return jsonify({'status': 404, 'message': 'No product found with that id'}), 404
    
    # check if img file name alredy exist but not sam product
    dup_prod = storage._DBStorage__session.query(Product).filter(Product.img_name == filename).first()
    if dup_prod:
        if product.img_name != filename:
            return jsonify({'status': 409, 'message': 'Image file name already exist. Please rename it'}), 409

    # check if product name alredy exist but not same product
    dup_prod = storage._DBStorage__session.query(Product).filter(Product.name == data['name']).first()
    if dup_prod:
        if product.name != data['name']:
            return jsonify({'status': 409, 'message': 'Product name already exist. Please change it'}), 409


    # set new values
    for key, value in data.items():
        if key not in ['__class__', 'created_at', 'updated_at', 'id']:
            if key == 'organic':
                setattr(product, key, 1)
            else:
                setattr(product, key, value)
    # this one for updating organic since it's a checkbox type of input when not checked it doesn't get sent
    if 'organic' not in data.keys():
        setattr(product, 'organic', 0)

    # update image
    images = imagekit.list_files({"path": "images"})
    product_img_id = None
    print('images : ',images)
    for image in images:
        print('image ', image)
        if image['name'] == product.img_name:
            product_img_id = image['fileId']
            break

    if product_img_id:
        imagekit.delete_file(product_img_id)

    imagekit.upload_file(
            file= image, # required
            file_name= filename, # required
            options= {
                "folder" : "/images/",
                "tags": ["product-image"],
                "is_private_file": False,
                "use_unique_file_name": False,
            }
        )
    setattr(product, 'img_name', filename)
    product.save()

    return jsonify({'status': 200, 'message': 'product updated successfully'}), 200


@app_views.route('/products', methods=['POST'], strict_slashes=False)
@token_required
def add_product(current_user):
    """
    create a new product and store it in database
    """
    # check if user is admin or not
    if not current_user.is_admin:
        abort(401, description='Not allowed')

    data = dict(request.form)

    if not data or type(data) is not dict:
        abort(400, description='No data received or Not a Form')

    image = request.files['img_name']
    # check filename is not empty
    if image.filename == '':
        return make_response(jsonify({'error': 'image file name should not be empty'}), 400)
    # check if extention is allowed
    if not allowed_image(image):
        return make_response(jsonify({'error': 'image extention not allowed'}), 400)

    filename = secure_filename(image.filename)
    
    # check if img file name alredy exist
    dup_prod = storage._DBStorage__session.query(Product).filter(Product.img_name == filename).first()
    if dup_prod:
        return jsonify({'status': 409, 'message': 'Image file name already exist. Please rename it'}), 409
    # check if product name alredy exist
    dup_prod = storage._DBStorage__session.query(Product).filter(Product.name == data['name']).first()
    if dup_prod:
        return jsonify({'status': 409, 'message': 'Product name already exist. Please change it'}), 409

    organic = 0
    for k in data.keys():
        if k == 'organic':
            organic = 1

    try:
        # save image
        # img_path = os.path.join(current_app.config['IMAGE_STORAGE_PATH'], filename)
        # image.save(img_path)
        imagekit.upload_file(
            file= image, # required
            file_name= filename, # required
            options= {
                "folder" : "/images/",
                "tags": ["product-image"],
                "is_private_file": False,
                "use_unique_file_name": False,
            }
        )
        
        # create new product
        newproduct = Product(name=data['name'],
                             price=data['price'],
                             organic=organic,
                             description=data['description'],
                             img_name=filename)
        # save it to db
        newproduct.save()
    # if something went wrong this will catch it so it dosen't break the server
    except Exception as err:
        exc_type, exc_obj, exc_tb = sys.exc_info()
        print('the exception from products.py in POST route is  : \n', err, exc_type, exc_tb.tb_lineno, file=stderr)
        return make_response(jsonify({'status': 'Failed to Create Product in server level',
                                      'error': 'exception raised when trying to create a product '}), 500)
    return jsonify({'status': 201, 'message': 'product created successfully'}), 201

@app_views.route('/products/<id>', methods=['DELETE'], strict_slashes=False)
@token_required
def delete_product(current_user, id):
    """
    Deletes a product by id
    """
    # check if user is admin or not
    if not current_user.is_admin:
        abort(401, description='Not allowed')
    try:
        product = storage.get('Product', id)
        if product:
            storage.delete(product)
            storage.save()
            return make_response('deleted successfuly!', 200)
        else:
            return abort(400, description='Product deletion failed wrong id')
    except Exception as err:
        print('something wrong happened while trying to delete a product in products.py view file line 193')
        print('error is : ')
        print(err)
        return jsonify({'status': 500, 'message': 'Something went wrong in Server side.'}), 500
