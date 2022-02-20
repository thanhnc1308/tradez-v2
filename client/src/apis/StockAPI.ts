import BaseAPI from "./BaseAPI";

class _StockAPI extends BaseAPI {
  prefix = '/stock'
}

export const StockAPI = new _StockAPI();
