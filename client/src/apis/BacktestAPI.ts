import BaseAPI from "./BaseAPI";

class _BacktestAPI extends BaseAPI {
  prefix = "/backtest";
}

export const BacktestAPI = new _BacktestAPI();
