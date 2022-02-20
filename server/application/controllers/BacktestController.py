from flask import Blueprint, request
from application.core.ServiceResponse import ServiceResponse
from application.services.BacktestService import backtest_strategy

backtest_controller = Blueprint('backtest_controller', __name__, url_prefix='/api/backtest')


@backtest_controller.route('', methods=['POST'])
def backtest():
    res = ServiceResponse()
    try:
        params = request.json.copy()
        result = backtest_strategy(params)
        res.on_success(data=result)
    except Exception as e:
        res.on_exception(e)
    return res.build()
