from application.core.BaseService import BaseService
from application.models.Stock import Stock
from application.schemas.StockSchema import stock_schema, stocks_list_schema, stocks_paging_schema


class StockService(BaseService):
    model = Stock
    schema = stock_schema
    list_schema = stocks_list_schema
    paging_schema = stocks_paging_schema


stock_service = StockService()
