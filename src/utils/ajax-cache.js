/**
 * Ajax with promise
 * @see reference from http://www.w3schools.com/ajax/ajax_xmlhttprequest_send.asp
 */
import $ from "jquery";
import "jquery.cookie";
import agent from "./agent";
import clientCache from "./clientCache";
import ajax from "./ajax";
import idb from "./idb";

const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");

// let CryptoJS = require("crypto-js");
// let detector = require('detector');


export default {

    get: function (url, options) {
        let target = this;
        return new Promise(function (resolve, reject) {
            try {
                if (options.idb !== undefined && options.idb.store !== undefined && options.idb.pk !== undefined) {
                    // cache api 호출
                    let curl = globals.wehagoCommonApiUrl + "/clientcache/lastchange?" + "cache_code=" + options.idb.store + "&company_no=" + $("#h_selected_company_no").val();
                    let searchItem = $("#h_selected_company_no").val();
                    if (options.idb.store.indexOf("contacts") > -1) {
                        curl = globals.contactsApiUrl + "/clientcache?" + "cache_code=" + options.idb.store + "&user_no=" + $("#h_user_no").val();
                        searchItem = $("#h_user_no").val();
                    }
                    ajax.call(curl, "GET", options).then(function (response) {
                        response = JSON.parse(response);
                        let lc = response.resultData;   // 마지막 변경시간
                        if (lc === 0){
                            ajax.call(url, "GET", options).then((response) => {
                                response = JSON.parse(response);
                                resolve(response);
                                target.insertIdb(response, options);
                            }, (err) => {
                                reject(err);
                            });
                            return;
                        }

                        idb.getItem(searchItem, options.idb).then((item) => {
                            if (item === undefined) {
                                // 새로 구한 api 데이터 사용
                                ajax.call(url, "GET", options).then((response) => {
                                    response = JSON.parse(response);
                                    resolve(response);
                                    target.insertIdb(response, options, lc);
                                }, (err) => {
                                    reject(err);
                                });
                                return;
                            } else {
                                if (item.data_timestamp === undefined || lc > item.data_timestamp) {
                                    // 새로 구한 api 데이터 사용
                                    ajax.call(url, "GET", options).then((response) => {
                                        response = JSON.parse(response);
                                        resolve(response);
                                        target.insertIdb(response, options, lc);
                                    }, (err) => {
                                        reject(err);
                                    });
                                    return;
                                } else {

                                    // indexedDB 데이터 사용
                                    resolve(item);
                                    return;
                                }
                            }
                        }).catch(function (err) {
                            console.log(err);
                            ajax.call(url, "GET", options).then((response) => {
                                response = JSON.parse(response);
                                resolve(response);
                                target.insertIdb(response, options, lc);
                            }, (err) => {
                                reject(err);
                            });
                            return;
                        });
                    }).catch(function (err) {
                        console.log(err);
                        ajax.call(url, "GET", options).then((response) => {
                            response = JSON.parse(response);
                            resolve(response);
                            target.insertIdb(response, options, 0);
                        }, (err) => {
                            reject(err);
                        });
                        return;
                    });
                } else {
                    ajax.call(url, "GET", options).then((response) => {
                        response = JSON.parse(response);
                        resolve(response);
                        target.insertIdb(response, options, 0);
                    }, (err) => {
                        reject(err);
                    });
                }
            } catch (err) {
                console.log("client cashe error");
                ajax.call(url, "GET", options).then((response) => {
                    response = JSON.parse(response);
                    resolve(response);
                    target.insertIdb(response, options, 0);
                }, (err) => {
                    reject(err);
                });
                return;
            }

        });

    },

    post: function (url, args, options) {
        let target = this;
        return new Promise(function (resolve, reject) {
            try {
                if (options.idb !== undefined && options.idb.store !== undefined && options.idb.pk !== undefined) {
                    // cache api 호출
                    let curl = globals.wehagoCommonApiUrl + "/clientcache/lastchange?" + "cache_code=" + options.idb.store + "&company_no=" + $("#h_selected_company_no").val();
                    let searchItem = $("#h_selected_company_no").val();
                    if (options.idb.store.indexOf("contacts") > -1) {
                        curl = globals.contactsApiUrl + "/clientcache?" + "cache_code=" + options.idb.store + "&user_no=" + $("#h_user_no").val();
                        searchItem = $("#h_user_no").val();
                    }
                    ajax.call(curl, "GET", options).then(function (response) {
                        response = JSON.parse(response);
                        let lc = response.resultData;   // 마지막 변경시간
                        if (lc === 0){
                            ajax.call(url, "POST", options, args).then((response) => {
                                response = JSON.parse(response);
                                resolve(response);
                                target.insertIdb(response, options, lc);
                            }, (err) => {
                                reject(err);
                            });
                            return;
                        }

                        idb.getItem(searchItem, options.idb).then((item) => {
                            if (item === undefined) {
                                // 새로 구한 api 데이터 사용
                                ajax.call(url, "POST", options, args).then((response) => {
                                    response = JSON.parse(response);
                                    resolve(response);
                                    target.insertIdb(response, options, lc);
                                }, (err) => {
                                    reject(err);
                                });
                                return;
                            } else {
                                if (item.data_timestamp === undefined || lc > item.data_timestamp) {
                                    // 새로 구한 api 데이터 사용
                                    ajax.call(url, "POST", options, args).then((response) => {
                                        response = JSON.parse(response);
                                        resolve(response);
                                        target.insertIdb(response, options, lc);
                                    }, (err) => {
                                        reject(err);
                                    });
                                    return;
                                } else {

                                    // indexedDB 데이터 사용
                                    resolve(item);
                                    return;
                                }
                            }
                        }).catch(function (err) {
                            console.log(err);
                            ajax.call(url, "POST", options, args).then((response) => {
                                response = JSON.parse(response);
                                resolve(response);
                                target.insertIdb(response, options, lc);
                            }, (err) => {
                                reject(err);
                            });
                            return;
                        });
                    }).catch(function (err) {
                        console.log(err);
                        ajax.call(url, "POST", options, args).then((response) => {
                            response = JSON.parse(response);
                            resolve(response);
                            target.insertIdb(response, options, 0);
                        }, (err) => {
                            reject(err);
                        });
                        return;
                    });
                } else {
                    ajax.call(url, "POST", options, args).then((response) => {
                        response = JSON.parse(response);
                        resolve(response);
                        target.insertIdb(response, options, 0);
                    }, (err) => {
                        reject(err);
                    });
                }
            } catch (err) {
                console.log("client cashe error");
                ajax.call(url, "POST", options, args).then((response) => {
                    response = JSON.parse(response);
                    resolve(response);
                    target.insertIdb(response, options, 0);
                }, (err) => {
                    reject(err);
                });
                return;
            }

        });

    },

    insertIdb: function (response, options, ts) {
        // response = JSON.parse(response);
        if (options.idb.store.indexOf("contacts") > -1){
            response.user_no = $("#h_user_no").val();
        } else {
            response.company_no = $("#h_selected_company_no").val();
        }

        if (ts === undefined || ts === 0)
            response.data_timestamp = new Date().getTime();
        else
            response.data_timestamp = ts;

        // indexedDB 저장
        idb.setItem(response, options.idb);

    }

    /*
    get: function (url, options) {

        let target = this;
        let reqPromise;

        try {
            reqPromise = new Promise(function (resolve, reject) {
            //return new Promise(function (resolve, reject) {

                if (options.idb !== undefined && options.idb.store !== undefined && options.idb.pk !== undefined) {

                    // cache api 호출
                    let curl = globals.wehagoCommonApiUrl + "/clientcache/lastchange?" + "cache_code=" + options.idb.store + "&company_no=" + $("#h_selected_company_no").val();
                    if (options.idb.store.indexOf("contacts") > -1)
                        curl = globals.contactsApiUrl + "/clientcache?" + "cache_code=" + options.idb.store + "&user_no=" + $("#h_user_no").val();

                    ajax.call(curl, "GET", options).then(function (response) {

                        let lc = response.resultData;   // 마지막 변경시간

                        idb.getItem(options.idb.pk, options.idb).then((item) => {

                            if (item === undefined) {
                                // 새로 구한 api 데이터 사용
                                //return ajax.call(url, "GET", options);
                                //return ajax.get(url, options);
                                ajax.call(url, "GET", options).then((response) => {
                                    resolve(response);
                                }, (err) => {
                                    reject(err);
                                });
                                return reqPromise;
                            } else {

                                if (item.data_timestamp === undefined || lc > item.data_timestamp) {

                                    // 새로 구한 api 데이터 사용
                                    ajax.call(url, "GET", options).then((response) => {
                                        resolve(response);
                                    }, (err) => {
                                        reject(err);
                                    });
                                    return reqPromise;
                                } else {

                                    // indexedDB 데이터 사용
                                    resolve(item);
                                    return reqPromise;
                                }
                            }

                        }).catch(function (err) {
                            console.log(err);
                            ajax.call(url, "GET", options).then((response) => {
                                resolve(response);
                            }, (err) => {
                                reject(err);
                            });
                            return reqPromise;
                        });

                    }).catch(function (err) {
                        console.log(err);
                        ajax.call(url, "GET", options).then((response) => {
                            resolve(response);
                        }, (err) => {
                            reject(err);
                        });
                        return reqPromise;
                    });

                }

            });
        } catch (err) {
            console.log("client cashe error");
            ajax.call(url, "GET", options).then((response) => {
                resolve(response);
            }, (err) => {
                reject(err);
            });
            return reqPromise;
        }

        return reqPromise;
    }
*/

    /*
    get: function (url, options) {

        let target = this;
        let reqPromise;

        try {

                if (options.idb !== undefined && options.idb.store !== undefined && options.idb.pk !== undefined) {

                    // cache api 호출
                    let curl = globals.wehagoCommonApiUrl + "/clientcache/lastchange?" + "cache_code=" + options.idb.store + "&company_no=" + $("#h_selected_company_no").val();
                    if (options.idb.store.indexOf("contacts") > -1)
                        curl = globals.contactsApiUrl + "/clientcache?" + "cache_code=" + options.idb.store + "&user_no=" + $("#h_user_no").val();

                    //ajax.call(curl, "GET", options).then(function (response) {
                    ajax.get(curl).then(function (response) {
                        response = JSON.parse(response);
                        let lc = response.resultData;   // 마지막 변경시간

                        idb.getItem(options.idb.pk, options.idb).then((item) => {

                            if (item === undefined) {
                                // 새로 구한 api 데이터 사용
                                //return ajax.call(url, "GET", options);
                                return ajax.get(url, options);
                            } else {

                                if (item.data_timestamp === undefined || lc > item.data_timestamp) {

                                    // 새로 구한 api 데이터 사용
                                    return ajax.call(url, "GET", options);
                                } else {

                                    return new Promise(function (resolve, reject) {
                                        // indexedDB 데이터 사용
                                        resolve(item);
                                    });
                                }
                            }

                        }).catch(function (err) {
                            console.log(err);
                            return ajax.call(url, "GET", options);
                        });

                    }).catch(function (err) {
                        console.log(err);
                        return ajax.call(url, "GET", options);
                    });

                }


        } catch (err) {
            console.log("client cashe error");
            return ajax.call(url, "GET", options);
        }

    }
    */
    /*
    get: function (url, options) {

        let target = this;
        let reqPromise;

        try {
            reqPromise = new Promise(function (resolve, reject) {

                if (options.idb !== undefined && options.idb.store !== undefined && options.idb.pk !== undefined) {

                    // cache api 호출
                    let curl = globals.wehagoCommonApiUrl + "/clientcache/lastchange?" + "cache_code=" + options.idb.store + "&company_no=" + $("#h_selected_company_no").val();
                    if (options.idb.store.indexOf("contacts") > -1)
                        curl = globals.contactsApiUrl + "/clientcache?" + "cache_code=" + options.idb.store + "&user_no=" + $("#h_user_no").val();

                    ajax.call(curl, "GET", options).then(function (response) {

                        let lc = response.resultData;   // 마지막 변경시간

                        idb.getItem(options.idb.pk, options.idb).then((item) => {

                            if (item === undefined) {
                                // 새로 구한 api 데이터 사용
                                return ajax.call(url, "GET", options);
                            } else {

                                if (item.data_timestamp === undefined || lc > item.data_timestamp) {

                                    // 새로 구한 api 데이터 사용
                                    return ajax.call(url, "GET", options);
                                } else {

                                    // indexedDB 데이터 사용
                                    resolve(item);
                                    return reqPromise;
                                }
                            }

                        }).catch(function (err) {
                            console.log(err);
                            return ajax.call(url, "GET", options);
                        });

                    }).catch(function (err) {
                        console.log(err);
                        return ajax.call(url, "GET", options);
                    });

                }

            });
        } catch (err) {
            console.log("client cashe error");
            return ajax.call(url, "GET", options);
        }

    }
*/

    /*
    get: function (url, options) {
        let target = this;
        let reqPromise;
console.log("==== -1");
        try {
console.log("==== 0");
            reqPromise = new Promise(function (resolve, reject) {
console.log("==== 1");
                if (options.idb !== undefined && options.idb.store !== undefined && options.idb.pk !== undefined) {
console.log("==== 2");
                    idb.getItem(options.idb.pk, options.idb).then((item) => {
console.log("==== 3");
                        // console.log(JSON.stringify(item));
                        if (item === undefined) {
console.log("==== 4");
                            // cache api 호출
                            let curl = globals.wehagoCommonApiUrl + "/clientcache/lastchange?" + "cache_code=" + options.idb.store + "&company_no=" + $("#h_selected_company_no").val();
                            if (options.idb.store.indexOf("contacts") > -1)
                                curl = globals.contactsApiUrl + "/clientcache?" + "cache_code=" + options.idb.store + "&user_no=" + $("#h_user_no").val();
console.log("==== 5");
                            ajax.call(curl, "GET", options).then(function (response) {
console.log("==== 6");
                                let lc = response.resultData;   // 마지막 변경시간
                                if (lc > item.data_timestamp) {
console.log("==== 7");
                                    // 새로 구한 api 데이터 사용
                                    ajax.call(url, "GET", options);
                                    return reqPromise;
                                } else {
console.log("==== 8");
                                    // indexedDB 데이터 사용
                                    resolve(item);
                                    return reqPromise;
                                }


                            }).catch(function (err) {
                                console.log(err);
                                return ajax.call(url, "GET", options);
                            });
                        }
                    }).catch(function (err) {
                        console.log(err);
                        return ajax.call(url, "GET", options);
                    });

                }

            });
        } catch (err) {
            console.log("client cashe error");

        }

        return ajax.call(url, "GET", options);
    },
*/

};
