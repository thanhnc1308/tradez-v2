import requests
import json
from application.models.StockPrice import StockPrice
from application.schemas.StockSchema import stocks_list_schema
from application.models.Stock import Stock
from application.core.constants import DEFAULT_SCHEMA


# region crawl stock symbol
def crawl_stock_symbols():
    # url = f'https://svr4.fireant.vn/api/Data/Companies/CompanyInfo?symbol={symbol}'
    url = 'https://svr4.fireant.vn/api/Data/Finance/AllLastestFinancialInfo'
    response = requests.get(url=url)
    if response.ok:
        list_results = json.loads(response.content)
        # TODO: write save batch to reduce round trips to database
        for result in list_results:
            symbol = result.get('Symbol', None)
            if symbol is not None:
                new_item = {
                    'symbol': result.get('Symbol', None),
                    # 'company_name': result.get('CompanyName', None)
                }
                Stock.create(**new_item)
        return 'success'
    else:
        return 'failure'
# endregion crawl stock symbol


# region crawl stock price
def crawl_all_list():
    list_stock = get_all_stock_indices()
    result = []
    list_stock.sort()
    for item in list_stock:
        result.append(item)
        crawl(item)
    return result


def get_all_stock_indices():
    return ['HPG', 'DIG', 'VIC', 'ACB', 'HAX']
    # stock = stocks_list_schema.dump(Stock.get_all())
    # result = []
    # for item in stock:
    #     result.append(item.get('symbol'))
    # return result


def crawl(stock_index, start_date='2010-01-01', end_date='2030-12-31'):
    url = get_crawl_url(stock_index=stock_index, start_date=start_date, end_date=end_date)
    response = requests.get(url=url)
    if response.ok:
        result = json.loads(response.content)
        sql = f"delete from {DEFAULT_SCHEMA}.stock_price where symbol = '{stock_index}' and stock_date between '{start_date}' and '{end_date}';"
        StockPrice.execute(sql)
        # TODO: write save batch to reduce round trips to database
        for item in result:
            new_item = {
                'symbol': item.get('Symbol', None),
                'stock_date': item.get('Date', None),
                'currency_unit': 'VND',
                'open_price': item.get('PriceOpen', None),
                'high_price': item.get('PriceHigh', None),
                'low_price': item.get('PriceLow', None),
                'close_price': item.get('PriceClose', None),
                'volume': item.get('Volume', None),
                'market_cap': item.get('MarketCap', None)
            }
            StockPrice.create(**new_item)
        return True
    else:
        return False


def get_crawl_url(stock_index, start_date, end_date):
    return f'https://svr1.fireant.vn/api/Data/Companies/HistoricalQuotes?symbol={stock_index}&startDate={start_date}&endDate={end_date}';


def crawl_all_list_at_a_date(date):
    try:
        list_stock = get_all_stock_indices()
        result = []
        list_stock.sort()
        for item in list_stock:
            result.append(item)
            crawl_at_a_date(item, date)
        return result
    except Exception as e:
        print(str(e))


def crawl_at_a_date(stock_index, date):
    url = get_crawl_url(stock_index=stock_index, start_date=date, end_date=date)
    response = requests.get(url=url)
    if response.ok:
        result = json.loads(response.content)
        sql = f"delete from {DEFAULT_SCHEMA}.stock_price where symbol = '{stock_index}' and stock_date = '{date}';"
        StockPrice.execute(sql)
        for item in result:
            new_item = {
                'symbol': item.get('Symbol', None),
                'stock_date': item.get('Date', None),
                'currency_unit': 'VND',
                'open_price': item.get('PriceOpen', None),
                'high_price': item.get('PriceHigh', None),
                'low_price': item.get('PriceLow', None),
                'close_price': item.get('PriceClose', None),
                'volume': item.get('Volume', None),
                'market_cap': item.get('MarketCap', None)
            }
            StockPrice.create(**new_item)
    else:
        print('not ok')
# endregion crawl stock price
