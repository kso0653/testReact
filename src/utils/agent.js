/**
 * Ajax with promise
 * @see reference from http://www.w3schools.com/ajax/ajax_xmlhttprequest_send.asp
 */
import $ from 'jquery'
import 'jquery.cookie'
import aes256 from './aes256'
import ajax from './ajax'

const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");
let detector = require('detector');

export default {

    remoteMethods: [
        'Connected', 'Connection', 'ConnectionPreData', 'IDCheck', 'ReConnection', 'Disconnection', 'ApplicationRun', 'ExecuteApp',
        'ExecuteVDI', 'ExecuteDCloudExplorer', 'GetNetworkInfo', 'AddRefCnt', 'RemoveRefCnt', 'IsProcessRun',
        'CreateShortCut', 'UploadCert', 'GetLastInputTime', 'HostAppRun', 'ExecuteUpdater', 'ExecutePreDataSmartA', 'DownLoadFiles',
        'ConnectionPlatformManager'
    ],
    scrappingMethods: [
        'GetDriveList', 'GetCertFileInfo', 'CheckCertFilePassword', 'RegisterCertFile',
        'RunScrappingProcess', 'RunScrappingLibrary', 'SetupSecurityModule',"RunExpenseBill","SetEBResult","GetEBResult","ExpenseBillStatus", "CheckScrappingProcess", "Version"
    ],
    printMethods: [
        'ShowSmartAPrintDialog'
    ],
    invoiceMethods: [
        'WehagoInvoice'
    ],
    smartaNtsMethods: [
        'SmartaNTS',
        'WehagoNTS'
    ],
    taxMethods: [
        'RunSmartAPlus',
        'ConversionHometaxPDF',
        'RunBackupAndRecovery',
        'RunBaseInfoHybrid'
    ],
    yetTaxMethods: [
        'ConversionHometaxPDF'
    ],
    certMethods: [
        'GetDriveList_Cert', 'GetCertFileInfo_Cert', 'CheckCertFilePassword_Cert',
    ],
    neoRsMethods: [
        'RunNeoRSDesk', 'RunNeoRSAgent', 'RunRS10Desk', 'RunRS10Agent'
    ],
    call: function (obj, callback, options) {
        let defaults = {
            type: "POST",
            dataType: "json",
            async: true,
            timeout: 20000,
            block: true,
            contentType: '',
            mainMethod: 'CallMinionAgent',
            agentName: 'WehagoAgent'
        };

        if (options || options == undefined) {
            options = $.extend(defaults, options);
        }

        let dataObj;
        if (obj == null)
            dataObj = null;
        else {
            // 기존코드 수정 안하게 처리
            // 메인메소드 셋팅
            let m = obj.Method;
            // console.log("m =" + m);
            if (m == undefined) {
                options.mainMethod = obj.MainMethod;
                options.agentName = obj.AgentName;
            } else {
                // 에이전트 처리
                if (this.remoteMethods.indexOf(m) > -1)
                    options.agentName = 'WehagoRemoteApp';
                else if (this.scrappingMethods.indexOf(m) > -1)
                    options.agentName = 'WehagoScrapping';
                else if (this.printMethods.indexOf(m) > -1)
                    options.agentName = 'WehagoPrint';
                else if (this.smartaNtsMethods.indexOf(m) > -1)
                    options.agentName = 'WehagoNTS';
                else if (this.taxMethods.indexOf(m) > -1)
                    options.agentName = 'WehagoTax';
                else if (this.yetTaxMethods.indexOf(m) > -1)
                    options.agentName = 'WehagoYETax';
                else if (this.certMethods.indexOf(m) > -1)
                    options.agentName = 'WehagoCert';
                else if (this.neoRsMethods.indexOf(m) > -1)
                    options.agentName = 'WehagoNeoRS';

                // wehagov 에이전트명 변경
                if (process.env.BUILD_ENV === 'wehagov') {
                    if (this.remoteMethods.indexOf(m) > -1)
                        options.agentName = 'WehagoVRemoteApp';
                    else if (this.scrappingMethods.indexOf(m) > -1)
                        options.agentName = 'WehagoVScrapping';
                    else if (this.printMethods.indexOf(m) > -1)
                        options.agentName = 'WehagoVPrint';
                    else if (this.smartaNtsMethods.indexOf(m) > -1)
                        options.agentName = 'WehagoVNTS';
                    else if (this.taxMethods.indexOf(m) > -1)
                        options.agentName = 'WehagoVTax';
                    else if (this.yetTaxMethods.indexOf(m) > -1)
                        options.agentName = 'WehagoVYETax';
                }
            }

            obj.MainMethod = options.mainMethod;
            obj.AgentName = options.agentName;

            // console.log("메인메소드셋팅 - ", obj.MainMethod);
            // console.log("에이전트셋팅 - ", obj.AgentName);

            if (obj.Params != undefined)
                obj.Params.hashKey = $.cookie("wehago_s");

            // console.log("에이전트 파라미터 - ", obj);

            dataObj = {
                value: this.aesEnc(JSON.stringify(obj).replace(/:/g, "*")),
            };

        }

        if (obj != null) {
            // console.log(obj.Method, "== value: ", JSON.stringify(obj));
        }

        $.ajax({
            url: "" + globals.agentUrl,
            type: options.type,
            data: JSON.stringify(dataObj),
            dataType: options.dataType,
            contentType: 'application/json; charset=utf-8',
            crossDomain: true,
            async: options.async,
            success: function (data, textStatus) {
                if (obj != null) {
                    // console.log(obj.Method, "== success: ", data);
                }
                if(data.resultCode !== undefined && data.resultCode !== null && data.resultCode !== "0000"){
                    console.log("### Agent 연동 오류 :: ", data.resultCode, " :: ", data.resultMsg !== undefined
                    && data.resultMsg !== null ? decodeURIComponent(data.resultMsg).replace(/\+/gi, " ") : "");
                }
            },
            error: function (xhr, textStatus, errorThrown) {
                console.log("== error: ",xhr);
                if (obj != null) {
                    if (xhr.status == 12002) {
                        //alert("TimeOut");
                        console.log("TimeOut");
                    } else {
                        //alert(errorThrown);
                        console.log(errorThrown);
                    }
                }
            },
            complete: function (xhr, textStatus) {
                $('body').trigger("mousemove");
                if (xhr.responseJSON != undefined && xhr.responseJSON.resultMsg != undefined) {
                    xhr.responseJSON.resultMsg = decodeURIComponent(xhr.responseJSON.resultMsg).replace(/\+/gi, " ");
                }

                if (obj.Method === "ConnectionPlatformManager"){
                    return;
                }

                callback(xhr, textStatus);
            },
            timeout: options.timeout
        });

    },

    isInstalled: function (obj, callback) {
        let target = this;
        let p = {MainMethod: 'GetMinionAgentStatus', AgentName: 'WehagoAgent'};
        // wehagov 에이전트명 변경
        if (process.env.BUILD_ENV === 'wehagov') {
            p = {MainMethod: 'GetMinionAgentStatus', AgentName: 'WehagoVAgent'};
        }
        this.call(p, function (data, status) {
            if (status == "success") {
                let result = data.responseJSON;
                if (result.resultCode != null && result.resultCode == "0000") {
                    // console.log("DCloudClientAgent installed!");
                    //callback(true);
                    // 버전체크 추가
                    // console.log("======= 버전 : ", data.responseJSON.resultMsg);
                    let agentVersion = data.responseJSON.resultMsg.toLowerCase().replace(/\./g, "");
                    let currVersion = globals.agentVersion && globals.agentVersion.replace(/\./g, "");

                    if (agentVersion == "true" || currVersion > agentVersion) {
                        callback("agentUpdate");
                        return;
                    } else {
                        callback("true");
                    }
                } else {
                    callback("false");
                }
            } else {
                callback("false");
            }
        }, {timeout: 60000});
    },
    isInstalledSub: function (obj, callback) {
        let m = obj.Method;
        let agent_Name = 'WehagoAgent';
        if (this.remoteMethods.indexOf(m) > -1)
            agent_Name = 'WehagoRemoteApp';
        else if (this.scrappingMethods.indexOf(m) > -1)
            agent_Name = 'WehagoScrapping';
        else if (this.printMethods.indexOf(m) > -1)
            agent_Name = 'WehagoPrint';
        else if (this.smartaNtsMethods.indexOf(m) > -1)
            agent_Name = 'WehagoNTS';
        else if (this.taxMethods.indexOf(m) > -1)
            agent_Name = 'WehagoTax';
        else if (this.certMethods.indexOf(m) > -1)
            agent_Name = 'WehagoCert';
        else if (this.neoRsMethods.indexOf(m) > -1)
            agent_Name = 'WehagoNeoRS';

        // wehagov 에이전트명 변경
        if (process.env.BUILD_ENV === 'wehagov') {
            agent_Name = agent_Name.replace("Wehago", "WehagoV");
        }

        this.call({MainMethod: 'GetMinionAgentStatus', AgentName: agent_Name}, function (data, status) {
            if (status == "success") {
                let result = data.responseJSON;
                if (result.resultCode != null && result.resultCode == "0000") {
                    // console.log(agent_Name + " installed!");
                    callback(true);
                } else {
                    callback(false);
                }
            } else {
                callback(false);
            }
        }, {timeout: 10000});
    },
    updaterFailCnt1: 0,
    agentUpdater: function (obj, callback) {
        let target = this;
        let p = {
            MainMethod: "ExecuteUpdater",
            AgentName: "WehagoAgent",
            Params: {webPortalURL: globals.agentUpdateServerUrl, TokenID: $.cookie("AUTH_A_TOKEN")}
        };
        // wehagov 에이전트명 변경
        if (process.env.BUILD_ENV === 'wehagov') {
            p.AgentName = "WehagoVAgent";
        }
        target.call(p, function (data, status) {
            if (status == "success" && data.responseJSON.resultCode != null && data.responseJSON.resultCode == "0000") {
                target.updaterFailCnt1 = 0;
                callback(true);

            } else {
                // if (target.updaterFailCnt1 > 10){
                //     target.updaterFailCnt1 = 0;
                //     callback(false);
                // } else {
                //     console.log("===================" + target.updaterFailCnt1);
                //     target.updaterFailCnt1 = target.updaterFailCnt1 + 1;
                //     target.agentUpdater(obj, callback);
                // }
                callback(false);
            }
        }, {timeout: 600000});

    },
    updaterFailCnt2: 0,
    agentUpdaterSub: function (obj, callback) {
        let m = obj.Method;
        let agent_Name = 'WehagoAgent';
        if (this.remoteMethods.indexOf(m) > -1)
            agent_Name = 'WehagoRemoteApp';
        else if (this.scrappingMethods.indexOf(m) > -1)
            agent_Name = 'WehagoScrapping';
        else if (this.printMethods.indexOf(m) > -1)
            agent_Name = 'WehagoPrint';
        else if (this.invoiceMethods.indexOf(m) > -1)
            agent_Name = 'WehagoInvoice';
        else if (this.smartaNtsMethods.indexOf(m) > -1)
            agent_Name = 'WehagoNTS';
        else if (this.taxMethods.indexOf(m) > -1)
            agent_Name = 'WehagoTax';
        else if (this.certMethods.indexOf(m) > -1)
            agent_Name = 'WehagoCert';
        else if (this.neoRsMethods.indexOf(m) > -1)
            agent_Name = 'WehagoNeoRS';


        // wehagov 에이전트명 변경
        if (process.env.BUILD_ENV === 'wehagov') {
            agent_Name = agent_Name.replace("Wehago", "WehagoV");
        }

        let target = this;
        let p = {
            MainMethod: "ExecuteUpdater",
            AgentName: agent_Name,
            Params: {webPortalURL: globals.agentUpdateServerUrl, TokenID: $.cookie("AUTH_A_TOKEN")}
        };
        target.call(p, function (data, status) {
            if (status == "success" && data.responseJSON.resultCode != null && data.responseJSON.resultCode == "0000") {
                target.updaterFailCnt2 = 0;
                callback(true);
            } else {
                // if (target.updaterFailCnt2 > 10){
                //     target.updaterFailCnt2 = 0;
                //     callback(false);
                // } else {
                //     console.log("===================" + target.updaterFailCnt2);
                //     target.updaterFailCnt2 = target.updaterFailCnt2 + 1;
                //     target.agentUpdaterSub(obj, callback);
                // }
                callback(false);
            }
        }, {timeout: 600000});

    },
    agentUpdaterStatus: function (obj, callback) {
        let target = this;

        let p = {MainMethod: "GetMinionAgentStatus", AgentName: "WehagoAgent"};
        // wehagov 에이전트명 변경
        if (process.env.BUILD_ENV === 'wehagov') {
            p.AgentName = "WehagoVAgent";
        }
        target.call(p, function (data, status) {
            if (status == "success") {
                let result = data.responseJSON;
                if (result.resultMsg != null && result.resultMsg.toLowerCase() == "true") {
                    callback(true);
                } else {
                    let cnt1 = 0;
                    let si1 = setInterval(function () {
                        let p = {MainMethod: "GetMinionAgentStatus", AgentName: "WehagoAgent"};
                        target.call(p, function (data, status) {
                            if (status == "success") {
                                let result = data.responseJSON;
                                if (result.resultMsg != null && result.resultMsg.toLowerCase() == "true") {
                                    clearInterval(si1);
                                    callback(true);
                                } else {
                                    cnt1++;
                                    if (cnt1 > 30) {
                                        clearInterval(si1);
                                        callback(false);
                                    }
                                }
                            } else {
                                clearInterval(si1);
                                callback(true);
                            }
                        });
                    }, 1000);
                }
            } else {
                callback(true);
            }
        });


    },
    agentUpdaterStatusSub: function (obj, callback) {
        let m = obj.Method;
        let agent_Name = 'WehagoAgent';
        if (this.remoteMethods.indexOf(m) > -1)
            agent_Name = 'WehagoRemoteApp';
        else if (this.scrappingMethods.indexOf(m) > -1)
            agent_Name = 'WehagoScrapping';
        else if (this.printMethods.indexOf(m) > -1)
            agent_Name = 'WehagoPrint';
        else if (this.invoiceMethods.indexOf(m) > -1)
            agent_Name = 'WehagoInvoice';
        else if (this.smartaNtsMethods.indexOf(m) > -1)
            agent_Name = 'WehagoNTS';
        else if (this.taxMethods.indexOf(m) > -1)
            agent_Name = 'WehagoTax';
        else if (this.certMethods.indexOf(m) > -1)
            agent_Name = 'WehagoCert';
        else if (this.neoRsMethods.indexOf(m) > -1)
            agent_Name = 'WehagoNeoRS';

        // wehagov 에이전트명 변경
        if (process.env.BUILD_ENV === 'wehagov') {
            agent_Name = agent_Name.replace("Wehago", "WehagoV");
        }

        let target = this;
        let p = {MainMethod: "GetMinionAgentStatus", AgentName: agent_Name};
        target.call(p, function (data, status) {
            if (status == "success") {
                let result = data.responseJSON;
                if (result.resultMsg != null && result.resultMsg.toLowerCase() == "true") {
                    callback(true);
                } else {
                    let cnt2 = 0;
                    let si2 = setInterval(function () {
                        let p = {MainMethod: "GetMinionAgentStatus", AgentName: agent_Name};
                        target.call(p, function (data, status) {
                            if (status == "success") {
                                let result = data.responseJSON;
                                if (result.resultMsg != null && result.resultMsg.toLowerCase() == "true") {
                                    clearInterval(si2);
                                    callback(true);
                                } else {
                                    cnt2++;
                                    if (cnt2 > 120) {
                                        clearInterval(si2);
                                        callback(false);
                                    }
                                }
                            } else {
                                clearInterval(si2);
                                callback(true);
                            }
                        });
                    }, 1000);
                }
            } else {
                callback(true);
            }
        });
    },
    isConnected: function (callback) {
        let p = {Method: "Connected"};
        this.call(p, function (data, status) {
            if (status == "success") {
                let result = data.responseJSON;
                //if (result.resultCode != "0000" || result.resultMsg.toLowerCase() == "false") {
                if (result.resultCode == "0000" && result.resultMsg.toLowerCase() == "true") {
                    callback("true");
                } else {
                    callback("false");
                }
            } else {
                callback("false");
            }
        });
    },
    isIDCheck: function (callback) {
        let p = {
            Method: "IDCheck",
            Params: {
                TokenID: $.cookie("AUTH_A_TOKEN"),
                UserID: document.getElementById("h_portal_id").value,
                PortalURL: globals.agentGateway,
                CompanyNo: document.getElementById("h_selected_company_no").value
            }
        };
        this.call(p, function (data, status) {
            if (status == "success") {
                let result = data.responseJSON;
                if (result.resultCode == "0000" && result.resultMsg.toLowerCase() == "true") {
                    //console.log("계정 실행중 O");
                    callback("true");
                } else {
                    //console.log("계정 실행중 X");
                    callback("false");
                }
            }
        });


    },
    aesEnc: function (plain_text) {
        aes256.size(256);
        return aes256.aesEncrypt(plain_text, this.aesKey());
    },
    aesDec: function (base64_text) {
        aes256.size(256);
        return aes256.aesDecrypt(base64_text, this.aesKey());
    },
    aesKey: function () {
        return "e77911b711a9354b864399536d892eafc4884665ac7af7a4e74f35b98c368415";
    },
    /**
     * 에이전트 프로그램 실행 요청
     * @param obj
     * @param callback
     * @param options
     * @return boolean
     */
    exec: function (obj, callback, options) {
        let target = this;
        // 0. OS 체크
        // if (navigator.platform.toLowerCase().indexOf("win") < 0){
        // 	callback({resultCode:"7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
        // 	return false;
        // }

        if (detector.os.name != "windows") {
            callback({resultCode: "7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
            return false;
        }


        // 1. agent 설치여부
        this.isInstalled(obj, function (isInstalled) {
            // console.log("1 = " + isInstalled);
            if (isInstalled == "true") {
                // 2. agent updater
                target.agentUpdater(obj, function (isUpdater) {
                    // console.log("2 = " + isUpdater);
                    if (isUpdater) {
                        // console.log("agent updater success");
                        // 3. sub-agent updater
                        target.agentUpdaterSub(obj, function (isUpdaterSub) {
                            if (isUpdaterSub) {
                                if (obj.Method != undefined && obj.Method == "WehagoInvoice") {
                                    // 4. 공인인증서 실행가능 알림
                                    callback({resultCode: "0000", resultMsg: ""}, "success");
                                } else {
                                    // 4. excute
                                    target.call(obj, function (data, status) {
                                        callback(data, status);
                                    }, options);
                                }

                            } else {
                                // console.log("sub-agent updater failed");
                                callback({resultCode: "9000", resultMsg: "에이전트 업데이트중 오류가 발생했습니다."}, "error");
                            }
                        });
                    } else {
                        // console.log("agent updater failed");
                        callback({resultCode: "9000", resultMsg: "에이전트 업데이트중 오류가 발생했습니다."}, "error");
                    }
                });
            } else if (isInstalled == "agentUpdate") {
                //location.href = "/#/common/downloadcenter";
                if (process.env.cell) {
                    if (process.env.CHECK_TYPE === 'local') {
                        callback({resultCode: "6000", resultMsg: "WEHAGO필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/#/downloadcenter"}, "error");
                    } else {
                        callback({resultCode: "6000", resultMsg: "WEHAGO필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/common/#/downloadcenter"}, "error");
                    }
                } else {
                    callback({resultCode: "6000", resultMsg: "WEHAGO필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/#/common/downloadcenter"}, "error");
                }
            } else {
                if (process.env.cell) {
                    if (process.env.CHECK_TYPE === 'local') {
                        location.href = globals.portalUrl + "/#/downloadcenter";
                    } else {
                        location.href = globals.portalUrl + "/common/#/downloadcenter";
                    }
                } else {
                    location.href = globals.portalUrl + "/#/common/downloadcenter";
                }
                callback({resultCode: "8000", resultMsg: "에이전트가 설치되지 않았습니다."}, "error");
            }
        });
    },

    /**
     * 가상화 어플리케이션 실행 요청
     * @param obj
     * @param callback
     * @param options
     * @return boolean
     */
    execApp: function (obj, callback, options) {

        let target = this;
        // 0. OS 체크
        // if (navigator.platform.toLowerCase().indexOf("win") < 0){
        // 	callback({resultCode:"7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
        // 	return false;
        // }

        if (detector.os.name != "windows") {
            callback({resultCode: "7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
            return false;
        }

        // 1. agent 설치여부
        this.isInstalled(obj, function (isInstalled) {
            // console.log("1 = " + isInstalled);
            if (isInstalled == "true") {
                // 2. agent updater
                target.agentUpdater(obj, function (isUpdater) {
                    // console.log("2 = " + isUpdater);
                    if (isUpdater) {
                        // console.log("agent updater success");
                        // 3. sub-agent updater
                        target.agentUpdaterSub(obj, function (isUpdaterSub) {
                            // console.log("3 = " + isUpdaterSub);
                            if (isUpdaterSub) {

                                // 4-1. 회원정보 조회
                                let url = globals.wehagoCommonApiUrl + '/layout/comConnectInfo';
                                ajax.get(url).then(function (response) {

                                    let dcloudResult = JSON.parse(response);
                                    let resultData = null;

                                    let portalurl = globals.agentGatewayUrl;  // "dev.api.wehago.com";
                                    // 세션정보 없으면 com 실행 안함
                                    //if (resultData.luluSession == undefined) return;
                                    // let randomKey = $.cookie("randomkey");
                                    let randomKey = "";
                                    let TokenID = $.cookie("AUTH_A_TOKEN");
                                    let id = "";
                                    let seq = 1;
                                    let company_no = "";
                                    let company_code = "";
                                    let employee_no = "";

                                    if (dcloudResult != null) {
                                        resultData = dcloudResult.resultData;

                                        // 세션정보 없으면 com 실행 안함
                                        //if (resultData.luluSession == undefined) return;
                                        //randomKey = resultData.luluSession.randomkey;
                                        // randomKey = $.cookie("randomkey");
                                        // if ($.cookie("randomkey") == undefined) {
                                            randomKey = resultData.luluSession.randomkey;
                                        // }
                                        if(typeof obj === "object" && obj.Method === "ExecuteApp" && typeof obj.Params === "object") {
                                            obj.Params.RandomKey = obj.Params.RandomKey || randomKey;
                                            obj.Params.SeqNum = obj.Params.SeqNum || 1;
                                        }
                                        TokenID = $.cookie("AUTH_A_TOKEN");
                                        id = resultData.luluSession.portal_id;
                                        seq = 1;
                                        company_no = resultData.luluSession.company_no;
                                        company_code = resultData.luluSession.company_code;
                                        employee_no = resultData.luluSession.employee_no;
                                    }

                                    // 4-2. 계정 연동 여부 조회
                                    target.isConnected(function (connected) {
                                        // 연결중이면
                                        if (connected == "true") {

                                            target.isIDCheck(function (idCheck) {
                                                if (idCheck == "true") {
                                                    // 8. 프로그램 실행
                                                    target.call(obj, function (data, status) {
                                                        callback(data, status);
                                                    }, options);
                                                } else {
                                                    let pDis = {
                                                        Method: "Disconnection",
                                                        Params: {Type: "Close", Agent: "WehagoRemoteApp"}
                                                    };
                                                    if (process.env.BUILD_ENV === 'wehagov') {
                                                        pDis.Params.Agent = "WehagoVRemoteApp";
                                                    }
                                                    target.call(pDis, function (data, status) {
                                                        // connection
                                                        var pConn = {
                                                            Method: "Connection",
                                                            Params: {
                                                                TokenID: TokenID,
                                                                RandomKey: randomKey,
                                                                SeqNum: seq,
                                                                UserID: id,
                                                                PortalIP: globals.agentGatewayUrl, //https://ssapi.wehago.com  //'dev.api.wehago.com', 	//'172.16.114.79',//'172.16.115.33',
                                                                PortalPort: globals.agentPort, //80, //443
                                                                ContextRoot: "",
                                                                IEHistoryDel: "false",
                                                                IEClose: "false",
                                                                CompanyNo: company_no,
                                                                CompanyCode: company_code,
                                                                EmployeeNo: employee_no,
                                                                isCompanyChange: "false"	//회사변경접속여부
                                                            }
                                                        };

                                                        target.call(pConn, function (data, status) {
                                                            // console.log("==== connection result : ", data);
                                                            // let result = data.responseJSON;
                                                            // if (result != undefined && result.resultCode == "0000" && result.resultMsg == "True") {
                                                            // 	// 5-1. 프로그램 실행
                                                            // 	target.call(obj, function (data, status) {
                                                            // 		callback(data, status);
                                                            // 	}, options);
                                                            // }
                                                        }, {timeout: 60000});
                                                        // 5. 프로그램 실행
                                                        setTimeout(function () {
                                                            if(typeof obj === "object" && obj.Method === "ExecuteApp" && typeof obj.Params === "object") {
                                                                console.log("8-2 = ", obj.Params.SeqNum, obj.Params.RandomKey == "");
                                                                if(typeof obj.Params.RandomKey === "string") {
                                                                    console.log("8-2 = ", obj.Params.RandomKey.substr(0, 2));
                                                                }
                                                            }
                                                            target.call(obj, function (data, status) {
                                                                callback(data, status);
                                                            }, options);
                                                        }, 1000);

                                                    });

                                                }


                                            });


                                        } else if (connected == "notInstall") {
                                            callback({
                                                resultCode: "8000",
                                                resultMsg: "에이전트가 설치되지 않았거나 미실행중입니다."
                                            }, "error");
                                            return;
                                        } else {
                                            // 연결중이 아니면
                                            // 4-3. 계정 연동 connection
                                            var p5 = {
                                                Method: "Connection",
                                                Params: {
                                                    TokenID: TokenID,
                                                    RandomKey: randomKey,
                                                    SeqNum: seq,
                                                    UserID: id,
                                                    PortalIP: globals.agentGatewayUrl, //https://ssapi.wehago.com  //'dev.api.wehago.com', 	//'172.16.114.79',//'172.16.115.33',
                                                    PortalPort: globals.agentPort, //80, //443
                                                    ContextRoot: "",
                                                    IEHistoryDel: "false",
                                                    IEClose: "false",
                                                    CompanyNo: company_no,
                                                    CompanyCode: company_code,
                                                    EmployeeNo: employee_no,
                                                    isCompanyChange: "false"	//회사변경접속여부
                                                }
                                            };
                                            target.call(p5, function (data, status) {
                                                // console.log("==== connection result : ", data);
                                                // let result = data.responseJSON;
                                                // if (result != undefined && result.resultCode == "0000" && result.resultMsg == "True") {
                                                // 	// 5-1. 프로그램 실행
                                                // 	target.call(obj, function (data, status) {
                                                // 		callback(data, status);
                                                // 	}, options);
                                                // }
                                            }, {timeout: 60000});
                                            // 5. 프로그램 실행
                                            setTimeout(function () {
                                                target.call(obj, function (data, status) {
                                                    callback(data, status);
                                                }, options);
                                            }, 1000);
                                        }

                                        // 6. 아이디 체크 호출
                                        // setTimeout(function () {
                                        //     let p = {Method: "IDCheck", Params: {TokenID: TokenID, PortalURL: globals.agentGateway}};
                                        //     target.isIDCheck(p);
                                        // }, 2000);

                                    });

                                }.bind(this), function (error) {
                                    callback({resultCode: "9000", resultMsg: "회원정보 연동중 오류가 발생했습니다."}, "error");
                                }.bind(this));


                            } else {
                                // console.log("sub-agent updater failed");
                                callback({resultCode: "9000", resultMsg: "에이전트 업데이트중 오류가 발생했습니다."}, "error");
                            }
                        });
                    } else {
                        // console.log("agent updater failed");
                        callback({resultCode: "9000", resultMsg: "에이전트 업데이트중 오류가 발생했습니다."}, "error");
                    }
                });
            } else if (isInstalled == "agentUpdate") {
                //location.href = "/#/common/downloadcenter";
                if (process.env.cell) {
                    if (process.env.CHECK_TYPE === 'local') {
                        callback({resultCode: "6000", resultMsg: "WEHAGO필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/#/downloadcenter"}, "error");
                    } else {
                        callback({resultCode: "6000", resultMsg: "WEHAGO필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/common/#/downloadcenter"}, "error");
                    }
                } else {
                    callback({resultCode: "6000", resultMsg: "WEHAGO필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/#/common/downloadcenter"}, "error");
                }
            } else {
                if (process.env.cell) {
                    if (process.env.CHECK_TYPE === 'local') {
                        location.href = globals.portalUrl + "/#/downloadcenter";
                    } else {
                        location.href = globals.portalUrl + "/common/#/downloadcenter";
                    }
                } else {
                    location.href = globals.portalUrl + "/#/common/downloadcenter";
                }
                callback({resultCode: "8000", resultMsg: "에이전트가 설치되지 않았습니다."}, "error");
            }
        });
    },

    /**
     * VDI 실행 요청
     * @param obj
     * @param callback
     * @param options
     * @return boolean
     */
    execVdi: function (obj, callback, options) {

        let target = this;
        // 0. OS 체크
        // if (navigator.platform.toLowerCase().indexOf("win") < 0){
        // 	callback({resultCode:"7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
        // 	return false;
        // }

        if (detector.os.name != "windows") {
            callback({resultCode: "7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
            return false;
        }

        // 1. agent 설치여부
        this.isInstalled(obj, function (isInstalled) {
            // console.log("1 = " + isInstalled);
            if (isInstalled == "true") {
                // 2. agent updater
                target.agentUpdater(obj, function (isUpdater) {
                    // console.log("2 = " + isUpdater);
                    if (isUpdater) {
                        // console.log("agent updater success");
                        // 3. sub-agent updater
                        target.agentUpdaterSub(obj, function (isUpdaterSub) {
                            // console.log("3 = " + isUpdaterSub);
                            if (isUpdaterSub) {

                                // 4-2. 계정 연동 여부 조회
                                target.isConnected(function (connected) {
                                    // 연결중이면
                                    if (connected == "true") {

                                        target.isIDCheck(function (idCheck) {
                                            if (idCheck == "true") {
                                                // 8. 프로그램 실행
                                                target.call(obj, function (data, status) {
                                                    callback(data, status);
                                                }, options);
                                            } else {
                                                let pDis = {
                                                    Method: "Disconnection",
                                                    Params: {Type: "Close", Agent: "WehagoRemoteApp"}
                                                };
                                                if (process.env.BUILD_ENV === 'wehagov') {
                                                    pDis.Params.Agent = "WehagoVRemoteApp";
                                                }
                                                target.call(pDis, function (data, status) {
                                                    // 5. 프로그램 실행
                                                    setTimeout(function () {
                                                        target.call(obj, function (data, status) {
                                                            callback(data, status);
                                                        }, options);
                                                    }, 1000);

                                                });

                                            }

                                        });

                                    } else if (connected == "notInstall") {
                                        callback({resultCode: "8000", resultMsg: "에이전트가 설치되지 않았거나 미실행중입니다."}, "error");
                                        return;
                                    } else {
                                        // 연결중이 아니면
                                        // 5. 프로그램 실행
                                        setTimeout(function () {
                                            target.call(obj, function (data, status) {
                                                callback(data, status);
                                            }, options);
                                        }, 1000);
                                    }

                                });

                            } else {
                                // console.log("sub-agent updater failed");
                                callback({resultCode: "9000", resultMsg: "에이전트 업데이트중 오류가 발생했습니다."}, "error");
                            }
                        });
                    } else {
                        // console.log("agent updater failed");
                        callback({resultCode: "9000", resultMsg: "에이전트 업데이트중 오류가 발생했습니다."}, "error");
                    }
                });
            } else if (isInstalled == "agentUpdate") {
                //location.href = "/#/common/downloadcenter";
                if (process.env.cell) {
                    if (process.env.CHECK_TYPE === 'local') {
                        callback({resultCode: "6000", resultMsg: "WEHAGO필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/#/downloadcenter"}, "error");
                    } else {
                        callback({resultCode: "6000", resultMsg: "WEHAGO필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/common/#/downloadcenter"}, "error");
                    }
                } else {
                    callback({resultCode: "6000", resultMsg: "WEHAGO필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/#/common/downloadcenter"}, "error");
                }
            } else {
                if (process.env.cell) {
                    if (process.env.CHECK_TYPE === 'local') {
                        location.href = globals.portalUrl + "/#/downloadcenter";
                    } else {
                        location.href = globals.portalUrl + "/common/#/downloadcenter";
                    }
                } else {
                    location.href = globals.portalUrl + "/#/common/downloadcenter";
                }
                callback({resultCode: "8000", resultMsg: "에이전트가 설치되지 않았습니다."}, "error");
            }
        });
    },

    /**
     * 가상화 어플리케이션 계정연동 종료
     */
    appLogout: function () {
        let p = {Method: "Disconnection", Params: {Type: "Close", Agent: "WehagoRemoteApp"}};
        if (process.env.BUILD_ENV === 'wehagov') {
            p.Params.Agent = "WehagoVRemoteApp";
        }
        this.call(p, function (data, status) {

        });
    },

    /**
     * 가상화 어플리케이션 로그 오프
     */
    appLogoff: function () {
        let p = {Method: "Disconnection", Params: {Type: "DCloudClient_UserLogOff", Agent: "WehagoRemoteApp"}};
        if (process.env.BUILD_ENV === 'wehagov') {
            p.Params.Agent = "WehagoVRemoteApp";
        }
        this.call(p, function (data, status) {
            if (status == "success") {
                window.location.reload();
            }
        });
    },

    /**
     * new 가상화 어플리케이션만 실행
     * @param obj
     * @param callback
     * @param options
     * @return boolean
     */
    newExecApp: function (obj, callback, options) {

        // 0. OS 체크
        // if (navigator.platform.toLowerCase().indexOf("win") < 0){
        // 	callback({resultCode: "7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
        // 	return false;
        // }

        if (detector.os.name != "windows") {
            callback({resultCode: "7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
            return false;
        }

        this.call(obj, function (data, status) {
            callback(data, status);
        }, options);

    },

    /**
     * new VDI 만 실행
     * @param obj
     * @param callback
     * @param options
     * @return boolean
     */
    newExecVdi: function (obj, callback, options) {

        // 0. OS 체크
        // if (navigator.platform.toLowerCase().indexOf("win") < 0){
        // 	callback({resultCode: "7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
        // 	return false;
        // }

        if (detector.os.name != "windows") {
            callback({resultCode: "7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
            return false;
        }

        this.call(obj, function (data, status) {
            callback(data, status);
        }, options);

    },
    /**
     * new 가상화 어플리케이션 초기화
     * @param obj
     * @param callback
     * @param options
     * @return boolean
     */
    newExecAppInit: function (obj, callback, options) {

        let target = this;
        // 0. OS 체크
        // if (navigator.platform.toLowerCase().indexOf("win") < 0){
        // 	callback({resultCode:"7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
        // 	return false;
        // }

        if (detector.os.name != "windows") {
            callback({resultCode: "7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
            return false;
        }

        // 1. agent 설치여부
        this.isInstalled(obj, function (isInstalled) {
            // console.log("1 = " + isInstalled);
            if (isInstalled == "true") {
                // 2. agent updater
                target.agentUpdater(obj, function (isUpdater) {
                    // console.log("2 = " + isUpdater);
                    if (isUpdater) {
                        // console.log("agent updater success");
                        // 3. sub-agent updater
                        target.agentUpdaterSub(obj, function (isUpdaterSub) {
                            // console.log("3 = " + isUpdaterSub);
                            if (isUpdaterSub) {

                                // 4-1. 회원정보 조회
                                let url = globals.wehagoCommonApiUrl + '/layout/comConnectInfo';
                                ajax.get(url).then(function (response) {

                                    let dcloudResult = JSON.parse(response);
                                    let resultData = null;

                                    let portalurl = globals.agentGatewayUrl;  // "dev.api.wehago.com";
                                    // 세션정보 없으면 com 실행 안함
                                    //if (resultData.luluSession == undefined) return;

                                    // let randomKey = $.cookie("randomkey");
                                    let randomKey = "";
                                    let TokenID = $.cookie("AUTH_A_TOKEN");
                                    let id = "";
                                    let seq = 1;
                                    let company_no = "";
                                    let company_code = "";
                                    let employee_no = "";

                                    if (dcloudResult != null) {
                                        resultData = dcloudResult.resultData;
                                        // 세션정보 없으면 com 실행 안함
                                        //if (resultData.luluSession == undefined) return;
                                        // randomKey = $.cookie("randomkey");
                                        // if ($.cookie("randomkey") == undefined) {
                                            randomKey = resultData.luluSession.randomkey;
                                        // }
                                        TokenID = $.cookie("AUTH_A_TOKEN");
                                        id = resultData.luluSession.portal_id;
                                        seq = 1;
                                        company_no = resultData.luluSession.company_no;
                                        company_code = resultData.luluSession.company_code;
                                        employee_no = resultData.luluSession.employee_no;
                                    }

                                    // 4-2. 계정 연동 여부 조회
                                    target.isConnected(function (connected) {
                                        // 연결중이면
                                        if (connected == "true") {

                                            target.isIDCheck(function (idCheck) {
                                                if (idCheck == "true") {
                                                    callback({resultCode: "0000", resultMsg: "success"}, "success");
                                                } else {
                                                    let pDis = {
                                                        Method: "Disconnection",
                                                        Params: {Type: "Close", Agent: "WehagoRemoteApp"}
                                                    };
                                                    if (process.env.BUILD_ENV === 'wehagov') {
                                                        pDis.Params.Agent = "WehagoVRemoteApp";
                                                    }
                                                    target.call(pDis, function (data, status) {
                                                        // connection
                                                        var pConn = {
                                                            Method: "Connection",
                                                            Params: {
                                                                TokenID: TokenID,
                                                                RandomKey: randomKey,
                                                                SeqNum: seq,
                                                                UserID: id,
                                                                PortalIP: globals.agentGatewayUrl, //https://ssapi.wehago.com  //'dev.api.wehago.com', 	//'172.16.114.79',//'172.16.115.33',
                                                                PortalPort: globals.agentPort, //80, //443
                                                                ContextRoot: "",
                                                                IEHistoryDel: "false",
                                                                IEClose: "false",
                                                                CompanyNo: company_no,
                                                                CompanyCode: company_code,
                                                                EmployeeNo: employee_no,
                                                                isCompanyChange: "false"	//회사변경접속여부
                                                            }
                                                        };

                                                        target.call(pConn, function (data, status) {
                                                            // console.log("==== connection result : ", data);

                                                        }, {timeout: 60000});
                                                        callback({resultCode: "0000", resultMsg: "success"}, "success");
                                                    });
                                                }
                                            });


                                        } else if (connected == "notInstall") {
                                            callback({
                                                resultCode: "8000",
                                                resultMsg: "에이전트가 설치되지 않았거나 미실행중입니다."
                                            }, "error");
                                            return;
                                        } else {
                                            // 연결중이 아니면
                                            // 4-3. 계정 연동 connection
                                            var p5 = {
                                                Method: "Connection",
                                                Params: {
                                                    TokenID: TokenID,
                                                    RandomKey: randomKey,
                                                    SeqNum: seq,
                                                    UserID: id,
                                                    PortalIP: globals.agentGatewayUrl, //https://ssapi.wehago.com  //'dev.api.wehago.com', 	//'172.16.114.79',//'172.16.115.33',
                                                    PortalPort: globals.agentPort, //80, //443
                                                    ContextRoot: "",
                                                    IEHistoryDel: "false",
                                                    IEClose: "false",
                                                    CompanyNo: company_no,
                                                    CompanyCode: company_code,
                                                    EmployeeNo: employee_no,
                                                    isCompanyChange: "false"	//회사변경접속여부
                                                }
                                            };
                                            target.call(p5, function (data, status) {
                                                // console.log("==== connection result : ", data);

                                            }, {timeout: 60000});
                                            callback({resultCode: "0000", resultMsg: "success"}, "success");

                                        }

                                    });

                                }.bind(this), function (error) {
                                    callback({resultCode: "9000", resultMsg: "회원정보 연동중 오류가 발생했습니다."}, "error");
                                }.bind(this));

                            } else {
                                // console.log("sub-agent updater failed");
                                callback({resultCode: "9000", resultMsg: "에이전트 업데이트중 오류가 발생했습니다."}, "error");
                            }
                        });
                    } else {
                        // console.log("agent updater failed");
                        callback({resultCode: "9000", resultMsg: "에이전트 업데이트중 오류가 발생했습니다."}, "error");
                    }
                });
            } else if (isInstalled == "agentUpdate") {
                //location.href = "/#/common/downloadcenter";
                if (process.env.cell) {
                    if (process.env.CHECK_TYPE === 'local') {
                        callback({resultCode: "6000", resultMsg: "WEHAGO 필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/#/downloadcenter"}, "error");
                    } else {
                        callback({resultCode: "6000", resultMsg: "WEHAGO 필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/common/#/downloadcenter"}, "error");
                    }
                } else {
                    callback({resultCode: "6000", resultMsg: "WEHAGO 필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/#/common/downloadcenter"}, "error");
                }
            } else {
                //location.href = "/#/common/downloadcenter";
                callback({resultCode: "8000", resultMsg: "에이전트가 설치되지 않았습니다."}, "error");
            }
        });
    },

    /**
     * new 가상화  SMARTA 어플리케이션 초기화
     * @param obj
     * @param callback
     * @param options
     * @return boolean
     */
    newExecAppInitSmartA: function (obj, k, callback, options) {

        let target = this;
        // 0. OS 체크
        // if (navigator.platform.toLowerCase().indexOf("win") < 0){
        // 	callback({resultCode:"7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
        // 	return false;
        // }

        if (detector.os.name != "windows") {
            callback({resultCode: "7000", resultMsg: "SmartSquare 가상화 서비스는 Windows OS 만 지원 가능합니다."}, "error");
            return false;
        }

        // 1. agent 설치여부
        this.isInstalled(obj, function (isInstalled) {
            // console.log("1 = " + isInstalled);
            if (isInstalled == "true") {
                // 2. agent updater
                target.agentUpdater(obj, function (isUpdater) {
                    // console.log("2 = " + isUpdater);
                    if (isUpdater) {
                        // console.log("agent updater success");
                        // 3. sub-agent updater
                        target.agentUpdaterSub(obj, function (isUpdaterSub) {
                            // console.log("3 = " + isUpdaterSub);
                            if (isUpdaterSub) {

                                // 4-1. 회원정보 조회
                                let url = globals.wehagoCommonApiUrl + '/layout/comConnectInfo';
                                ajax.get(url).then(function (response) {

                                    let dcloudResult = JSON.parse(response);
                                    let resultData = null;

                                    let portalurl = globals.agentGatewayUrl;  // "dev.api.wehago.com";
                                    // 세션정보 없으면 com 실행 안함
                                    //if (resultData.luluSession == undefined) return;

                                    // let randomKey = $.cookie("randomkey");
                                    let randomKey = "";
                                    let TokenID = $.cookie("AUTH_A_TOKEN");
                                    let id = "";
                                    let seq = 1;
                                    let company_no = "";
                                    let company_code = "";
                                    let employee_no = "";

                                    if (dcloudResult != null) {
                                        resultData = dcloudResult.resultData;
                                        // 세션정보 없으면 com 실행 안함
                                        //if (resultData.luluSession == undefined) return;
                                        // randomKey = $.cookie("randomkey");
                                        // if ($.cookie("randomkey") == undefined) {
                                            randomKey = resultData.luluSession.randomkey;
                                        // }
                                        TokenID = $.cookie("AUTH_A_TOKEN");
                                        id = resultData.luluSession.portal_id;
                                        seq = 1;
                                        company_no = resultData.luluSession.company_no;
                                        company_code = resultData.luluSession.company_code;
                                        employee_no = resultData.luluSession.employee_no;
                                    }

                                    // 4-2. 계정 연동 여부 조회
                                    target.isConnected(function (connected) {
                                        // 연결중이면
                                        if (connected == "true") {

                                            target.isIDCheck(function (idCheck) {
                                                if (idCheck == "true") {
                                                    callback({resultCode: "0000", resultMsg: "success"}, "success");
                                                } else {
                                                    let pDis = {
                                                        Method: "Disconnection",
                                                        Params: {Type: "Close", Agent: "PreDataSmartA"}
                                                    };
                                                    target.call(pDis, function (data, status) {
                                                        // connection
                                                        var pConn = {
                                                            Method: "ConnectionPreData",
                                                            Params: {
                                                                TokenID: TokenID,
                                                                RandomKey: randomKey,
                                                                SeqNum: seq,
                                                                UserID: id,
                                                                PortalIP: globals.agentGatewayUrl, //https://ssapi.wehago.com  //'dev.api.wehago.com', 	//'172.16.114.79',//'172.16.115.33',
                                                                PortalPort: globals.agentPort, //80, //443
                                                                ContextRoot: "",
                                                                IEHistoryDel: "false",
                                                                IEClose: "false",
                                                                CompanyNo: company_no,
                                                                CompanyCode: company_code,
                                                                EmployeeNo: employee_no,
                                                                isCompanyChange: "false",	//회사변경접속여부
                                                                Year: k.Year,
                                                                Gisu: k.Gisu,
                                                                Ccode: k.Ccode,
                                                                PreGisu: k.PreGisu,
                                                                Cname: k.Cname,
                                                            }
                                                        };

                                                        target.call(pConn, function (data, status) {
                                                            // console.log("==== connection result : ", data);

                                                        }, {timeout: 60000});
                                                        callback({resultCode: "0000", resultMsg: "success"}, "success");
                                                    });
                                                }
                                            });


                                        } else if (connected == "notInstall") {
                                            callback({
                                                resultCode: "8000",
                                                resultMsg: "에이전트가 설치되지 않았거나 미실행중입니다."
                                            }, "error");
                                            return;
                                        } else {
                                            // 연결중이 아니면
                                            // 4-3. 계정 연동 connection
                                            var p5 = {
                                                Method: "ConnectionPreData",
                                                Params: {
                                                    TokenID: TokenID,
                                                    RandomKey: randomKey,
                                                    SeqNum: seq,
                                                    UserID: id,
                                                    PortalIP: globals.agentGatewayUrl, //https://ssapi.wehago.com  //'dev.api.wehago.com', 	//'172.16.114.79',//'172.16.115.33',
                                                    PortalPort: globals.agentPort, //80, //443
                                                    ContextRoot: "",
                                                    IEHistoryDel: "false",
                                                    IEClose: "false",
                                                    CompanyNo: company_no,
                                                    CompanyCode: company_code,
                                                    EmployeeNo: employee_no,
                                                    isCompanyChange: "false",	//회사변경접속여부
                                                    Year: k.Year,
                                                    Gisu: k.Gisu,
                                                    Ccode: k.Ccode,
                                                    PreGisu: k.PreGisu,
                                                    Cname: k.Cname,
                                                }
                                            };
                                            target.call(p5, function (data, status) {
                                                // console.log("==== connection result : ", data);

                                            }, {timeout: 60000});
                                            callback({resultCode: "0000", resultMsg: "success"}, "success");

                                        }

                                    });

                                }.bind(this), function (error) {
                                    callback({resultCode: "9000", resultMsg: "회원정보 연동중 오류가 발생했습니다."}, "error");
                                }.bind(this));

                            } else {
                                // console.log("sub-agent updater failed");
                                callback({resultCode: "9000", resultMsg: "에이전트 업데이트중 오류가 발생했습니다."}, "error");
                            }
                        });
                    } else {
                        // console.log("agent updater failed");
                        callback({resultCode: "9000", resultMsg: "에이전트 업데이트중 오류가 발생했습니다."}, "error");
                    }
                });
            } else if (isInstalled == "agentUpdate") {
                //location.href = "/#/common/downloadcenter";
                if (process.env.cell) {
                    if (process.env.CHECK_TYPE === 'local') {
                        callback({resultCode: "6000", resultMsg: "WEHAGO필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/#/downloadcenter"}, "error");
                    } else {
                        callback({resultCode: "6000", resultMsg: "WEHAGO필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/common/#/downloadcenter"}, "error");
                    }
                } else {
                    callback({resultCode: "6000", resultMsg: "WEHAGO필수 에이전트 업데이트가 필요합니다. 재설치 해주시기 바랍니다.", move : globals.portalUrl + "/#/common/downloadcenter"}, "error");
                }
            } else {
                //location.href = "/#/common/downloadcenter";
                callback({resultCode: "8000", resultMsg: "에이전트가 설치되지 않았습니다."}, "error");
            }
        });
    },


};
