/**
 * Class handles RESTful API request in client
 */
import axios from 'axios';
import { Log } from '../utils/Log';
import jwt_decode from 'jwt-decode';

type IToken = {
    exp: number
}

class HttpClient {
    static instance = null
    service = null
    token = null
    refreshToken = null

    constructor() {
        if (!HttpClient.instance) {
            this.init();
            HttpClient.instance = this;
        }
        return HttpClient.instance;
    }

    init() {
        this.service = axios.create({
            baseURL: process.env.REACT_APP_BASE_API, // url = base url + request url
            // withCredentials: true, // send cookies when cross-domain requests
            // timeout: 0 // request timeout
        })

        // request interceptor
        this.service.interceptors.request.use(
            async (config) => {
                // check token before request is sent
                const currentDate: Date = new Date();
                if (this.token) {
                    const decodedToken = jwt_decode<IToken>(this.token);
                    if (decodedToken.exp * 1000 < currentDate.getTime()) {
                        const newToken = await this.renewToken();
                        this.token = newToken.accessToken;
                        this.refreshToken = newToken.refreshToken;
                        localStorage.setItem('token', this.token);
                        localStorage.setItem('refreshToken', this.refreshToken);
                    }
                    config.headers["Authorization"] = `Bearer ${this.token}`;
                }
                return config;
            },
            error => {
                // do something with request error
                Log.exception(error); // for debug
                return Promise.reject(error);
            }
        );

        // response interceptor
    this.service.interceptors.response.use(
        /**
         * If you want to get http information such as headers or status
         * Please return  response => response
         */

        /**
         * Determine the request status by custom code
         * Here is just an example
         * You can also judge the status by HTTP Status Code
         */
        response => {
            const res = response;

            // if the custom status is not 200, it is judged as an error.
            if (res.status !== 200) {
                // Message({
                //     message: res.message || "Error",
                //     type: "error",
                //     duration: 5 * 1000
                // });

                // 50014: Token expired;
                if (res.status === 401 || res.status === 50014) {
                    // to re-login
                    // MessageBox.confirm(
                    //     "You have been logged out, you can cancel to stay on this page, or log in again",
                    //     "Confirm logout",
                    //     {
                    //         confirmButtonText: "Re-Login",
                    //         cancelButtonText: "Cancel",
                    //         type: "warning"
                    // }
                    // ).then(() => {
                    //     store.dispatch("user/resetToken").then(() => {
                    //         location.reload();
                    //     });
                    // });
                }
                return Promise.reject(new Error(res.message || "Error"));
            } else {
                return res.data;
            }
        },
        error => {
            Log.exception("err" + error); // for debug
            // Message({
            //     message: error.message,
            //     type: "error",
            //     duration: 5 * 1000
            // });
            return Promise.reject(error);
        }
        );
    }

    renewToken() {
        const url = '';
        const payload = {
            refreshToken: this.refreshToken
        }
        return this.request({
            url,
            method: 'post',
            data: payload
        })
    }

    request(options) {
        return this.service.request(options);
    }

    get(options) {
        return this.service.get(options);
    }

    post(options) {
        return this.service.post(options);
    }

    put(options) {
        return this.service.put(options);
    }

    delete(options) {
        return this.service.delete(options);
    }
}

const instance = new HttpClient();
Object.freeze(instance);

export default instance;