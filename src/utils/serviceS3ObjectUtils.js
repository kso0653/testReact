import $ from "jquery";
import "jquery.cookie";
import FileSaver from "file-saver";
import ajax from "./ajax";
import Lang from "./lang";
import LUXDialog from "luna-rocket/LUXDialog";

let CryptoJS = require("crypto-js");
const detector = require("detector");
const mime = require("mime-types");
const uuidV1 = require("uuid/v1");
const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");
const objectStorageUrl = globals.objectStorageUrl;
const webOfficeUrl = globals.webOfficeUrl;
const unCertApiUrl = globals.unCertApiUrl;

export function S3ObjectTools() {
    let _handle_progress = null;
    let _handle_success  = null;
    let _handle_error    = null;
    let _handle_cancel   = null;
    let _org_file_name   = null;
    let _new_file_name   = null;
    let _signature_info  = null;
    let _service_key     = null;
    let _service_code    = null;
    let _bucket_type     = null;
    let _cno             = null;
    let _file_size       = null;
    let _xhr             = null;
    let _is_public       = null;
    let _is_wedrive      = null;
    let _wedrive_token   = null;
    let _wedrive_path    = null;

    this.uploadFile = function({ file, newFileName, bucketType, serviceKey, serviceCode, cno, s3Auth, s3Date, url, handleSuccess, handleError, handleProgress, handleCancel, isPublic, async, isWedrive, wedriveToken, wedrivePath }) {

        _handle_progress = handleProgress;
        _handle_success  = handleSuccess;
        _handle_error    = handleError;
        _handle_cancel   = handleCancel;
        _org_file_name   = file.name;
        if (detector.os.name === "macosx" || detector.os.name === "ios") {
            _org_file_name = file.name.normalize('NFC');
        }
        _new_file_name   = newFileName;
        _bucket_type     = bucketType;
        _service_key     = serviceKey;
        _service_code    = serviceCode;
        _cno             = cno;
        _file_size       = file.size;
        _is_public       = isPublic;
        _is_wedrive      = isWedrive;
        _wedrive_token   = wedriveToken;
        _wedrive_path    = wedrivePath;

        let xhr = new XMLHttpRequest();
        xhr.open("PUT", url, async);
        xhr.upload.addEventListener("progress", uploadProgress, false);
        xhr.addEventListener("load", uploadComplete, false);
        xhr.addEventListener("error", uploadFailed, false);
        xhr.addEventListener("abort", uploadCanceled, false);
        xhr.setRequestHeader('Content-Type', (mime.lookup(_org_file_name)?mime.lookup(_org_file_name):'application/octet-stream'));
        xhr.setRequestHeader('x-amz-date', s3Date);
        xhr.setRequestHeader('Authorization', s3Auth);
        xhr.send(file);
        _xhr = xhr;
    };

    this.uploadCancel = function() {

        if (_xhr != null) {
            _xhr.abort();
        }
        _xhr = null;
    };

    function uploadProgress(evt) {
        if (evt.lengthComputable) {
            let uploadProgressCallbackData = {
                "event": evt, // 파일명 UUID
                "xhr": _xhr, // XMLHttpRequest 직접 컨트롤리 필요한 경우 사용
            };
            _handle_progress(uploadProgressCallbackData);
        }
    }

    function uploadComplete(evt) {
        if (evt.target.responseText === "") {
            // 업로드 성공 후, Meta 정보 저장
            let xhrSig = new XMLHttpRequest();
            xhrSig.open("POST", objectStorageUrl, false);
            xhrSig.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    let data = JSON.parse(this.response);
                    if (data.serverMsg === "success") {

                        let successCallbackData = {
                            "newFileName": _new_file_name, // 파일명 UUID
                            "orgFileName": _org_file_name, // 실제 파일명
                            "thumbnail": data.resultList[0]===undefined?'':data.resultList[0], //
                            "fileSize": data.resultList[2]===undefined?0:data.resultList[2], //
                            "bucketType": _bucket_type,   // S: 서비스, C: 회사, U: 사용자
                            "isPublic": _is_public,   // 파일이 공개되도 되는지 여부 (특정 케이스가 아니라면 false 기본)
                        };
                        // 업로드 성공 콜백함수 호출
                        _handle_success(successCallbackData);
                    }
                    else {
                        // 업로드 실패 콜백함수 호출
                        _handle_error(data.serverMsg);
                    }
                }
            };

            let idx = _org_file_name.lastIndexOf(".");
            let ext = '';
            if (idx > 0)
                ext = _org_file_name.substring(idx+1);

            let param = `BucketType=${_bucket_type}&ServiceKey=${_service_key}&ServiceCode=${_service_code}&cno=${_cno}&FileName=${encodeURIComponent(_new_file_name)}&Ext=${ext}&isPublicURL=${_is_public}&realFileName=${encodeURIComponent(_org_file_name)}&isWedrive=${_is_wedrive}&WedriveTokenID=${_wedrive_token}&TargetFileUniqueKey=${_wedrive_path}`;
            xhrSig.setRequestHeader("Authorization", "Bearer "+$.cookie("AUTH_A_TOKEN"));
            xhrSig.setRequestHeader('service', 'objectStorageService');
            xhrSig.setRequestHeader('method', 'setFileUploadSuccess');

            let clientId = getServiceCode();
            xhrSig.setRequestHeader("client-id", clientId); // 단계별 로그 clientId

            let transactionId = getTransactionId();
            xhrSig.setRequestHeader("transaction-id", transactionId); // 단계별 로그 transaction_id

            let hash_key = $.cookie("wehago_s");
            let ts = Math.floor(Date.now()/1000);
            hash_key = CryptoJS.SHA256((hash_key+ts).toString(CryptoJS.enc.Utf8), hash_key).toString(CryptoJS.enc.Base64);
            let wehagoSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(getLocation(objectStorageUrl).pathname + getLocation(objectStorageUrl).search + ts + transactionId, hash_key));

            xhrSig.setRequestHeader('wehago-sign', wehagoSign);
            xhrSig.setRequestHeader("timestamp", ts);
            xhrSig.send(param);
        } else {
            _handle_error('파일 업로드 중, 오류가 발생했습니다.');
        }
    }

    function uploadFailed(evt) {
        _handle_error('파일 업로드 중, 오류가 발생했습니다.');
    }

    function uploadCanceled(evt) {
        _handle_error('파일 업로드가 취소되었습니다.');
    }

    this.downloadFile = function({ orgFileName, fileName, s3Date, s3Auth, url, handleProgress, handleSuccess, handleError, async }) {
        _handle_progress = handleProgress;
        _handle_success  = handleSuccess;
        _handle_error    = handleError;
        _org_file_name   = orgFileName;

        let xhr = new XMLHttpRequest();
        xhr.open("GET", url, async);
        xhr.responseType = "arraybuffer";

        xhr.onloadend = function(evt) {
            if(xhr && Number(xhr.status) === 404) {
                _handle_error("파일이 존재하지 않습니다.");
            }
        };

        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {

                let blob = new Blob([xhr.response], {type: xhr.getResponseHeader("Content-Type")});

                // IOS Chrome 분기처리
                if (navigator.userAgent.match('CriOS')) {
                    let reader = new FileReader();
                    reader.onload = function(e){
                        window.location.href = reader.result
                    }
                    reader.readAsDataURL(blob);
                } else {
                    FileSaver.saveAs(blob, orgFileName)
                }
            }
        };

        xhr.addEventListener("progress", downloadProgress, false);
        xhr.addEventListener("load", downloadComplete, false);
        xhr.addEventListener("error", downloadFailed, false);
        xhr.addEventListener("abort", downloadCanceled, false);
        xhr.setRequestHeader('x-amz-date', s3Date);
        xhr.setRequestHeader('Authorization', s3Auth);

        xhr.send();
    };

    function downloadProgress(evt) {

        if (evt.lengthComputable) {
            let downloadProgressCallbackData = {
                "event": evt, // 파일명 UUID
            };
            _handle_progress(downloadProgressCallbackData);
        }
    }

    function downloadComplete(evt) {
        console.log("######### downloadComplete evt " + evt);
        _handle_success();
    }

    function downloadFailed(evt) {
        _handle_error('파일 다운로드 중, 오류가 발생했습니다.');
    }

    function downloadCanceled(evt) {
        _handle_error('파일 다운로드가 취소되었습니다.');
    }
}

