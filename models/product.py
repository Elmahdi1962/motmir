#!/usr/bin/python
""" holds class Order"""

from models.base_model import BaseModel, Base
from sqlalchemy import Column, String, Integer, Float, ForeignKey, Table
from sqlalchemy.orm import relationship


class Product(BaseModel, Base):
    """Representation of Place """

    __tablename__ = 'products'
    name = Column(String(30), nullable=False)
    price = Column(Float, nullable=False)
    organic = Column(Integer(2), nullable=False, server_default=0)
    description = Column(String(1000), nullable=True)
    img = Column(String(60), nullable=False, server_default='image')

    def __init__(self, *args, **kwargs):
        """initializes Place"""
        super().__init__(*args, **kwargs)
