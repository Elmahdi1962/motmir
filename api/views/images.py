#!/usr/bin/python3
""" objects that handle all default RestFul API actions for images """

from api.views import app_views
from flask import abort, send_from_directory




@app_views.route('/images/<imagename>', methods=['GET'], strict_slashes=False)
def get_image(imagename=''):
    '''gets image with the name and sends it'''
    if imagename == '' or imagename is None:
        abort(400, 'no filename specified')

    try:
        send_from_directory(app_views.config['IMAGE_STORAGE_PATH'],
                            filename=imagename,
                            as_attachment=False)
    except:
        abort(404, 'image not found')
