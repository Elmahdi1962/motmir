#!/usr/bin/python
""" holds class OrderDetails"""

from models.base_model import BaseModel, Base
from models.order import Order
from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship


class OrderDetails(BaseModel, Base):
    '''representaion of order details'''

    __tablename__ = 'order_details'
    order_id = Column(String(60), ForeignKey('orders.id'), nullable=False)
    product_id = Column(String(60), ForeignKey('products.id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)

    def __init__(self, *args, **kwargs):
        """initializes orderDetails"""
        super().__init__(*args, **kwargs)
