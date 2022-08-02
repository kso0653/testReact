/**
 * Ajax with promise
 * @see reference from http://www.w3schools.com/ajax/ajax_xmlhttprequest_send.asp
 */
import $ from "jquery";
import "jquery.cookie";
import {DOMAIN_REG_EXP} from "../components/Header/Enums/Enums";

// fixme: globals 경로 확인 필요
const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");

let CryptoJS = require("crypto-js");
const uuidV1 = require('uuid/v1');

// fixme: 서비스코드 확인 필요
const SERVICE_CODE = "backoffice";

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

    getToken: function (data, callback) {
        let service_key, service_code;
        if (data.service_code != null || data.service_code != undefined)
            service_code = data.service_code;

        let url = globals.unCertApiUrl + '/common/thirdparty/request-token/nonsession';

        if (data.cno != undefined)
            url += "?cno=" + data.cno;

        this.ajaxUncert({
                url: url,
                method: "POST",
                data: {
                    service_key: service_key,
                    service_code: service_code,
                    cno: data.cno,
                    thirdparty_a_token: data.thirdparty_a_token
                }
            },
            function (response) {
                let result = JSON.parse(response);
                console.log(result);
                if (result.resultCode == 200){
                    let regExp = DOMAIN_REG_EXP;
                    let DOMAIN_NAME = document.domain.substring(document.domain.search(regExp));
                    $.cookie(service_code + "_token", result.resultData.thirdparty_a_token, {path:"/", domain:DOMAIN_NAME});
                } else {
                    console.log("error - ", result.resultMsg);
                }
                callback(result);
            });
    },

    call: function(url, method, options, args) {
        let target = this;
        let xmlReq;
        var isThirdPartyApi = true;

        try {
            xmlReq = new Promise(function (resolve, reject) {
            //return new Promise(function (resolve, reject) {
                let defaults = {
                    contextType: "application/x-www-form-urlencoded",
                    async: true,
                    filedownload: false
                };

                if (url.indexOf("thirdparty/request-token") > -1 || url.indexOf("common/cs/enrollticket") > -1 || options.signature != undefined) {
                    isThirdPartyApi = false;
                }

                // 서비스코드 url에서 자동으로 빼오지 않을경우 수정 필요
                let service_code = SERVICE_CODE;
                if ($.cookie(service_code + "_token") == undefined && isThirdPartyApi){
                    reject(JSON.stringify({
                        "errorCode": 400,
                        "errorMsg": "service token is required.",
                    }));
                    return;
                }

                if (options || options === undefined) {
                    options = $.extend(defaults, options);
                }

                let req = new XMLHttpRequest();
                if (method === null || method === undefined) method = "GET";

                if (options.signature == undefined || url.indexOf("thirdparty/request-token") > -1) {
                    if (document.getElementById("h_selected_company_no") !== null && document.getElementById("h_selected_company_no").value !== undefined && document.getElementById("h_selected_company_no").value !== '') {
                        if (method.toUpperCase() === "GET") {
                            if (url.indexOf("cno=") === -1) {
                                if (url.indexOf("?") > -1)
                                    url += '&';
                                else
                                    url += '?';

                                url += 'cno=' + document.getElementById("h_selected_company_no").value;
                            }
                        } else if (method.toUpperCase() === 'DELETE') {
                            if (url.indexOf("cno=") === -1) {
                                if (url.indexOf("?") > -1)
                                    url += '&';
                                else
                                    url += '?';

                                url += 'cno=' + document.getElementById("h_selected_company_no").value;
                            }
                            if (args.cno === undefined || args.cno === '')
                                args.cno = document.getElementById("h_selected_company_no").value;
                        } else {
                            if (args.cno === undefined || args.cno === '')
                                args.cno = document.getElementById("h_selected_company_no").value;
                        }
                    } else if ($.cookie("h_selected_company_no") != undefined){
                        if (method.toUpperCase() === "GET") {
                            if (url.indexOf("cno=") === -1) {
                                if (url.indexOf("?") > -1)
                                    url += '&';
                                else
                                    url += '?';

                                url += 'cno=' + $.cookie("h_selected_company_no");
                            }
                        } else if (method.toUpperCase() === 'DELETE') {
                            if (url.indexOf("cno=") === -1) {
                                if (url.indexOf("?") > -1)
                                    url += '&';
                                else
                                    url += '?';

                                url += 'cno=' + $.cookie("h_selected_company_no");
                            }
                            if (args.cno === undefined || args.cno === '')
                                args.cno = $.cookie("h_selected_company_no");
                        } else {
                            if (args.cno === undefined || args.cno === '')
                                args.cno = $.cookie("h_selected_company_no");
                        }
                    }
                }

                /*
                if (document.getElementById("h_selected_company_code") !== null && document.getElementById("h_selected_company_code").value !== undefined && document.getElementById("h_selected_company_code").value !== '') {
                    if (method.toUpperCase() === "GET") {
                        if (url.indexOf("ccode=") === -1) {
                            if (url.indexOf("?") > -1)
                                url += '&';
                            else
                                url += '?';

                            url += 'ccode=' + document.getElementById("h_selected_company_code").value;
                        }
                    } else if (method.toUpperCase() === 'DELETE') {
                        if (url.indexOf("ccode=") === -1) {
                            if (url.indexOf("?") > -1)
                                url += '&';
                            else
                                url += '?';

                            url += 'ccode=' + document.getElementById("h_selected_company_code").value;
                        }
                        if (args.ccode === undefined || args.ccode === '')
                            args.ccode = document.getElementById("h_selected_company_code").value;
                    } else {
                        if (args.ccode === undefined || args.ccode === '')
                            args.ccode = document.getElementById("h_selected_company_code").value;
                    }
                } else if ($.cookie("h_selected_company_code") != undefined){
                    if (method.toUpperCase() === "GET") {
                        if (url.indexOf("ccode=") === -1) {
                            if (url.indexOf("?") > -1)
                                url += '&';
                            else
                                url += '?';

                            url += 'ccode=' + $.cookie("h_selected_company_code");
                        }
                    } else if (method.toUpperCase() === 'DELETE') {
                        if (url.indexOf("ccode=") === -1) {
                            if (url.indexOf("?") > -1)
                                url += '&';
                            else
                                url += '?';

                            url += 'ccode=' + $.cookie("h_selected_company_code");
                        }
                        if (args.ccode === undefined || args.ccode === '')
                            args.ccode = $.cookie("h_selected_company_code");
                    } else {
                        if (args.ccode === undefined || args.ccode === '')
                            args.ccode = $.cookie("h_selected_company_code");
                    }
                }
                */

                //let ts = new Date().getTime();
                let ts = Math.floor(Date.now()/1000);

                if ($.cookie("wehago_s") !== undefined && options.signature == undefined) {
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

                // if (options.contextType == "application/vnd.ms-excel" || options.contextType == "application/octet-stream")
                // req.responseType = 'arraybuffer';
                if (options.filedownload == true)
                    req.responseType = 'arraybuffer';


                if ( options.contextType == "multipart/form-data"){
                    if (args.get("cno") == null)
                        args.append("cno", document.getElementById("h_selected_company_no").value);
                    /*
                    if (args.get("ccode") == null)
                        args.append("ccode", document.getElementById("h_selected_company_code").value);
                    */
                } else {
                    req.setRequestHeader("Content-type", options.contextType);
                }

                if (options.signature != undefined){
                    console.log("options.signature : ", options.signature);
                    req.setRequestHeader("signature", options.signature);
                }

                req.withCredentials = true; // CORS API 호출시 필수!!! (true 이어야지 쿠키값이 전달 됨)
                req.setRequestHeader("Authorization", "Bearer " + $.cookie("AUTH_A_TOKEN")); // OAuth 2.0 인증
                let transactionId = target.getTransactionId();
                req.setRequestHeader("transaction-id", transactionId); // 단계별 로그 transaction_id
                req.setRequestHeader("client-id", service_code); // 단계별 로그 clientId
                req.setRequestHeader("service", target.getService(url)); // 단계별 로그 service
                req.setRequestHeader("timestamp", ts);

                if (isThirdPartyApi) {
                    // service-sign
                    var service_hash_key = $.cookie(service_code + "_token");
                    service_hash_key = CryptoJS.SHA256((service_hash_key + ts).toString(CryptoJS.enc.Utf8), service_hash_key).toString(CryptoJS.enc.Base64);
                    var serviceSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(target.getLocation(url).pathname + target.getLocation(url).search + ts + transactionId, service_hash_key));

                    req.setRequestHeader("service-sign", serviceSign);
                    req.setRequestHeader("service-token", $.cookie(service_code + "_token"));
                }

                req.onload = function () {
                    if (req.status >= 200 && req.status < 300) {
                        resolve(req.response);
                    } else if (req.status === 401) {
                        let response = JSON.parse(req.response);
                        // 세션만료 일 경우 게이트웨이에서 리턴 오는 값 ::: {"errors": {"code": "E002", "message": "Token is not exists. "}}
                        if (response.errors !== undefined) {
                            let gatewayResponse = response.errors;
                            // 세션 만료
                            if (gatewayResponse.code === "E002" && gatewayResponse.message.indexOf("Token is not exists") > -1) {
                                //if ($.cookie("AUTH_A_TOKEN") !== "" && $.cookie("AUTH_A_TOKEN") !== undefined) {
                                //alert("세션이 만료되었습니다.");
                                let regExp = DOMAIN_REG_EXP;
                                $.removeCookie("AUTH_A_TOKEN", {path: "/", domain: document.domain.substring(document.domain.search(regExp))});
                                $.removeCookie("AUTH_R_TOKEN", {path: "/", domain: document.domain.substring(document.domain.search(regExp))});
                                $.removeCookie("randomkey", {path: "/", domain: document.domain.substring(document.domain.search(regExp))});
                                $.removeCookie("SESSION_KEY", {path: "/", domain: document.domain.substring(document.domain.search(regExp))});
                                $.removeCookie("wehago_s", {path: "/", domain: document.domain.substring(document.domain.search(regExp))});
                                $.removeCookie(service_code + "_token", {path: "/", domain: document.domain.substring(document.domain.search(regExp))});
                                $.cookie("IS_REFRESH", "T", {expires: 1, path: "/"});
                                if (process.env.PROD_TYPE === "smarta") {
                                    document.location.href = globals.portalUrl + "/#/login?type=expired";
                                } else {
                                    document.location.href = "/#/login?type=expired";
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
                req.onerror = function () {
                    // reject(Error("Network Error"));
                    reject(JSON.stringify({
                        "errorCode": 500,
                        "errorMsg": "Network Error.",
                    }));
                };

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
            if (path !== "") {
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

        /* UUID 생성
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

        let match,
            pl     = /\+/g,
            search = /([^&=]+)=?([^&]*)/g,
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

    getUncertToken: function (url, method,callback) {
        // if (document.getElementById("h_selected_company_no") !== null && document.getElementById("h_selected_company_no").value !== undefined && document.getElementById("h_selected_company_no").value !== '') {
        //     if (method.toLowerCase() == "get" && url.indexOf("cno=") === -1) {
        //         if (url.indexOf("?") > -1)
        //             url += '&';
        //         else
        //             url += '?';
        //         url += 'cno=' + document.getElementById("h_selected_company_no").value;
        //     }
        // }

        let uncertUrl = globals.unCertApiUrl + "/get_token/?url=" + url;
        $.ajax({
            url: uncertUrl,
            type: "GET",
            data: {},
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            crossDomain: true,
            async: true,
            success: function (data, textStatus) {
                console.log("== success: ",data);
                let encText = url + data.cur_date + data.token;
                let hashText = CryptoJS.SHA256(encText);
                callback(CryptoJS.enc.Base64.stringify(hashText));
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("== error: ",xhr);
                callback(null);
            }
        });
    },

    ajaxUncert: function (params, callback) {
        var target = this;
        var tempUrl = params.url.replace(".api.", ".api0.");
        tempUrl = this.getLocation(tempUrl);

        var uncertUrl = tempUrl.protocol + "//" + tempUrl.host + "/get_token/?url=" + tempUrl.pathname + tempUrl.search;
        $.ajax({
            url: uncertUrl,
            type: "GET",
            data: {},
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            crossDomain: true,
            async: true,
            success: function (data, textStatus) {
                //console.log("== success: ",data);
                var encText = tempUrl.pathname + tempUrl.search + data.cur_date + data.token;
                var hashText = CryptoJS.SHA256(encText);
                params.options = {signature : CryptoJS.enc.Base64.stringify(hashText)};

                target.call(params.url, "POST", params.options, params.data).then(function(response) {
                    callback(response);
                }.bind(this), function(error) {
                    console.error("Failed!", error);
                    alert(error);
                }.bind(this));
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("== error: ",xhr);
                callback(null);
            }
        });
    },

};
