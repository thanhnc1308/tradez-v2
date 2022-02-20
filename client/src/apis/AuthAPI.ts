import BaseAPI from "./BaseAPI";
import { Log } from '../utils/Log';

class _AuthAPI extends BaseAPI {
    /**
     * prefix of api
     */
    prefix = '/auth';

    async login(userCredentials,) {
        try {
            return await this.request({
                url: '/login',
                method: 'post',
                payload: userCredentials
            })
        } catch (e) {
            return e;
        }
    }

    async register(userCredentials) {
        try {
            return await this.request({
                url: '/register',
                method: 'post',
                payload: userCredentials
            })
        } catch (e) {
            Log.exception(e);
            return e;
        }
    }
}

export const AuthAPI = new _AuthAPI();
