#!/usr/bin/python3
'''flask config'''

class Config(object):
    DEBUG = False
    TESTING = False

    MYSQL_USER = 'motmir_dev'
    MYSQL_PWD = 'motmir_pwd'
    MYSQL_HOST = 'localhost'
    MYSQL_DB = 'motmir_db'
    TYPE_STORAGE = 'db'
    MYSQL_ENV = 'prod'

    API_HOST = '0.0.0.0'
    API_PORT = '5000'


class ProductionConfig(Config):
    DEBUG = False
    Testing = False
    MYSQL_ENV = 'prod'


class DevelopmentConfig(Config):
    DEBUG = True
    Testing = True
    MYSQL_ENV = 'test'
