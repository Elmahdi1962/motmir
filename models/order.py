#!/usr/bin/python
""" holds class Order"""

from models.base_model import BaseModel, Base
import uuid
from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship


class Order(BaseModel, Base):
    """Representation of orders """

    __tablename__ = 'orders'
    order_number = Column(String(60), unique=True, nullable=False)
    package_number = Column(String(60), unique=True, nullable=True)
    total_quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    shipping_cost = Column(Float, nullable=False)
    payment_method = Column(String(30), nullable=False, server_default='on delivery')
    payed = Column(Integer, nullable=False, server_default='0')
    status = Column(String(30), nullable=False, server_default='pending')
    orders_details = relationship('OrderDetails',
                                  backref="order",
                                  cascade="all, delete, delete-orphan")
    user_id = Column(String(60), ForeignKey('users.id'), nullable=True)

    def __init__(self, *args, **kwargs):
        """initializes Place"""
        super().__init__(*args, **kwargs)
        if not hasattr(self, 'order_number') or self.order_number == '' or self.order_number is None:
            print('changed order number')
            print('its old value is :', self.order_number)
            self.order_number = str(uuid.uuid4().int)
