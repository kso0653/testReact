import Validation from "./validation";
import Ajax from "./ajax";
import String from "./string";

const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");

export default {
    getLocalIp: function() {
        let localIp = sessionStorage.getItem(`LocalIp`);
        if (!Validation.checkEmpty(localIp)) {
            return localIp;
        }
        if (document.domain.indexOf("dev.") > -1) {
            localIp = "0.0.0.0";
            return localIp;
        }

        let oReq = new XMLHttpRequest();
        oReq.open("GET", globals.ipIdentifyUrl, true);
        oReq.timeout = 2000; // time in milliseconds
        oReq.onload = function() {
            localIp = oReq.responseText.trim();
            sessionStorage.setItem(`LocalIp`, localIp);
        };
        oReq.ontimeout = function() {
            // localIp = "-";
        };
        oReq.send();

        return localIp;
    },
    getLocalIp2: function() {
        let localIp = sessionStorage.getItem(`LocalIp`);
        if (!Validation.checkEmpty(localIp)) {
            return localIp;
        }

        // const apiUrl = `${globals.wehagoCommonApiUrl}/local-ip`;
        // Ajax.get(apiUrl, false).then((response) => {
        //     response = JSON.parse(response);
        //     console.info(`@@@ ${apiUrl} - response ::: `, response);
        //
        //     if (response.resultCode === 200 && !Validation.checkEmpty(response.resultData)) {
        //         localIp = String.fixNull(response.resultData);
        //         // sessionStorage.setItem(`LocalIp`, localIp);
        //         return localIp;
        //     } else {
        //         return "127.0.0.1";
        //     }
        // }, (error) => {
        //     return "127.0.0.1";
        // });

        // 비인증 API 호출 (로컬 IP 조회)
        const rand = Ajax.getTransactionId();
        const apiUrl = `/common/local-ip?rand=${rand}`;
        Ajax.getUncertToken(apiUrl, "get", (signature, status) => {
            if (Validation.checkEmpty(signature)) {
                // // LUXDialog.alert("Signature is None", {type: 'error'});
                // if (status === 0) {
                //     LUXDialog.error({
                //         type: 'error',
                //         content: ['네트워크 연결상태가 좋지 않습니다.', '원활한 서비스 이용을 위해 네트워크 연결상태를 확인 후, 다시 로그인을 시도해주세요.'],
                //     });
                // } else {
                //     LUXDialog.error();
                // }
                return "127.0.0.1";
            } else {
                Ajax.get(globals.unCertApiUrl + apiUrl, {signature: signature}).then((response) => {
                    response = JSON.parse(response);
                    // console.info(`@@@ ${apiUrl} - response ::: `, response);

                    if (response.resultCode === 200 && !Validation.checkEmpty(response.resultData)) {
                        localIp = String.fixNull(response.resultData);
                        sessionStorage.setItem(`LocalIp`, localIp);
                        return localIp;
                    } else {
                        return "127.0.0.1";
                    }
                }, (error) => {
                    return "127.0.0.1";
                });
            }
        });
    },
    arrayMove: function(arr, previousIndex, newIndex) {
        let array = arr.slice(0);
        if (newIndex >= array.length) {
            let k = newIndex - array.length;
            while (k-- + 1) {
                array.push(undefined);
            }
        }
        array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);
        return array;
    },
};