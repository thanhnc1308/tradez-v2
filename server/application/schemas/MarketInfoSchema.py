from marshmallow import fields
from application.core.BaseSchema import BaseSchema, BaseListSchema


class MarketInfoSchema(BaseSchema):
    symbol = fields.String(required=True)
    status = fields.String()
    volatile = fields.Number()


class MarketInfoListSchema(BaseListSchema):
    items = fields.List(fields.Nested(MarketInfoSchema()))


market_info_schema = MarketInfoSchema()
market_info_list_schema = MarketInfoSchema(many=True)
market_info_paging_schema = MarketInfoListSchema()
