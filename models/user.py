#!/usr/bin/python
""" holds class User"""

from models.base_model import BaseModel, Base
from sqlalchemy import Column, Integer, String
from flask_login import UserMixin

class User(BaseModel, Base, UserMixin):
    """Representation of User """

    __tablename__ = 'users'
    username = Column(String(30), nullable=False, unique=True)
    email = Column(String(60), nullable=False, unique=True)
    password = Column(String(60), nullable=False)
    is_admin = Column(Integer, nullable=True, server_default='0')

    def __init__(self, *args, **kwargs):
        """initializes Product"""
        super().__init__(*args, **kwargs)
