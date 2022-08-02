import ajax from "./ajax";
import detector from "detector";

const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");

export default {
    analytics: function (service = null) {
        // 분기 3곳
        // wa.js , app.js, header.js
        // wehago analytics 호출
        const buildEnv = ['dev', 'production', 'wehagov'];
        if (buildEnv.includes(process.env.BUILD_ENV)) {
            // wehago analytics 적재
            let waParam = {
                "url": document.location.href,
                "site": document.location.origin,
                "context_path": this.getContextPath(), //document.location.hash,
                "service": service ? service : ajax.getServiceCode(),
                "device": detector.device.name,
                "os": `${detector.os.name}`,
                "os_version": `${detector.os.fullVersion}`,
                "browser": `${detector.browser.name}`,
                "browser_version": `${detector.browser.fullVersion}`
                //"ip": Tools.getLocalIp(), // 필수아님
            };

            let url = `${globals.wehagoAnalyticsApiUrl}/analytics`;
            ajax.post(url, waParam, {timeout: 3000}).then((response) => {
                // 성공
            }, (error) => {
                // 실패
            });
        }

    },
    getContextPath: function () {
        let contextPath = '';
        try{
            const fullpath = document.location.href;
            const path = fullpath.replace(document.location.origin,'');
            const pathArr = path.split('?');
            if (pathArr && pathArr.length > 0) {
                contextPath =  pathArr[0];
            } else {
                contextPath =  document.location.hash;
            }
        }catch (e) {
            console.error(e);
        }
        return contextPath;
    },
};