let s3ObjectTools = new S3ObjectTools();

export function uploadFile({ file, bucketType, handleSuccess, handleError, handleProgress, handleCancel, isPublic, isWedrive, wedriveToken, wedrivePath, async }) {

    if(file === undefined || bucketType === undefined) {
        console.log("############ 파일 업로드에 필요한 필수 값 중, 누락된 내용이 있습니다.");
        return false;
    }

    if(async === undefined || async !== true){
        async = false
    }

    // 서비스 비밀키 조회
    let url = `${globals.wehagoCommonApiUrl}/objectstorage/security`;
    ajax.get(url, false).then((response) => {
        response = JSON.parse(response);

        if ( response.resultCode === 200 ) {

            let newFileName = uuidV1();
            let cno = 0;
            let resultData = response.resultData;
            let serviceKey = resultData.serviceKey;
            let serviceCode = resultData.serviceCode;

            if (document.getElementById("h_selected_company_no") !== null && document.getElementById("h_selected_company_no").value !== undefined && document.getElementById("h_selected_company_no").value !== '') {
                cno = document.getElementById("h_selected_company_no").value;
            }

            let xhrSig = new XMLHttpRequest();
            xhrSig.open("POST", objectStorageUrl, async);
            xhrSig.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    let data = JSON.parse(this.response);
                    if (data.serverMsg === "success") {

                        let uploadData = {
                            "file": file,   // 업로드할 파일 객체
                            "newFileName": newFileName, // 파일명 UUID
                            "serviceKey": serviceKey, // 암호화된 서비스 키
                            "serviceCode": serviceCode,  // 서비스 코드
                            "bucketType": bucketType,   // S: 서비스, C: 회사, U: 사용자
                            "cno": cno,   // company_no 회사 코드
                            "s3Auth": data.resultList[0].Auth,   // S3 Auth
                            "s3Date": data.resultList[0].Date,   // S3 date
                            "url": data.resultList[0].url,   // S3 upload url
                            "handleSuccess": handleSuccess,  // 업로드 성공 시, 콜백함수
                            "handleError": handleError,  // 업로드 실패 시, 콜백함수
                            "handleProgress": handleProgress,    // 업로드 진행상황 콜백함수
                            "handleCancel": handleCancel,    // 업로드 중 취소 시, 콜백함수
                            "isPublic": isPublic,   // 파일이 공개되도 되는지 여부 (특정 케이스가 아니라면 false 기본)
                            "async": async,   // 비동기 여부
                            "isWedrive": isWedrive===undefined?'':isWedrive,   // 웹스토리지에 저장할 경우 true, 일반적으로 저장하는 케이스는 false
                            "wedriveToken": wedriveToken===undefined?'':wedriveToken,   // isWedrive 값이 true 일 경우 웹스토리지 토큰 값
                            "wedrivePath": wedrivePath===undefined?'':wedrivePath,   // isWedrive 값이 true 일 경우 웹스토리지 저장 경로 값
                        };

                        s3ObjectTools.uploadFile(uploadData);
                    }
                    else {
                        handleError(data.serverMsg);
                    }
                }
            };

            let oldFileName = file.name;
            if (detector.os.name === "macosx" || detector.os.name === "ios") {
                oldFileName = file.name.normalize('NFC');
            }
            let param = 'Content-Type='+(mime.lookup(oldFileName)?mime.lookup(oldFileName):'application/octet-stream')+`&cno=${cno}&ServiceKey=${serviceKey}&ServiceCode=${serviceCode}&BucketType=${bucketType}&FileName=${newFileName}&isPublicURL=${isPublic}`;

            xhrSig.setRequestHeader("Authorization", "Bearer "+$.cookie("AUTH_A_TOKEN"));
            xhrSig.setRequestHeader('service', 'objectStorageService');
            xhrSig.setRequestHeader('method', 'getUploadSignature');

            let clientId = getServiceCode();
            xhrSig.setRequestHeader("client-id", clientId); // 단계별 로그 clientId

            let transactionId = getTransactionId();
            xhrSig.setRequestHeader("transaction-id", transactionId); // 단계별 로그 transaction_id

            let hash_key = $.cookie("wehago_s");
            let ts = Math.floor(Date.now()/1000);
            hash_key = CryptoJS.SHA256((hash_key+ts).toString(CryptoJS.enc.Utf8), hash_key).toString(CryptoJS.enc.Base64);
            let wehagoSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(getLocation(objectStorageUrl).pathname + getLocation(objectStorageUrl).search + ts + transactionId, hash_key));

            xhrSig.setRequestHeader('wehago-sign', wehagoSign);
            xhrSig.setRequestHeader("timestamp", ts);
            xhrSig.send(param);
        } else {
            LUXDialog.alert('비밀키 조회 중 오류가 발생하였습니다.', {type: 'error'});
            return;
        }
    });
}

