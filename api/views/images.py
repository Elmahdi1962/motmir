#!/usr/bin/python3
""" objects that handle all default RestFul API actions for images """

from shutil import ExecError
from api.views import app_views
from flask import abort, send_from_directory, current_app, make_response
from requests import get


@app_views.route('/images/<imagename>', methods=['GET'], strict_slashes=False)
def get_image(imagename=''):
    '''gets image with the name and sends it'''
    if imagename == '' or imagename is None:
        abort(400, 'no filename specified')

    try:
        from PIL import Image
        from io import BytesIO
        r = get('https://ik.imagekit.io/motmir/images/' + imagename)
        i = r.raw
        return make_response(i, headers={'Content-Type': r.headers['Content-Type']}), 200
        # return send_from_directory(current_app.config[IMAGE_STORAGE_PATH'],
                            # imagename,
                            # as_attachment=False)
    except Exception as err:
        print(err)
        abort(404, description='image not found')
