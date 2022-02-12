#!/usr/bin/python
""" holds class UserDetails"""

from models.base_model import BaseModel, Base
from sqlalchemy import Column, String
from sqlalchemy.orm import relationship


class UserDetails(BaseModel, Base):
    '''representaion of order details'''
    
    __tablename__ = 'user_details'
    full_name = Column(String(60), nullable=False)
    country = Column(String(30), nullable=False)
    city = Column(String(30), nullable=False)
    full_address = Column(String(100), nullable=False)
    phone_number = Column(String(30), nullable=False)
    order = relationship('Order', back_populates='user_details')

    def __init__(self, *args, **kwargs):
        """initializes Place"""
        super().__init__(*args, **kwargs)