export function downloadFile({ orgFileName, fileName, bucketType, handleSuccess, handleError, handleProgress }) {

    // 서비스 비밀키 조회
    let url = globals.wehagoCommonApiUrl + "/objectstorage/security";
    ajax.get(url, false).then((response) => {
        response = JSON.parse(response);
        let resultData = response.resultData;
        let serviceKey = resultData.serviceKey;
        let serviceCode = resultData.serviceCode;

        let cno = 0;
        if (document.getElementById("h_selected_company_no") !== null && document.getElementById("h_selected_company_no").value !== undefined && document.getElementById("h_selected_company_no").value !== '')
            cno = document.getElementById("h_selected_company_no").value;

        let async = true;
        let xhrSig = new XMLHttpRequest();
        xhrSig.open("POST", objectStorageUrl, async);
        xhrSig.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                let data = JSON.parse(this.response);
                if (data.serverMsg === "success") {

                    let downloadData = {
                        "orgFileName": orgFileName,   // 다운로드할 원본파일명
                        "fileName": fileName, // 파일명 UUID
                        "s3Auth": data.resultList[0].Auth,   // S3 Auth
                        "s3Date": data.resultList[0].Date,   // S3 date
                        "url": data.resultList[0].url,   // S3 download url
                        "handleSuccess": handleSuccess,  // 다운로드 성공 시, 콜백함수
                        "handleError": handleError,  // 다운로드 실패 시, 콜백함수
                        "handleProgress": handleProgress,    // 다운로드 진행상황 콜백함수
                        "async": async,   // 비동기 여부
                    };

                    s3ObjectTools.downloadFile(downloadData);
                }
                else {
                    handleError(data.serverMsg);
                }
            }
        };

        let param = `ServiceKey=${serviceKey}&ServiceCode=${serviceCode}&BucketType=${bucketType}&cno=${cno}&FileName=${fileName}`;

        xhrSig.setRequestHeader("Authorization", "Bearer "+$.cookie("AUTH_A_TOKEN"));
        xhrSig.setRequestHeader('service', 'objectStorageService');
        xhrSig.setRequestHeader('method', 'getDownloadSignature');

        let clientId = getServiceCode();
        xhrSig.setRequestHeader("client-id", clientId); // 단계별 로그 clientId

        let transactionId = getTransactionId();
        xhrSig.setRequestHeader("transaction-id", transactionId); // 단계별 로그 transaction_id

        let hash_key = $.cookie("wehago_s");
        let ts = Math.floor(Date.now()/1000);
        hash_key = CryptoJS.SHA256((hash_key+ts).toString(CryptoJS.enc.Utf8), hash_key).toString(CryptoJS.enc.Base64);
        let wehagoSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(getLocation(objectStorageUrl).pathname + getLocation(objectStorageUrl).search + ts + transactionId, hash_key));

        xhrSig.setRequestHeader('wehago-sign', wehagoSign);
        xhrSig.setRequestHeader("timestamp", ts);
        xhrSig.send(param);
    });
}

