from flask import Blueprint, request, current_app
from application.core.ServiceResponse import ServiceResponse
from application.cache.BaseCache import BaseCache
from application.cache.CacheType import CacheType
from application.core.BaseLogger import base_logger

test_controller = Blueprint('test_controller', __name__, url_prefix='/api/test')


@test_controller.route('/cache', methods=['GET'])
def test():
    cache_param = {
        "user_id": "test"
    }
    value = BaseCache.instance().get(CacheType.UserInfo, cache_param)
    if not value:
        BaseCache.instance().set(CacheType.UserInfo, cache_param, "test")
    else:
        BaseCache.instance().delete(CacheType.UserInfo, cache_param)
    base_logger.exception("exception")
    return 'ok'


@test_controller.route("log")
def log():
    base_logger.exception("exception")
    # base_logger.info("info")
    # base_logger.debug("debug")
    # base_logger.warning("warning")
    return "ok"
