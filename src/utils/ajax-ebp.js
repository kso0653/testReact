/**
 * Ajax with promise
 * @see reference from http://www.w3schools.com/ajax/ajax_xmlhttprequest_send.asp
 */
import $ from "jquery";
import "jquery.cookie";

let CryptoJS = require("crypto-js");
let detector = require('detector');
const randomInt = require("random-int");

export default {
    get: function (url, options) {
        if (options === undefined) {
            options = {async: true};
        } else if (typeof options === 'boolean') {
            options = {async: options};
        }
        return this.call(url, "GET", options);
    },
    post: function (url, args, options) {
        if (options === undefined) {
            options = {async: true};
        } else if (typeof options === 'boolean') {
            options = {async: options};
        }
        return this.call(url, "POST", options, args);
    },
    put: function (url, args, options) {
        if (options === undefined) {
            options = {async: true};
        } else if (typeof options === 'boolean') {
            options = {async: options};
        }
        return this.call(url, "PUT", options, args);
    },
    delete: function (url, args, options) {
        if (options === undefined) {
            options = {async: true};
        } else if (typeof options === 'boolean') {
            options = {async: options};
        }
        return this.call(url, "DELETE", options, args);
    },
    patch: function (url, args, options) {
        if (options === undefined) {
            options = {async: true};
        } else if (typeof options === 'boolean') {
            options = {async: options};
        }
        return this.call(url, "PATCH", options, args);
    },
    call: function(url, method, options, args) {
        let target = this;
        let xmlReq;

        try {

            xmlReq = new Promise(function (resolve, reject) {
                let defaults = {
                    contextType: "application/x-www-form-urlencoded",
                    async: true,
                    filedownload: false
                };

                let oAuthToken = $.cookie("oAuthToken");  // oauth 토큰 입니다. 사용하는 저장소의 값으로 셋팅해주세요.
                let signKey = $.cookie("signKey");         // hash key 입니다. 사용하는 저장소의 값으로 셋팅해주세요.

                if (options || options === undefined) {
                    options = $.extend(defaults, options);
                }

                let req = new XMLHttpRequest();
                if (method === null || method === undefined) method = "GET";
                let ts = Math.floor(Date.now()/1000);
                // IE 에서만 파라미터에 timestamp 포함 - IE 캐시 이슈
                if (detector.browser.name === "ie" || detector.browser.name === "edge" ) {
                    if (signKey !== undefined && options.signature == undefined) {
                        if (method.toUpperCase() === "GET") {
                            if (url.indexOf("?") > -1)
                                url += '&';
                            else
                                url += '?';
                            url += 'timestamp=' + ts;
                        } else if (method.toUpperCase() === 'DELETE') {
                            if (url.indexOf("?") > -1)
                                url += '&';
                            else
                                url += '?';
                            url += 'timestamp=' + ts;
                            args.timestamp = ts;
                        } else {
                            args.timestamp = ts;
                        }
                    }
                }

                let param = "";
                if (args && (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH' || method.toUpperCase() === 'DELETE')) {
                    let argcount = 0;
                    for (let key in args) {
                        if (args.hasOwnProperty(key)) {
                            if (argcount++) {
                                param += '&';
                            }
                            param += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                        }
                    }
                }

                if (method.toUpperCase() == "GET") {
                    if (options.encodeUrl != undefined && options.encodeUrl == false) {

                    } else {
                        url = target.setEncodeUrl(url);
                    }
                }

                req.open(method, url, options.async);

                if (options.filedownload == true)
                    req.responseType = 'arraybuffer';

                if (options.signature != undefined){
                    req.setRequestHeader("signature", options.signature);
                }

                req.setRequestHeader("Content-type", options.contextType);
                req.withCredentials = true;
                req.setRequestHeader("Authorization", "Bearer " + oAuthToken);
                let transactionId = target.getTransactionId();
                req.setRequestHeader("transaction-id", transactionId);
                req.setRequestHeader("timestamp", ts);
                
                if (signKey !== undefined) {
                    let hash_key = signKey;
                    let wehagoSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(oAuthToken + transactionId + ts + target.getLocation(url).pathname + target.getLocation(url).search , hash_key));
                    req.setRequestHeader("wehago-sign", wehagoSign);
                }

                req.onload = function () {
                    if (req.status >= 200 && req.status < 300) {
                        resolve(req.response);
                    } else if (req.status === 401) {
                        let response = JSON.parse(req.response);
                        // 세션만료 일 경우
                        if (response.errors !== undefined) {
                            let gatewayResponse = response.errors;
                            // 세션 만료
                            if (gatewayResponse.code === "E002" && (gatewayResponse.message.indexOf("Token is not exists") > -1 || gatewayResponse.message.indexOf("Session is not exists") > -1)) {
                                console.log("세션이 만료되었습니다.");
                            }
                        }
                        reject(req.response);
                    } else {
                        reject(req.response);
                    }
                };
                req.onerror = function (e) {
                    reject(JSON.stringify({
                        "status": status,
                        "errorCode": 500,
                        "errorMsg": "Network Error.",
                        "errors": {
                            "code": 500,
                            "message": "Network Error.",
                        },
                    }));
                };

                if (options.contextType.toLowerCase() === "application/json")
                    req.send(JSON.stringify(args));
                else if (options.contextType.toLowerCase() === "multipart/form-data"){
                    console.log(args);
                    req.send(args);
                } else
                    req.send(param);

            });

        } catch(err) {
            xmlReq = new Promise(function (resolve, reject) {
                reject(JSON.stringify({
                    "errorCode": 500,
                    "errorMsg": "API 요청중 오류가 발생했습니다.",
                    "errors": {
                        "code": 500,
                        "message": "API 요청중 오류가 발생했습니다.",
                    },
                }));
                console.log("tc : API 요청중 오류가 발생했습니다.");
            });
        }
        return xmlReq;
    },
    getLocation: function (url) {
        let match = url.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
        return match && {
            protocol: match[1],
            host: match[2],
            hostname: match[3],
            port: match[4],
            pathname: match[5],
            search: match[6],
            hash: match[7],
        }
    },
    getTransactionId: function () {
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        let string_length = 16;
        let  randomstring = '';
        for (let i=0; i<string_length; i++) {
            // let rnum = Math.floor(Math.random() * chars.length);
            let rnum = randomInt(0, chars.length - 1);
            randomstring += chars.substring(rnum,rnum+1);
        }
        return randomstring;
    },
    setEncodeUrl: function (url) {
        if (url.search("\\?") == -1) return url;
        let match,
            pl     = /\+/g,
            search = /([^&=]+)=?(.*?(?=[&?]\w+=|$))/g,
            //decode = function (s) { return encodeURIComponent(s.replace(pl, " ")); },
            decode = function (s) { return encodeURIComponent(s.replace(/[!'()*]/g, escape)); },
            query = this.getLocation(url).search;
        if (query.search("\\?") == 0)
            query = query.substring(1,query.length);

        let urlstr = url.substring(0,url.search("\\?") + 1);
        while (match = search.exec(query)) {
            urlstr += match[1] + "=" + decode(match[2]) + "&";
        }
        if (urlstr.substring(urlstr.length-1, urlstr.length) == "&")
            urlstr = urlstr.substring(0, urlstr.length-1);
        return urlstr;
    },
    getUncertToken: function (url, method,callback) {
        let target = this;
        $.ajax({
            url: url,
            type: "GET",
            data: {},
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            crossDomain: true,
            async: true,
            beforeSend: function(req) {
                let transactionId = target.getTransactionId();
                req.setRequestHeader("transaction-id", transactionId); // 단계별 로그 transaction_id
            },
            success: function (data, textStatus, jqXHR) {
                let encText = url + data.cur_date + data.token;
                let hashText = CryptoJS.SHA256(encText);
                callback(CryptoJS.enc.Base64.stringify(hashText), jqXHR.status);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                callback(null, jqXHR.status);
            }
        });
    }
};