export function uploadCancel() {
    s3ObjectTools.uploadCancel();
}

export function webOffice({ fileName, orgFileName, readOnly, bucketType }) {

    // 서비스 비밀키 조회
    let url = globals.wehagoCommonApiUrl + "/objectstorage/security";
    ajax.get(url, false).then((response) => {
        response = JSON.parse(response);
        let resultData = response.resultData;
        let serviceKey = resultData.serviceKey;
        let serviceCode = resultData.serviceCode;

        let idx = orgFileName.lastIndexOf(".");
        let ext = '';
        if (idx > 0)
            ext = orgFileName.substring(idx+1).toLowerCase();

        // 지원 가능 확장자 (http://wiki.duzon.com:8080/pages/viewpage.action?pageId=11800839)
        let app_name = '';
        if ( ext === 'hwp' || ext === 'docx' || ext === 'doc' || ext === 'txt' ) {    // 워드프로세서 문서
            app_name += 'WRITE_';
        } else if ( ext === 'cell' || ext === 'xlsx' || ext === 'xls' ) {  // 스프레드시트 문서
            app_name += 'CALC_';
        } else if ( ext === 'show' || ext === 'pptx' || ext === 'ppt' ) {  // 프레젠테이션 문서
            app_name += 'SHOW_';
        } else {
            LUXDialog.alert('OFFICE 파일 종류가 아닙니다.', {type: 'error'});
            return;
        }

        // 읽기모드, 편집모드
        if( readOnly ) {
            app_name += 'VIEWER';
        } else {
            app_name += 'EDITOR';
        }

        let cno = 0;
        if (document.getElementById("h_selected_company_no") !== null && document.getElementById("h_selected_company_no").value !== undefined && document.getElementById("h_selected_company_no").value !== '')
            cno = document.getElementById("h_selected_company_no").value;

        let userName = '';
        if (document.getElementById("h_user_name") !== null && document.getElementById("h_user_name").value !== undefined && document.getElementById("h_user_name").value !== '')
            userName = document.getElementById("h_user_name").value;

        let portalId = '';
        if (document.getElementById("h_portal_id") !== null && document.getElementById("h_portal_id").value !== undefined && document.getElementById("h_portal_id").value !== '')
            portalId = document.getElementById("h_portal_id").value;

        // 다국어
        const currentLanguage = Lang.getLanguage(false);

        let url = webOfficeUrl;
        url += encodeURIComponent(orgFileName);
        url += '/open?app='+app_name;
        url += '&fid='+fileName;
        url += '&oAuthTokenID=Bearer '+$.cookie("AUTH_A_TOKEN");
        url += '&BucketType='+bucketType;
        url += '&ServiceKey='+encodeURIComponent(serviceKey);
        url += '&ServiceCode='+serviceCode;
        url += '&cno='+cno;
        url += '&user_id='+encodeURIComponent(userName+'('+portalId+')');
        url += `&lang=${currentLanguage}`;

        window.open(url, "_blank");
    });
}


