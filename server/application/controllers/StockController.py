from flask import Blueprint, request
from application.services.StockService import stock_service
from application.core.ServiceResponse import ServiceResponse
from application.core.helpers import authenticate

stock_controller = Blueprint("stock_controller", __name__, url_prefix='/api/stocks')


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
