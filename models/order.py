#!/usr/bin/python
""" holds class Order"""

from models.base_model import BaseModel, Base
import uuid
from sqlalchemy import Column, String, Integer, Float
from sqlalchemy.orm import relationship


class Order(BaseModel, Base):
    """Representation of orders """

    __tablename__ = 'orders'
    order_number = Column(String(60), unique=True, nullable=False)
    total_quantity = Column(Integer, nullable=False)
    total_price = Column(Float, nullable=False)
    payment_method = Column(String(30), nullable=False, server_default='on delivery')
    payed = Column(Integer, nullable=False, server_default='0')
    orders_details = relationship('OrderDetails',
                                  backref="order",
                                  cascade="all, delete, delete-orphan")
    user_details = relationship('UserDetails',
                                backref='order',
                                cascade="delete, delete-orphan",
                                uselist=False)

    def __init__(self, *args, **kwargs):
        """initializes Place"""
        super().__init__(*args, **kwargs)
        self.order_number = str(uuid.uuid4().int)