/* 위하고 EDGE/T 파일전용 */
export function T_webOffice({ fileName, orgFileName, readOnly, bucketType ,t_cno}) {

    // 서비스 비밀키 조회
    let url = globals.wehagoCommonApiUrl + "/objectstorage/security";
    ajax.get(url, false).then((response) => {
        response = JSON.parse(response);
        let resultData = response.resultData;
        let serviceKey = resultData.serviceKey;
        let serviceCode = resultData.serviceCode;

        let idx = orgFileName.lastIndexOf(".");
        let ext = '';
        if (idx > 0)
            ext = orgFileName.substring(idx+1).toLowerCase();

        // 지원 가능 확장자 (http://wiki.duzon.com:8080/pages/viewpage.action?pageId=11800839)
        let app_name = '';
        if ( ext === 'hwp' || ext === 'docx' || ext === 'doc' || ext === 'txt' ) {    // 워드프로세서 문서
            app_name += 'WRITE_';
        } else if ( ext === 'cell' || ext === 'xlsx' || ext === 'xls' ) {  // 스프레드시트 문서
            app_name += 'CALC_';
        } else if ( ext === 'show' || ext === 'pptx' || ext === 'ppt' ) {  // 프레젠테이션 문서
            app_name += 'SHOW_';
        } else {
            LUXDialog.alert('OFFICE 파일 종류가 아닙니다.', {type: 'error'});
            return;
        }

        // 읽기모드, 편집모드
        if( readOnly ) {
            app_name += 'VIEWER';
        } else {
            app_name += 'EDITOR';
        }

        let cno = 0;
        cno = t_cno;

        let userName = '';
        if (document.getElementById("h_user_name") !== null && document.getElementById("h_user_name").value !== undefined && document.getElementById("h_user_name").value !== '')
            userName = document.getElementById("h_user_name").value;

        let portalId = '';
        if (document.getElementById("h_portal_id") !== null && document.getElementById("h_portal_id").value !== undefined && document.getElementById("h_portal_id").value !== '')
            portalId = document.getElementById("h_portal_id").value;

        // 다국어
        const currentLanguage = Lang.getLanguage(false);

        let url = webOfficeUrl;
        url += encodeURIComponent(orgFileName);
        url += '/open?app='+app_name;
        url += '&fid='+fileName;
        url += '&oAuthTokenID=Bearer '+$.cookie("AUTH_A_TOKEN");
        url += '&BucketType='+bucketType;
        url += '&ServiceKey='+encodeURIComponent(serviceKey);
        url += '&ServiceCode='+serviceCode;
        url += '&cno='+cno;
        url += '&user_id='+encodeURIComponent(userName+'('+portalId+')');
        url += `&lang=${currentLanguage}`;

        window.open(url, "_blank");
    });
}

