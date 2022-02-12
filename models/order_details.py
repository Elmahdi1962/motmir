#!/usr/bin/python
""" holds class OrderDetails"""

from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship


class OrderDetails(BaseModel, Base):
    '''representaion of order details'''

    __tablename__ = 'order_details'
    product = relationship('Product', backref='orders_details')
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=False)

    def __init__(self, *args, **kwargs):
        """initializes Place"""
        super().__init__(*args, **kwargs)

