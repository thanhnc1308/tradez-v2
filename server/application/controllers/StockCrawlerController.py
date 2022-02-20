from flask import Blueprint
from application.core.ServiceResponse import ServiceResponse
import application.services.StockCrawlerService as crawler

stock_crawler_controller = Blueprint("stock_crawler_controller", __name__, url_prefix='/api/stock_crawler')


@stock_crawler_controller.route('/crawl_stock_symbol', methods=['GET'])
def crawl_stock_symbols():
    res = ServiceResponse()
    try:
        res.on_success(crawler.crawl_stock_symbols())
    except Exception as e:
        res.on_exception(e)
    return res.build()


@stock_crawler_controller.route('/crawl_all', methods=['GET'])
def crawl_all():
    res = ServiceResponse()
    try:
        res.on_success(crawler.crawl_all_list())
    except Exception as e:
        res.on_exception(e)
    return res.build()


@stock_crawler_controller.route('/crawl/<string:stock_index>', methods=['GET'])
def crawl(stock_index):
    res = ServiceResponse()
    try:
        res.on_success(crawler.crawl(stock_index))
    except Exception as e:
        res.on_exception(e)
    return res.build()