export function getUnauthDownloadFile({ fileName, orgFileName, bucketType, companyNo, userNo }) {

    // 서비스 비밀키 조회
    let url = globals.wehagoCommonApiUrl + "/objectstorage/security";
    ajax.get(url, false).then((response) => {
        response = JSON.parse(response);
        let resultData = response.resultData;
        let serviceKey = resultData.serviceKey;
        let serviceCode = resultData.serviceCode;

        ajax.getUncertToken("/ObjectStorageCommon/services/public", "post", function (signature) {

            let idx = orgFileName.lastIndexOf(".");
            let ext = '';
            if (idx > 0)
                ext = orgFileName.substring(idx+1);

            let xhrSig = new XMLHttpRequest();
            let url = unCertApiUrl + '/ObjectStorageCommon/services/public';
            xhrSig.open("POST", url, true);
            xhrSig.onreadystatechange = function() {
                if (this.readyState === 4 && this.status === 200) {
                    let data = JSON.parse(this.response);
                    if (data.serverMsg === "success") {

                        let xhr = new XMLHttpRequest();
                        xhr.open("GET", data.resultList[0], true);
                        xhr.responseType = "arraybuffer";
                        xhr.onreadystatechange = function() {
                            if (xhr.readyState === 4 && xhr.status === 200) {

                                let blob = new Blob([xhr.response], {type: xhr.getResponseHeader("Content-Type")});

                                // IOS Chrome 분기처리
                                if (navigator.userAgent.match('CriOS')) {
                                    let reader = new FileReader();
                                    reader.onload = function(e){
                                        window.location.href = reader.result
                                    }
                                    reader.readAsDataURL(blob);
                                } else {
                                    FileSaver.saveAs(blob, orgFileName)
                                }
                            }
                        };
                        xhr.send();
                    }
                    else {
                        LUXDialog.alert(data.serverMsg, {type: 'error'});
                    }
                }
            };

            let param = `ServiceKey=${serviceKey}&ServiceCode=${serviceCode}&BucketType=${bucketType}&FileName=${fileName}&Ext=${ext}&cno=${companyNo}&UserNo=${userNo}`;

            xhrSig.setRequestHeader('service', 'objectStorageService');
            xhrSig.setRequestHeader('method', 'getAttachmentsPublicURL');
            xhrSig.setRequestHeader('signature', signature);

            let clientId = getServiceCode();
            xhrSig.setRequestHeader("client-id", clientId); // 단계별 로그 clientId

            let transactionId = getTransactionId();
            xhrSig.setRequestHeader("transaction-id", transactionId); // 단계별 로그 transaction_id

            let hash_key = $.cookie("wehago_s");
            let ts = Math.floor(Date.now()/1000);
            hash_key = CryptoJS.SHA256((hash_key+ts).toString(CryptoJS.enc.Utf8), hash_key).toString(CryptoJS.enc.Base64);
            let wehagoSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(getLocation(objectStorageUrl).pathname + getLocation(objectStorageUrl).search + ts + transactionId, hash_key));

            xhrSig.setRequestHeader('wehago-sign', wehagoSign);
            xhrSig.setRequestHeader("timestamp", ts);
            xhrSig.send(param);
        });
    });
}

