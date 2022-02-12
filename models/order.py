#!/usr/bin/python
""" holds class Order"""

from models.base_model import BaseModel, Base
import uuid

from sqlalchemy import Column, String, Integer, Float, ForeignKey, Table, Boolean
from sqlalchemy.orm import relationship


order_item = Table('order_item', Base.metadata,
                        Column('product_id', String(60),
                                ForeignKey('products.id', onupdate='CASCADE',
                                        ondelete='CASCADE'),
                                primary_key=True),
                        Column('order_id', String(60),
                                ForeignKey('orders.id', onupdate='CASCADE',
                                        ondelete='CASCADE'),
                                primary_key=True))


class Order(BaseModel, Base):
    """Representation of Place """

    __tablename__ = 'orders'
    order_number = Column(String(15), nullable=False)
    quantity = Column(Integer, nullable=False)
    total_amount = Column(Float, nullable=False)
    payed = Column(Boolean, nullable=False, default=False)

    def __init__(self, *args, **kwargs):
        """initializes Place"""
        super().__init__(*args, **kwargs)
