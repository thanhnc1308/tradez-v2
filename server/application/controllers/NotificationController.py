from flask import Blueprint, request
from application.services.NotificationService import notification_service
from application.services.NotificationHandlerService import send_gmail
from application.core.ServiceResponse import ServiceResponse
from application.core.helpers import authenticate

notification_controller = Blueprint("notification_controller", __name__, url_prefix='/api/notifications')


@notification_controller.route('', methods=['GET'])
@authenticate
def get_all(current_user):
    res = ServiceResponse()
    try:
        order_by = request.args.get('order_by', 'updated_at', type=str)
        res = notification_service.get_all(order_by)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@notification_controller.route('/<string:id>', methods=['GET'])
@authenticate
def get_by_id(current_user, id):
    res = ServiceResponse()
    try:
        res = notification_service.get_by_id(id)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@notification_controller.route('/paging_filter', methods=['GET'])
@authenticate
def get_paging(current_user):
    res = ServiceResponse()
    try:
        order_by = request.args.get('order_by', 'updated_at', type=str)
        max_per_page = 100
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', max_per_page, type=int), max_per_page)
        res = notification_service.get_paging(page=page, per_page=per_page, order_by=order_by)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@notification_controller.route('', methods=['POST'])
@authenticate
def add(current_user):
    res = ServiceResponse()
    try:
        parameters = request.json
        res = notification_service.post(parameters)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@notification_controller.route('/<string:id>', methods=['PUT'])
@authenticate
def update(current_user, id):
    res = ServiceResponse()
    try:
        parameters = request.json
        res = notification_service.put(id, parameters)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@notification_controller.route('/<string:id>', methods=['DELETE'])
@authenticate
def delete(current_user, id):
    res = ServiceResponse()
    try:
        res = notification_service.delete(id)
    except Exception as e:
        res.on_exception(e)
    return res.build()


@notification_controller.route('/test_gmail', methods=['POST'])
def test_gmail():
    res = ServiceResponse()
    try:
        parameters = request.json
        send_gmail(parameters)
    except Exception as e:
        res.on_exception(e)
    return res.build()
