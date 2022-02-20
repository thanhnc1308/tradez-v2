from flask import Blueprint, request
from application.services.StockService import stock_service
from application.core.ServiceResponse import ServiceResponse
from application.core.helpers import authenticate
from application.models.StockPrice import StockPrice
from application.schemas.StockPriceSchema import stock_price_list_schema, stock_price_paging_schema
from application.schemas.MarketInfoSchema import market_info_paging_schema
import pandas as pd
from application.utility.datetime_utils import is_weekday, parse_date, format_date, get_yesterday_weekday, get_the_day_before_yesterday_weekday
from datetime import date
from sqlalchemy import desc, asc
from sqlalchemy import and_, or_, not_
from application.services.StockPriceService import calculate_indicators_by_list_symbol_in_a_date, calculate_indicator_by_symbol, get_indicators, get_symbols, calculate_indicators_by_list_symbol
from application.services.NotificationHandlerService import send_notification

stock_controller = Blueprint("stock_controller", __name__, url_prefix='/api/stocks')


@stock_controller.route('/calculate', methods=['GET'])
# @authenticate
# def calculate(current_user):
def calculate():
    """[summary]
    Eg: http://localhost:5000/api/stocks/calculate?indicator=rsi14-rsi7&symbol=HPG-VIC

    http://localhost:5000/api/stocks/calculate?indicator=all&symbol=limit_10-offset_0

    http://localhost:5000/api/stocks/calculate?indicator=all&symbol=all

    Returns:
        [type]: [description]
    """
    res = ServiceResponse()
    try:
        indicator = request.args.get('indicator', 'all', type=str)
        symbol = request.args.get('symbol', 'all', type=str)
        indicators = get_indicators(indicator)
        symbols = get_symbols(symbol)
        calculate_indicators_by_list_symbol(indicators, symbols)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@stock_controller.route('/notification', methods=['GET'])
# @authenticate
# def notification(current_user):
def notification():
    """[summary]
    Eg: http://localhost:5000/api/stocks/notification?indicator=rsi14-rsi7&symbol=HPG-VIC

    http://localhost:5000/api/stocks/notification?indicator=all&symbol=limit_10-offset_0

    http://localhost:5000/api/stocks/notification?indicator=all&symbol=all

    Returns:
        [type]: [description]
    """
    res = ServiceResponse()
    try:
        indicator = request.args.get('indicator', 'all', type=str)
        symbol = request.args.get('symbol', 'all', type=str)
        indicators = get_indicators(indicator)
        symbols = get_symbols(symbol)
        # calculate_indicators_by_list_symbol_in_a_date(indicators, symbols, datetime.now())
        send_notification()
    except Exception as e:
        res.on_exception(e)
    return res.build()


@stock_controller.route('/historical_price/all', methods=['GET'])
@authenticate
def get_historical_price_all(current_user):
    res = ServiceResponse()
    try:
        symbol = request.args.get('symbol', "", type=str)
        from_date = request.args.get('from_date', "01/01/2010", type=str)
        to_date = request.args.get('to_date', "01/01/2110", type=str)
        data = StockPrice.query.order_by(asc('updated_at')).filter(
            and_(
                StockPrice.symbol==symbol,
                StockPrice.stock_date>=from_date,
                StockPrice.stock_date<=to_date
            )
        )
        data = stock_price_list_schema.dump(data)

        def map_row_to_candlestick(row):
            return {
                'x': parse_date(row['stock_date'], '%Y-%m-%d'),
                'y': [row['open_price'],row['high_price'],row['low_price'],row['close_price']]
            }
        data = list(map(map_row_to_candlestick, data))
        res.on_success(data=data)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@stock_controller.route('/historical_price', methods=['GET'])
