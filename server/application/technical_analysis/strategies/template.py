import backtrader as bt
from application.technical_analysis.strategies.BaseStrategy import BaseStrategy


class StrategyTemplate(BaseStrategy):
    params = ()

    def __init__(self):
        super(StrategyTemplate, self).__init__()

    def next(self):

        if True:
            pass
            # self.buy()
        else:
            pass
            # self.sell()
