#!/usr/bin/python
""" holds class Product"""

from models.base_model import BaseModel, Base
from models.order_details import OrderDetails
from sqlalchemy import Column, String, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship


class Product(BaseModel, Base):
    """Representation of Product """

    __tablename__ = 'products'
    name = Column(String(30), nullable=False)
    price = Column(Float, nullable=False)
    organic = Column(Integer, nullable=False, server_default='0')
    description = Column(String(1000), nullable=True)
    img_url = Column(String(60), nullable=False, server_default='image')
    orders_details = relationship('OrderDetails', backref='product', cascade='all, delete, delete-orphan')

    def __init__(self, *args, **kwargs):
        """initializes Product"""
        super().__init__(*args, **kwargs)
