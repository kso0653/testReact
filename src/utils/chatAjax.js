/**
 * Ajax with promise
 * @see reference from http://www.w3schools.com/ajax/ajax_xmlhttprequest_send.asp
 */
import $ from 'jquery'
import 'jquery.cookie'

export default {
    get: function (url, options) {
        if (options == undefined) {
            options = {async: true};
        } else if (typeof options == 'boolean'){
            options = {async: options};
        }
        return this.call(url, "GET", options);
    },
    post: function (url, args, options) {
        if (options == undefined) {
            options = {async: true};
        } else if (typeof options == 'boolean'){
            options = {async: options};
        }
        return this.call(url, "POST", options, args);
    },
    put: function (url, args, options) {
        if (options == undefined) {
            options = {async: true};
        } else if (typeof options == 'boolean'){
            options = {async: options};
        }
        return this.call(url, "PUT", options, args);
    },
    delete: function (url, args, options) {
        if (options == undefined) {
            options = {async: true};
        } else if (typeof options == 'boolean'){
            options = {async: options};
        }
        return this.call(url, "DELETE", options, args);
    },
    patch: function (url, args, options) {
        if (options == undefined) {
            options = {async: true};
        } else if (typeof options == 'boolean'){
            options = {async: options};
        }
        return this.call(url, "PATCH", options, args);
    },
    call: function(url, method, options, args) {
        return new Promise(function(resolve, reject) {

            let defaults = {
                contextType: "application/x-www-form-urlencoded",
                async: true
            };

            if (options || options == undefined) {
                options = $.extend(defaults, options);
            }

            var req = new XMLHttpRequest();
            // if (method == null || method == undefined) method = "GET";
            //
            // if (document.getElementById("h_selected_company_no") != null && document.getElementById("h_selected_company_no").value != undefined && document.getElementById("h_selected_company_no").value != ''){
            //     if (method == "GET"){
            //         if (url.indexOf("cno=") == -1) {
            //             if (url.indexOf("?") > -1)
            //                 url += '&';
            //             else
            //                 url += '?';
            //
            //             url += 'cno=' + document.getElementById("h_selected_company_no").value;
            //         }
            //     } else {
            //         if (args.cno == undefined ||args.cno == '')
            //             args.cno = document.getElementById("h_selected_company_no").value;
            //     }
            // }
            // if (document.getElementById("h_selected_company_code") != null && document.getElementById("h_selected_company_code").value != undefined && document.getElementById("h_selected_company_code").value != ''){
            //     if (method == "GET"){
            //         if (url.indexOf("ccode=") == -1) {
            //             if (url.indexOf("?") > -1)
            //                 url += '&';
            //             else
            //                 url += '?';
            //
            //             url += 'ccode=' + document.getElementById("h_selected_company_code").value;
            //         }
            //     } else {
            //         if (args.ccode == undefined ||args.ccode == '')
            //             args.ccode = document.getElementById("h_selected_company_code").value;
            //     }
            // }

            var param = "";
            if (args && (method.toUpperCase() == 'POST' || method.toUpperCase() == 'PUT' || method.toUpperCase() == 'DELETE' || method.toUpperCase() == 'PATCH')) {
                    var argcount = 0;
                        for (var key in args) {
                        if (args.hasOwnProperty(key)) {
                            if (argcount++) {
                                param += '&';
                            }
                            param += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
                        }
                    }
            }

            req.open(method, url, options.async);
            req.setRequestHeader("Content-type", options.contextType);
            req.withCredentials = false; // CORS API 호출시 필수!!! (true 이어야지 쿠키값이 전달 됨)
            //req.setRequestHeader("Authorization", "Bearer "+$.cookie("AUTH_A_TOKEN")); // OAuth 2.0 인증

            req.onload = function() {
                if (req.status >= 200 && req.status < 300) {
                    resolve(req.response);
                } else {
                    reject(req.response);
                }
            };
            req.onerror = function() {
                reject(Error("Network Error"));
            };

            if (options.contextType.toLowerCase() == "application/json")
                req.send(JSON.stringify(args));
            else
                req.send(param);

        });
    }
};
