import BaseAPI from "./BaseAPI";

class _NotificationAPI extends BaseAPI {
  prefix = '/notifications'
}

export const NotificationAPI = new _NotificationAPI();
