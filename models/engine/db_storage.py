#!/usr/bin/python3
"""
Contains the class DBStorage
"""

import models
from models.base_model import BaseModel, Base
from models.order import Order
from models.product import Product
from models.user_details import UserDetails
from models.order_details import OrderDetails
from models.user import User
from os import getenv

from sqlalchemy import create_engine
from sqlalchemy.orm import scoped_session, sessionmaker

classes = {"Order": Order, "Product": Product, "UserDetails": UserDetails,
           "OrderDetails": OrderDetails, "User": User}


class DBStorage:
    """interaacts with the MySQL database"""
    __engine = None
    __session = None

    def __init__(self):
        """Instantiate a DBStorage object"""
        MYSQL_USER = getenv('MYSQL_USER')
        MYSQL_PWD = getenv('MYSQL_PWD')
        MYSQL_HOST = getenv('MYSQL_HOST')
        MYSQL_DB = getenv('MYSQL_DB')
        MYSQL_ENV = getenv('MYSQL_ENV')
        self.__engine = create_engine('mysql+mysqldb://{}:{}@{}/{}'.
                                      format(MYSQL_USER,
                                             MYSQL_PWD,
                                             MYSQL_HOST,
                                             MYSQL_DB))
        if MYSQL_ENV == "test":
            try:
                for tbl in reversed(Base.metadata.sorted_tables):
                    self.__engine.execute(tbl.delete())
            except:
                print('Error happened in db_storage.py when deleting tables')
            '''
            if self.__engine.dialect.has_table(self.__engine.connect(), OrderDetails):
                Base.metadata.tables['orders_details'].__table__.drop(self.__engine)
            if self.__engine.dialect.has_table(self.__engine.connect(), Product):
                Base.metadata.tables['products'].__table__.drop(self.__engine)
            if self.__engine.dialect.has_table(self.__engine.connect(), UserDetails):
                Base.metadata.tables['users_details'].__table__.drop(self.__engine)
            if self.__engine.dialect.has_table(self.__engine.connect(), Order):
                Base.metadata.tables['orders'].__table__.drop(self.__engine)
            if self.__engine.dialect.has_table(self.__engine.connect(), User):
                Base.metadata.tables['users'].__table__.drop(self.__engine)
            #Base.metadata.drop_all(self.__engine)'''

    def all(self, cls=None):
        """query on the current database session"""
        new_dict = {}
        for clss in classes:
            if cls is None or cls is classes[clss] or cls is clss:
                objs = self.__session.query(classes[clss]).all()
                for obj in objs:
                    key = obj.__class__.__name__ + '.' + obj.id
                    new_dict[key] = obj
        return (new_dict)

    def new(self, obj):
        """add the object to the current database session"""
        self.__session.add(obj)

    def save(self):
        """commit all changes of the current database session"""
        self.__session.commit()

    def delete(self, obj=None):
        """delete from the current database session obj if not None"""
        if obj is not None:
            self.__session.delete(obj)

    def reload(self):
        """reloads data from the database"""
        Base.metadata.create_all(self.__engine)
        sess_factory = sessionmaker(bind=self.__engine, expire_on_commit=False)
        Session = scoped_session(sess_factory)
        self.__session = Session

    def close(self):
        """call remove() method on the private session attribute"""
        self.__session.remove()

    def get(self, cls, id):
        """
        Returns the object based on the class name and its ID, or
        None if not found
        """
        if cls not in classes.keys():
            return None

        all_cls = self.all(classes[cls])
        for value in all_cls.values():
            if (value.id == id):
                return value

        return None
    
    def get_user(self, username):
        """
        Returns the User object based on username, or
        None if not found
        """
        if username is None or type(username) is not str or username == '':
            return None

        user = self.__session.query(User).filter(User.username == username).first()

        if user:
            return user

        return None
    
    def get_user_orders(self, username):
        """
        Returns all orders of a user based on username, or
        None if user not found or empty list if user has no orders
        """
        user = self.get_user(username)
        if not user:
            return None
        orders = user.orders
        orders_list = []
        for order in orders:
            orders_list.append(order.to_dict())

        return orders_list


    def count(self, cls=None):
        """
        count the number of objects in storage
        """
        all_class = classes.values()

        if not cls:
            count = 0
            for clas in all_class:
                count += len(self.all(clas).values())
        else:
            count = len(self.all(classes[cls]).values())

        return count
