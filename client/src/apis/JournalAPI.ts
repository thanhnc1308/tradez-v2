import BaseAPI from "./BaseAPI";

class _JournalAPI extends BaseAPI {
  prefix = '/journals'
}

export const JournalAPI = new _JournalAPI();
