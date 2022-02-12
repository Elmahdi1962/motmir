#!/usr/bin/python
""" holds class Order"""

from models.base_model import BaseModel, Base
import uuid

from sqlalchemy import Column, String, Integer, Float, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship


class Product(BaseModel, Base):
    """Representation of Place """

    __tablename__ = 'products'
    name = Column(String(30), nullable=False)
    price = Column(Float, nullable=False)
    organic = Column(Boolean, nullable=False, default=False)
    img = Column(String, nullable=False, default=False)

    def __init__(self, *args, **kwargs):
        """initializes Place"""
        super().__init__(*args, **kwargs)