export function deleteFile({ fileKey, fileName, bucketType, callbackFn }) {

    // 서비스 비밀키 조회
    let url = globals.wehagoCommonApiUrl + "/objectstorage/security";
    ajax.get(url, false).then((response) => {
        response = JSON.parse(response);
        let resultData = response.resultData;
        let serviceKey = resultData.serviceKey;
        let serviceCode = resultData.serviceCode;

        let async = true;
        let cno = 0;
        if (document.getElementById("h_selected_company_no") !== null && document.getElementById("h_selected_company_no").value !== undefined && document.getElementById("h_selected_company_no").value !== '')
            cno = document.getElementById("h_selected_company_no").value;

        let xhrSig = new XMLHttpRequest();
        xhrSig.open("POST", objectStorageUrl, async);

        xhrSig.onreadystatechange = function() {

            if (this.readyState === 4 && this.status === 200) {
                let data = JSON.parse(this.response);

                let callbackData = {
                    "fileKey": fileKey,   // 파일 고유 키
                    "fileName": fileName, // 파일명 UUID
                    "result": data, // 처리 결과
                };

                callbackFn(callbackData);
            }
        };

        let param = `ServiceKey=${serviceKey}&ServiceCode=${serviceCode}&BucketType=${bucketType}&cno=${cno}&FileName=${fileName}`;

        xhrSig.setRequestHeader("Authorization", "Bearer "+$.cookie("AUTH_A_TOKEN"));
        xhrSig.setRequestHeader('service', 'objectStorageService');
        xhrSig.setRequestHeader('method', 'deleteFileCommonMeta');

        let clientId = getServiceCode();
        xhrSig.setRequestHeader("client-id", clientId); // 단계별 로그 clientId

        let transactionId = getTransactionId();
        xhrSig.setRequestHeader("transaction-id", transactionId); // 단계별 로그 transaction_id

        let hash_key = $.cookie("wehago_s");
        let ts = Math.floor(Date.now()/1000);
        hash_key = CryptoJS.SHA256((hash_key+ts).toString(CryptoJS.enc.Utf8), hash_key).toString(CryptoJS.enc.Base64);
        let wehagoSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(getLocation(objectStorageUrl).pathname + getLocation(objectStorageUrl).search + ts + transactionId, hash_key));

        xhrSig.setRequestHeader('wehago-sign', wehagoSign);
        xhrSig.setRequestHeader("timestamp", ts);
        xhrSig.send(param);
    });
}