@authenticate
def get_historical_price(current_user):
    res = ServiceResponse()
    try:
        max_per_page = 100
        data = []
        symbol = request.args.get('symbol', "", type=str)
        from_date = request.args.get('from_date', "01/01/2010", type=date)
        to_date = request.args.get('to_date', "01/01/2110", type=date)
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', max_per_page, type=int), max_per_page)
        data = StockPrice.query.order_by(desc('updated_at')).filter(
            and_(
                StockPrice.symbol==symbol,
                StockPrice.stock_date>=from_date,
                StockPrice.stock_date<=to_date
            )
        ).paginate(page, per_page)
        meta = {
            'page': page,
            'per_page': per_page,
            'total': data.total,
            'pages': data.pages,
        }
        result = {
            'items': data.items,
            'meta': meta
        }
        res.on_success(data=stock_price_paging_schema.dump(result))
    except Exception as e:
        res.on_exception(e)
    return res.build()


@stock_controller.route('/market_info', methods=['GET'])
@authenticate
def get_market_info(current_user):
    res = ServiceResponse()
    try:
        max_per_page = 100
        data = []
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', max_per_page, type=int), max_per_page)
        # today_date = date.today()
        today_date = parse_date('12/01/2021')
        if is_weekday(today_date):
            today = format_date(today_date)
            yesterday = format_date(get_yesterday_weekday(today_date))
            the_day_before_yesterday = format_date(get_the_day_before_yesterday_weekday(today_date))
            data = StockPrice.query.order_by(desc('updated_at')).filter(
                or_(
                    StockPrice.stock_date==today,
                    StockPrice.stock_date==yesterday,
                    StockPrice.stock_date==the_day_before_yesterday
                )
            ).paginate(page, per_page)
            # calculate voletile
            df = pd.DataFrame(columns=['symbol','today','yesterday'])
            today_data = StockPrice.query.order_by(desc('updated_at')).filter(StockPrice.stock_date==today).paginate(page, per_page)
            yesterday_data = StockPrice.query.order_by(desc('updated_at')).filter(StockPrice.stock_date==yesterday).paginate(page, per_page)
            the_day_before_yesterday_data = StockPrice.query.order_by(desc('updated_at')).filter(StockPrice.stock_date==the_day_before_yesterday).paginate(page, per_page)
            df['symbol'] = list(map(lambda x : x.symbol, today_data.items))
            df['today'] = list(map(lambda x : x.close_price, today_data.items))
            df['yesterday'] = list(map(lambda x : x.close_price, yesterday_data.items))
            df['volatile'] = df.apply(lambda x : round(((x['today']) - x['yesterday']) / x['today'] * 100, 2), axis=1)
            meta = {
                'page': page,
                'per_page': per_page,
                'total': today_data.total,
                'pages': today_data.pages,
            }
            result = {
                'items': df.to_dict('records'),
                'meta': meta
            }
            res.on_success(data=market_info_paging_schema.dump(result))
        else:
            res.on_success(data=[])
    except Exception as e:
        res.on_exception(e)
    return res.build()


@stock_controller.route('', methods=['GET'])
@authenticate
def get_all(current_user):
    res = ServiceResponse()
    try:
        order_by = request.args.get('order_by', 'updated_at', type=str)
        res = stock_service.get_all(order_by)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@stock_controller.route('/<string:id>', methods=['GET'])
@authenticate
def get_by_id(current_user, id):
    res = ServiceResponse()
    try:
        res = stock_service.get_by_id(id)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@stock_controller.route('/paging_filter', methods=['GET'])
@authenticate
def get_paging(current_user):
    res = ServiceResponse()
    try:
        order_by = request.args.get('order_by', 'updated_at', type=str)
        max_per_page = 100
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', max_per_page, type=int), max_per_page)
        res = stock_service.get_paging(page=page, per_page=per_page, order_by=order_by)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@stock_controller.route('', methods=['POST'])
@authenticate
def add(current_user):
    res = ServiceResponse()
    try:
        parameters = request.json
        res = stock_service.post(parameters)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@stock_controller.route('/<string:id>', methods=['PUT'])
@authenticate
def update(current_user, id):
    res = ServiceResponse()
    try:
        parameters = request.json
        res = stock_service.put(id, parameters)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@stock_controller.route('/<string:id>', methods=['DELETE'])
@authenticate
def delete(current_user, id):
    res = ServiceResponse()
    try:
        res = stock_service.delete(id)
    except Exception as e:
        res.on_exception(e)
    return res.build()
