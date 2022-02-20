from marshmallow import Schema, fields, validates, ValidationError
from application.models.Stock import Stock
from application.core.BaseSchema import BaseSchema, BaseListSchema


class StockSchema(Schema):
    id = fields.String(dump_only=True)
    symbol = fields.String()
    company_name = fields.String()

    @validates('index')
    def validate_index(self, index, **kwargs):
        if bool(Stock.query.filter_by(index=index).first()):
            raise ValidationError(
                '"{index}" index already exists, '
                'please use a different index.'.format(index=index)
            )


class StockListSchema(BaseListSchema):
    items = fields.List(fields.Nested(StockSchema()))


stock_schema = StockSchema()
stocks_list_schema = StockSchema(many=True)
stocks_paging_schema = StockListSchema()