export function publicURL({ fileName, orgFileName, bucketType, callbackFn }) {

    // 서비스 비밀키 조회
    let url = globals.wehagoCommonApiUrl + "/objectstorage/security";
    ajax.get(url, false).then((response) => {
        response = JSON.parse(response);
        let resultData = response.resultData;
        let serviceKey = resultData.serviceKey;
        let serviceCode = resultData.serviceCode;

        let idx = orgFileName.lastIndexOf(".");
        let ext = '';
        if (idx > 0)
            ext = orgFileName.substring(idx+1);

        let async = true;
        let cno = 0;
        if (document.getElementById("h_selected_company_no") !== null && document.getElementById("h_selected_company_no").value !== undefined && document.getElementById("h_selected_company_no").value !== '') {
            cno = document.getElementById("h_selected_company_no").value;
        }

        let xhrSig = new XMLHttpRequest();
        xhrSig.open("POST", objectStorageUrl, async);

        xhrSig.onreadystatechange = function() {

            if (this.readyState === 4 && this.status === 200) {
                let data = JSON.parse(this.response);

                let callbackData = {
                    "result": data, // 처리 결과
                };

                callbackFn(callbackData);
            }
        };

        let param = `ServiceKey=${serviceKey}&ServiceCode=${serviceCode}&BucketType=${bucketType}&cno=${cno}&FileName=${fileName}&Ext=${ext}`;

        xhrSig.setRequestHeader("Authorization", "Bearer "+$.cookie("AUTH_A_TOKEN"));
        xhrSig.setRequestHeader('service', 'objectStorageService');
        xhrSig.setRequestHeader('method', 'getPublicURL');

        let clientId = getServiceCode();
        xhrSig.setRequestHeader("client-id", clientId); // 단계별 로그 clientId

        let transactionId = getTransactionId();
        xhrSig.setRequestHeader("transaction-id", transactionId); // 단계별 로그 transaction_id

        let hash_key = $.cookie("wehago_s");
        let ts = Math.floor(Date.now()/1000);
        hash_key = CryptoJS.SHA256((hash_key+ts).toString(CryptoJS.enc.Utf8), hash_key).toString(CryptoJS.enc.Base64);
        let wehagoSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(getLocation(objectStorageUrl).pathname + getLocation(objectStorageUrl).search + ts + transactionId, hash_key));

        xhrSig.setRequestHeader('wehago-sign', wehagoSign);
        xhrSig.setRequestHeader("timestamp", ts);
        xhrSig.send(param);
    });
}

export function bucketMoveFile({ fileName, orgCompanyNo, orgBucketType, newCompanyNo, newBucketType, callbackFn }) {

    // 서비스 비밀키 조회
    let url = globals.wehagoCommonApiUrl + "/objectstorage/security";
    ajax.get(url, false).then((response) => {
        response = JSON.parse(response);
        let resultData = response.resultData;
        let serviceKey = resultData.serviceKey;
        let serviceCode = resultData.serviceCode;

        let async = true;
        let xhrSig = new XMLHttpRequest();
        xhrSig.open("POST", objectStorageUrl, async);

        xhrSig.onreadystatechange = function() {

            if (this.readyState === 4 && this.status === 200) {
                let data = JSON.parse(this.response);

                let callbackData = {
                    "result": data, // 처리 결과
                };

                callbackFn(callbackData);
            }
        };

        let newFileName = uuidV1();
        let param = `ServiceKey=${serviceKey}&ServiceCode=${serviceCode}&SourceBucketType=${orgBucketType}&SourceCno=${orgCompanyNo}&SourceObject=${fileName}&TargetBucketType=${newBucketType}&TargetCno=${newCompanyNo}&TargetObject=${newFileName}`;

        xhrSig.setRequestHeader("Authorization", "Bearer "+$.cookie("AUTH_A_TOKEN"));
        xhrSig.setRequestHeader('service', 'objectStorageService');
        xhrSig.setRequestHeader('method', 'moveMailObjectsToAnotherService');

        let clientId = getServiceCode();
        xhrSig.setRequestHeader("client-id", clientId); // 단계별 로그 clientId

        let transactionId = getTransactionId();
        xhrSig.setRequestHeader("transaction-id", transactionId); // 단계별 로그 transaction_id

        let hash_key = $.cookie("wehago_s");
        let ts = Math.floor(Date.now()/1000);
        hash_key = CryptoJS.SHA256((hash_key+ts).toString(CryptoJS.enc.Utf8), hash_key).toString(CryptoJS.enc.Base64);
        let wehagoSign = CryptoJS.enc.Base64.stringify(CryptoJS.HmacSHA256(getLocation(objectStorageUrl).pathname + getLocation(objectStorageUrl).search + ts + transactionId, hash_key));

        xhrSig.setRequestHeader('wehago-sign', wehagoSign);
        xhrSig.setRequestHeader("timestamp", ts);
        xhrSig.send(param);
    });
}

export function getLocation(url) {

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
}

export function getServiceCode() {

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
}

export function getTransactionId() {

    let chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    let string_length = 10;
    let  randomstring = '';
    for (let i=0; i<string_length; i++) {
        let rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum,rnum+1);
    }
    return randomstring;
}
