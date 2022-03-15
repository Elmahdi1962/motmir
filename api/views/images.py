#!/usr/bin/python3
""" objects that handle all default RestFul API actions for images """

from shutil import ExecError
from api.views import app_views
from flask import abort, send_from_directory, current_app, make_response, send_file
from requests import get


@app_views.route('/images/<imagename>', methods=['GET'], strict_slashes=False)
def get_image(imagename=''):
    '''gets image with the name and sends it'''
    if imagename == '' or imagename is None:
        abort(400, 'no filename specified')

    try:
        from io import BytesIO
        r = get(current_app.config['IMAGE_STORAGE_URL'] + imagename)
        f = BytesIO(r.content)
        return send_file(f, mimetype=r.headers.get('mime-type'), download_name=imagename)
        # return send_from_directory(current_app.config['IMAGE_STORAGE_PATH'],
                            # imagename,
                            # as_attachment=False)
    except Exception as err:
        print(err)
        abort(404, description='image not found')
