from application.core.extensions import db
import uuid
from sqlalchemy.dialects.postgresql import UUID
from application.core.BaseModel import BaseModel


class Stock(BaseModel):
    __tablename__ = "stock"

    symbol = db.Column(db.String(50), nullable=False)
    company_name = db.Column(db.String(), nullable=True)

    def __init__(self, **kwargs):
        db.Model.__init__(self, **kwargs)

    def __repr__(self):
        return "<Stock %s>" % self.index
