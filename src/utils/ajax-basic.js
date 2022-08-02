/**
 * Ajax with promise
 * @see reference from http://www.w3schools.com/ajax/ajax_xmlhttprequest_send.asp
 */
import $ from "jquery";
import "jquery.cookie";
import agent from "./agent";
import {DOMAIN_REG_EXP} from "../components/Header/Enums/Enums";

const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");

let CryptoJS = require("crypto-js");
let detector = require('detector');
const randomInt = require("random-int");
const uuidV1 = require('uuid/v1');

export default {
    get: function (url, options) {
        if (options === undefined) {
            options = {async: true};
        } else if (typeof options === 'boolean') {
            options = {async: options};
        }

        try {
            // 클라이언트 캐시
            if (options.cacheUse !== undefined && options.cacheUse == true
                && options.cacheTime !== undefined && options.cacheName !== undefined) {
                // 캐쉬명 사용 안하고 url 사용하게 변경
                options.cacheName = this.cacheUrl(url);
                let cc = this.getItem(options.cacheName, options.cacheTime);
                if (cc.cache) {
                    return new Promise(function (resolve, reject) {
                        resolve(cc.data);
                    });
                }
            }
        } catch (err) {
            console.log("client cashe error");
        }

        return this.call(url, "GET", options);
    },
    post: function (url, args, options) {
        if (options === undefined) {
            options = {async: true};
        } else if (typeof options === 'boolean') {
            options = {async: options};
        }

        try {
            // 클라이언트 캐시
            if (options.cacheUse !== undefined && options.cacheUse == true
                && options.cacheTime !== undefined && options.cacheName !== undefined ){
                let cc = this.getItem(options.cacheName, options.cacheTime);
                if (cc.cache) {
                    return new Promise(function (resolve, reject) {
                        resolve(cc.data);
                    });
                }
            }
        } catch (err) {
            console.log("client cashe error");
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
                    filedownload: false,
                    cacheUse: false,
                    cacheTime: 60,
                    cacheName: "unknown",
                    interPlatform: false,
                    oppositeUrl: false,
                    timeout: 50000
                };

                if (options || options === undefined) {
                    options = $.extend(defaults, options);
                }

                // 상대 플랫폼 요청인지 처리
                if (options.oppositeUrl !== undefined && options.oppositeUrl === true){
                    url = target.oppositeUrl(url);
                }

                let req = new XMLHttpRequest();
                if (method === null || method === undefined) method = "GET";

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

                // 타임아웃 설정
                if (options.async == true) req.timeout = options.timeout;

                if (options.filedownload == true)
                    req.responseType = 'arraybuffer';


                if (options.contextType == "multipart/form-data") {
                } else {
                    req.setRequestHeader("Content-type", options.contextType);
                }

                let starttime = new Date().getTime();
                req.onload = function () {
                    // api 네트워크 속도 체크
                    try {
                        if (method.toUpperCase() === "GET") {
                            target.apiTime(new Date().getTime() - starttime, url, true);
                        }
                    } catch (err) {
                        console.log(err);
                    }

                    if (req.status >= 200 && req.status < 300) {
                        resolve(req.response);
                        if (options.cacheUse == true) {
                            try {
                                // 커스텀 에러 일경우 세션스토리지에 저장하지 않는다.
                                let tmpResponse = JSON.parse(req.response);
                                if (tmpResponse != null && tmpResponse != undefined && tmpResponse.resultCode != null && tmpResponse.resultCode != undefined) {
                                    if (parseInt(tmpResponse.resultCode) >= 200 && parseInt(tmpResponse.resultCode) < 300) {
                                        target.setItem(options.cacheName, req.response);
                                    }
                                }
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    } else if (req.status === 401) {
                        let response = JSON.parse(req.response);
                        // 세션만료 일 경우 게이트웨이에서 리턴 오는 값 ::: {"errors": {"code": "E002", "message": "Token is not exists. "}}
                        if (response.errors !== undefined) {
                            let gatewayResponse = response.errors;
                            // 세션 만료
                            if (gatewayResponse.code === "E002" && (gatewayResponse.message.indexOf("Token is not exists") > -1 || gatewayResponse.message.indexOf("Session is not exists") > -1)) {
                                //if ($.cookie("AUTH_A_TOKEN") !== "" && $.cookie("AUTH_A_TOKEN") !== undefined) {
                                //alert("세션이 만료되었습니다.");
                                let regExp = DOMAIN_REG_EXP;
                                $.removeCookie("AUTH_A_TOKEN", {path: "/", domain: document.domain.substring(document.domain.search(regExp))});
                                $.removeCookie("AUTH_R_TOKEN", {path: "/", domain: document.domain.substring(document.domain.search(regExp))});
                                $.removeCookie("randomkey", {path: "/", domain: document.domain.substring(document.domain.search(regExp))});
                                $.removeCookie("SESSION_KEY", {path: "/", domain: document.domain.substring(document.domain.search(regExp))});
                                $.removeCookie("wehago_s", {path: "/", domain: document.domain.substring(document.domain.search(regExp))});
                                $.cookie("IS_REFRESH", "T", {expires: 1, path: "/"});

                                if (document.location.hash !== '#/login') {
                                    // 세션만료 로그인 페이지에서 세션이 만료될 경우
                                    if (document.location.hash.indexOf("#/login?type=expired") > -1){
                                        window.location.reload();
                                    }

                                    if (process.env.PROD_TYPE === "smarta") {
                                        document.location.href = globals.portalUrl + "/#/login?type=expired";
                                    } else {
                                        document.location.href = globals.portalUrl + "/#/login?type=expired";
                                    }
                                }

                                // 가상화 어플리케이션 종료처리
                                if ($("#appList .remoteapp").length > 0 || $("#app_popup_ss .app_popup_lst li").length > 1 || $("#divWidgetSSList .widgetremoteapp").length > 0) {
                                    agent.appLogout();
                                }
                                return;
                                //}
                            }
                        }
                        reject(req.response);
                    } else {
                        reject(req.response);
                    }
                };
                req.onerror = function (e) {
                    // console.log("============ Network Error ");

                    let status;
                    // api 네트워크 속도 체크
                    try {
                        status = e.target.status;
                        if (method.toUpperCase() === "GET" && status === 0) {
                            target.apiTime(new Date().getTime() - starttime, url, false);
                        }
                    } catch (err) {
                        console.log(err);
                    }

                    // reject(Error("Network Error"));
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

                if (options && options.cancelToken && options.cancelToken.promise) {
                    options.cancelToken.promise.then(function onCanceled(cancel) {
                        if (!req) {
                            return;
                        }

                        req.abort();
                        reject(cancel);

                        // Clean up request
                        req = null;
                    });
                }

                //if (options.contextType.toLowerCase() === "application/json" || options.contextType.toLowerCase() === "application/vnd.ms-excel")
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
    getService: function (url) {
        let service = "";
        if (url.split("/").length>2) {
            service = url.split("/")[3];
        }
        return service;
    },
    getServiceCode: function () {

        //let serviceCodeList ="contacts,mail,humanresource,schedule,account,company,wedrive,communication,10mbook,invoice,cloudfax,accounts,smartsquare";
        //let authCodeList="landing,login"
        if (process.env.cell && process.env.CHECK_TYPE !== 'local') {
            let serviceCode = document.location.pathname.replace(/\//gi, "");
            return serviceCode;
        } else {
            let portalUrl = window.location.href;
            let path = portalUrl.split("/#/")[1];
            let serviceCode = "";
            //if (path !== "") {
            if (path) {
                serviceCode = path.split("/")[0];
            }
            serviceCode = serviceCode.toLowerCase();
            if (serviceCode === "m") {
                serviceCode = path.split("/")[1];
            }
            if (serviceCode === "account") {
                serviceCode = path.split("/")[1];
            }
            if (serviceCode.indexOf("?") > -1) {
                serviceCode = serviceCode.split("?")[0];
            }
            return serviceCode;
        }
    },
    getTransactionId: function () {
        let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        let string_length = 10;
        let randomstring = '';

        /* UUID로 생성
        if (process.env.BUILD_ENV === 'dev' || process.env.BUILD_ENV === 'local' ) {
            randomstring = uuidV1().replace(/-/g, "");
        } else {
            for (let i = 0; i < string_length; i++) {
                //let rnum = Math.floor(Math.random() * chars.length);
                let rnum = randomInt(0, chars.length - 1);
                randomstring += chars.substring(rnum, rnum + 1);
            }
        }
        */
        randomstring = uuidV1().replace(/-/g, "");
        return randomstring;
    },
    setEncodeUrl: function (url) {
        if (url.search("\\?") == -1) return url;
        //search = /([^&=]+)=?([^&]*)/g,     원복 시 search만 변경하면 됩니다.
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



    /**
     * 캐시 데이터 여부
     *
     * 신규 변경건이 없으면 캐시데이터 사용. 있으면 새로 가져와여함
     * @param obj - {cache_code: '캐쉬 코드'}
     * @param callback - 콜백 펑션
     * callback data : { useCache : true/false  , cacheData: {캐시된 데이터} }
     * useCache가 true 이면 캐시된 데이터 사용이고 cacheData 값에 캐시된 데이터 리턴해줌
     * useCache가 false 이면 직접 api 호출하여 데이터 가져와야함. 가져온후 getClientCache
     */
    clientCache: function (args, callback) {

        if (args.cache_code == undefined){
            callback({useCache: false});
            return;
        }

        let cache_code = args.cache_code;

        let curl = globals.wehagoCommonApiUrl + "/clientcache/lastchange?" + "cache_code="+cache_code+"&company_no=" + $("#h_selected_company_no").val();
        this.get(curl).then(function(response) {
            response = JSON.parse(response);
            //console.log(response);

            // 마지막 변경 시간
            let lc = response.resultData;

            if (localStorage.getItem("cc_"+cache_code+"_ts") != undefined && localStorage.getItem("cc_"+cache_code+"_company_no") != undefined && localStorage.getItem("cc_"+cache_code+"_data") != undefined){
                if ( lc > localStorage.cc_org_ts){
                    // 새로 구한 api 데이터 사용
                    callback({useCache: false});
                } else {
                    // 로컬 스토리지 데이터 사용
                    callback({useCache: true, cacheData: localStorage.getItem("cc_"+cache_code+"_data")});
                }

            } else {
                // 새로 구한 api 데이터 사용
                callback({useCache: false});
            }

        }, function(error) {
            console.error("Failed!", error);
            callback({useCache: false});
        });
    },
    /**
     * 캐시 셋팅
     *
     * 캐시 데이터 셋팅
     * @param cache_code - 캐시 코드
     * @param cache_data - 캐시 데이터
     */
    setClientCache: function (cache_code, cache_data) {
        localStorage.setItem("cc_org_ts", new Date().getTime());
        localStorage.setItem("cc_org_company_no", $("#h_selected_company_no").val());
        localStorage.setItem("cc_org_data", cache_data);
    },

    /**
     * 세션 스토리지 저장
     * @param sess_name
     * @param data
     */
    setItem: function (sess_name, data) {
        let sess_obj = {
            since : Math.floor(Date.now()),
            data : data
        }
        sessionStorage.setItem(sess_name, JSON.stringify(sess_obj));
    },

    /**
     * 세션 스토리지 조회
     * @param sess_name
     * @param 시간 - 초단위
     * @return json : gap - 시간차이 (millisecond), data - 데이터
     */
    getItem: function (sess_name, time) {
        let sess = sessionStorage.getItem(sess_name);
        if (sess == null){
            //return null;
            return {"cache" : false};
        } else {
            let sess_obj = JSON.parse(sess);
            let data = sess_obj.data;
            let gap = new Date().getTime() - new Date(sess_obj.since).getTime();

            if (gap > time * 1000) {
                return {"cache": false, "data": null};
            }
            //return {"cache" : true, "data": JSON.parse(data)};
            return {"cache" : true, "data": data};
        }
    },

    /* 한방에 처리하는 로직 promise 비동기 문제로 인해 처리 불가

    clientCache: function (url, method, args, options ) {

        console.log("============= 1 ");
        if (args.cache_code == undefined){
            return {resultCode: '400', resultMsg: 'cache code가 없습니다.'};

            // return new Promise(function (resolve, reject) {
            //     resolve({resultCode: '400', resultMsg: 'cache code가 없습니다.'});
            // });
        }


        // this.getCacheLastChange(args.cache_code, function (data) {
        //     // if (data.useCache == true){
        //     if (data == false){
        //         return {resultCode: '200', resultMsg: 'cache data가 존재합니다.', resultData: localStorage.getItem("c_" + args.cache_code + "_data") };
        //
        //         // return new Promise(function (resolve, reject) {
        //         //     resolve({resultCode: '200', resultMsg: 'cache data가 존재합니다.', resultData: localStorage.getItem("c_" + args.cache_code + "_data") });
        //         // });
        //
        //     } else {
        //
        //         if (options === undefined) {
        //             options = {async: true};
        //         } else if (typeof options === 'boolean') {
        //             options = {async: options};
        //         }
        //         return this.call(url, method, options, args);
        //
        //     }
        // });

        // return new Promise(function (resolve, reject) {
        //     resolve({resultCode: '410', resultMsg: '메렁'});
        // });


        let target = this;
        return new Promise(function (resolve, reject) {

            console.log("============= 2 ");
            target.getCacheLastChange(args.cache_code, function (data) {
                if (data == false){        //data.useCache
                    console.log("============= 2-1 ");
                    //return {resultCode: '200', resultMsg: 'cache data가 존재합니다.', resultData: localStorage.getItem("c_" + args.cache_code + "_data") };

                    return new Promise(function (resolve, reject) {
                        console.log("============= 2-1-1 ");
                        resolve({resultCode: '200', resultMsg: 'cache data가 존재합니다.', resultData: localStorage.getItem("c_" + args.cache_code + "_data") });
                    });

                } else {
                    console.log("============= 2-2 ");
                    if (options === undefined) {
                        options = {async: true};
                    } else if (typeof options === 'boolean') {
                        options = {async: options};
                    }
                    return target.call(url, method, options, args);

                }
            });


            console.log("============= 띠로리 ");
        });






    },
    getCacheLastChange: function (cache_code, callback) {
        let curl = "http://localhost:8080/common" + "/clientcache/lastchange?" + "cache_code=org&company_no=" + $("#h_selected_company_no").val();
        this.get(curl).then(function(response) {
            response = JSON.parse(response);
            //console.log(response);

            // 마지막 변경 시간
            let lc = response.resultData;

            if (localStorage.c_org_ts != undefined && localStorage.c_org_company_no != undefined && localStorage.c_org_data != undefined){
                if ( lc > localStorage.c_org_ts){
                    // 새로 구한 api 데이터 사용
                    callback(false);
                } else {
                    // 로컬 스토리지 데이터 사용
                    callback(true);
                }

            } else {
                // 새로 구한 api 데이터 사용
                callback(false);
            }

        }, function(error) {
            console.error("Failed!", error);
            callback(false);
        });
    },
    setClientCache: function (cache_code, cache_data) {
        localStorage.setItem("c_org_ts", new Date().getTime());
        localStorage.setItem("c_org_company_no", $("#h_selected_company_no").val());
        localStorage.setItem("c_org_data", cache_data);
    }
    */

    getUncertToken: function (url, method,callback) {
        let target = this;
        let h_selected_company_no = document.getElementById("h_selected_company_no");
        let h_selected_company_code = document.getElementById("h_selected_company_code");


        // opener 추가해
        if (h_selected_company_no !== null && h_selected_company_no.value !== undefined && h_selected_company_no.value !== '') {
            if (method.toLowerCase() == "get" && url.indexOf("cno=") === -1) {
                if (url.indexOf("?") > -1)
                    url += '&';
                else
                    url += '?';

                url += 'cno=' + h_selected_company_no.value;
            }
        }

        /*
        if (process.env.BUILD_ENV === 'production') {
            if (h_selected_company_code !== null && h_selected_company_code.value !== undefined && h_selected_company_code.value !== '') {
                if (method.toLowerCase() == "get" && url.indexOf("ccode=") === -1) {
                    if (url.indexOf("?") > -1)
                        url += '&';
                    else
                        url += '?';

                    url += 'ccode=' + h_selected_company_code.value;
                }
            }
        }
        */

        let uncertUrl = globals.unCertApiUrl + "/get_token/?url=" + url;

        $.ajax({
            url: uncertUrl,
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
                // console.log("== success: ", {data, textStatus, jqXHR});

                let encText = url + data.cur_date + data.token;
                let hashText = CryptoJS.SHA256(encText);
                // callback(CryptoJS.enc.Base64.stringify(hashText));
                callback(CryptoJS.enc.Base64.stringify(hashText), jqXHR.status);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // console.log("== error: ", {jqXHR, textStatus, errorThrown});
                // callback(null);
                callback(null, jqXHR.status);
            }
        });
    },

    /**
     * XXXXX 사용금지 XXXXX
     * 메일서비스 새창 보안메일에서 사용 - 비인증 호출시 url에 cno가 추가되지 않아야 해서 임시로 추가함
     * @param url
     * @param method
     * @param callback
     */
    getUncertTokenTemp: function (url, method,callback) {
        let target = this;
        let uncertUrl = globals.unCertApiUrl + "/get_token/?url=" + url;
        $.ajax({
            url: uncertUrl,
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
                // console.log("== success: ", {data, textStatus, jqXHR});
                let encText = url + data.cur_date + data.token;
                let hashText = CryptoJS.SHA256(encText);
                // callback(CryptoJS.enc.Base64.stringify(hashText));
                callback(CryptoJS.enc.Base64.stringify(hashText), jqXHR.status);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                // console.log("== error: ", {jqXHR, textStatus, errorThrown});
                // callback(null);
                callback(null, jqXHR.status);
            }
        });
    },

    cacheUrl: function (url) {
        let h_selected_company_no = document.getElementById("h_selected_company_no");
        let h_selected_company_code = document.getElementById("h_selected_company_code");
        if (h_selected_company_no !== null && h_selected_company_no.value !== undefined && h_selected_company_no.value !== '') {
            // 메소드 구분 없음
            if (url.indexOf("cno=") === -1) {
                if (url.indexOf("?") > -1)
                    url += '&';
                else
                    url += '?';

                url += 'cno=' + h_selected_company_no.value;
            }

        }
        /* ccode 제거
        if (process.env.BUILD_ENV === 'production') {
            if (h_selected_company_code !== null && h_selected_company_code.value !== undefined && h_selected_company_code.value !== '') {
                // 메소드 구분 없음
                if (url.indexOf("ccode=") === -1) {
                    if (url.indexOf("?") > -1)
                        url += '&';
                    else
                        url += '?';

                    url += 'ccode=' + h_selected_company_code.value;
                }

            }
        }
        */
        return url;
    },

    /**
     * api 걸린시간 적재
     * @param time : 걸린시간
     * @param url : 호출 url
     * @param nw : 네트워크상태 (true-정상, false-네트워크끊김)
     */
    apiTime: function (time, url, nw) {
        try {

            // 네트워크 속도 적재 제외 api
            let exceptUrl = [
                '/schedule/google/period/each',
                '/common/company/organizationmanagement/tree/department/deptCode',
                '/communication/we-talk/user-invite-search',
                '/achilles/getCurrentLoginUesrList',
                '/stock/we-stock/stock-info',
                '/common/today/weather/reverse/geocode/location/new',
                '/accounts/list'
            ];
            for (let i = 0; i < exceptUrl.length; i++) {
                if ( url.indexOf(exceptUrl[i]) > -1){
                    return;
                }
            }
            if (nw === null || nw === undefined) nw = true;

            let sess = sessionStorage.getItem("api_time");
            if (sess == null){
                let sess_obj = {};
                sess_obj.average = time;
                sess_obj.nw = nw;

                let obj = [];
                obj.push({time : time, timestamp : new Date().getTime()});

                sess_obj.list = obj;
                sessionStorage.setItem("api_time", JSON.stringify(sess_obj));

                // 개발기 테스트
                // if (process.env.BUILD_ENV === 'dev' || process.env.BUILD_ENV === 'local') {
                    if (nw === true && sess_obj.average > 2000)
                        $("#divNetworkStatusWarning").fadeIn();
                    else
                        $("#divNetworkStatusWarning").fadeOut();
                // }

            } else {
                sess = JSON.parse(sess);
                let sess_list = sess.list;

                if (sess_list && sess_list.length >= 20){
                    sess_list.splice(0,1);
                }

                sess_list.push({time : time, timestamp : new Date().getTime()});

                let tot = 0;
                for (let i = 0; i < sess_list.length; i++) {
                    tot += sess_list[i].time;
                }

                sess.average = tot / sess.list.length;
                sess.nw = nw;
                sess.list = sess_list;
                sessionStorage.setItem("api_time", JSON.stringify(sess));

                // 개발기 테스트
                // if (process.env.BUILD_ENV === 'dev' || process.env.BUILD_ENV === 'local') {
                    if (nw === true && sess.average > 3000)
                        $("#divNetworkStatusWarning").fadeIn();
                    else
                        $("#divNetworkStatusWarning").fadeOut();
                // }

            }

            // 개발기 테스트
            // if (process.env.BUILD_ENV === 'dev' || process.env.BUILD_ENV === 'local') {
                if (nw === false) {
                    $("#divNetworkStatusWarning").fadeOut();
                    $("#divNetworkStatusAlert").fadeIn();
                } else {
                    $("#divNetworkStatusAlert").fadeOut();
                }
            // }

        } catch(err) {
            console.log(err);
        }

    },
    /**
     * 인터플랫폼 상대편 api 주소로 변경
     * wehago -> wehagov   /  wehagov -> wehago
     * @param url : 호출 url
     */
    oppositeUrl: function (url) {
        if (url.indexOf(".wehagov.") > -1){
            url = url.replace(".wehagov.", ".wehago.");
        } else {
            url = url.replace(".wehago.", ".wehagov.");
        }
        return url;
    },

};
