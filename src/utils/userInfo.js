/**
 * UIUX Core팀 민병훈 연구원
 * Operate View 서비스에서 사용될 WEHAGO 접속자에 대한 기초 데이터 수집
 */
import ajax from "./ajax";
import getIp from "./tools";

const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");

export default {
    getUserInformation: function () {
        // console.info("### - getUserInformation :::");
        // 위치(위도, 경도) 정보 얻는 방법
        let target = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                // console.info("### - location :::", position.coords.latitude, position.coords.longitude);
                target.sendLocationPosition(position.coords.latitude, position.coords.longitude);
            }, function(warning) {
                // console.warn('ERROR(' + warning.code + '): ' + warning.message);
                target.sendLocationPosition('', '');
            }, {
                enableHighAccuracy: false,
                maximumAge: 0,
                timeout: Infinity
            });
        } else {
            // console.error("navigator.geolocation을 지원하지 않습니다.");
            this.sendLocationPosition('', '');
        }
    },
    sendLocationPosition: function(latitude, longitude) {
        let ip = getIp.getLocalIp();           // ip
        let os = navigator.platform;           // 운영체제
        let browser = this.getBrowser();       // 브라우저
        let language = navigator.language;     // 언어
        let date = this.getDate(false);        // 접속날짜
        let fullDate = this.getDate(true);     // 전체 접속날짜
        let resolution = this.getResolution(); // 해상도

        if (latitude != '' && longitude != '') {
            // 주소, 국가 정보 얻는 방법
            let promise = new Promise(function(resolve, reject) {
                let request = new XMLHttpRequest();
                let url = 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latitude + ',' + longitude + '&language=ko';
                request.open("GET", url);
                request.addEventListener("load", function() {
                    if (request.status === 200) {
                        resolve(request.responseText);
                    } else {
                        reject("서버에러: " + request.status);
                    }
                }, false);
                request.addEventListener("error", function() {
                    reject("AJAX 요청 실패");
                }, false);

                request.send();
            });

            promise.then(function(value) {
                value = JSON.parse(value);
                let fullAddress = value.results[0].formatted_address;
                let address = value.results[value.results.length-2].address_components[0].short_name;
                let country = value.results[value.results.length-1].address_components[0].short_name;
                this.setLogSystemAPI(
                    latitude,
                    longitude,
                    fullAddress,
                    address,
                    country,
                    ip,
                    os,
                    browser,
                    language,
                    date,
                    fullDate,
                    resolution,
                )
            }.bind(this), function(error) {
                // console.error("googleMapsApi 호출 서버 에러: ", error);
            });
        } else {
            let fullAddress = '';
            let address = '';
            let country = '';
            this.setLogSystemAPI(
                latitude,
                longitude,
                fullAddress,
                address,
                country,
                ip,
                os,
                browser,
                language,
                date,
                fullDate,
                resolution,
            )
        }
    },
    getDate: function(bool) {
        let date = new Date();

        if (bool) { // fullDate
            let year = date.getFullYear().toString();
            let month = (date.getMonth() + 1).toString();
            let day = date.getDate().toString();
            let hour = date.getHours().toString();
            let minute = date.getMinutes().toString();
            if (minute.length != 2) minute = '0' + minute; // 0~9분 까지는 1자리로 나오기 때문에 0을 하나 붙여준다.
            let second = date.getSeconds().toString();

            return year + month + day + hour + minute + second;
        } else { // date
            let year = date.getFullYear().toString();
            let month = (date.getMonth() + 1).toString();
            let day = date.getDate().toString();

            return year + month + day;
        }
    },
    getBrowser: function() {
        let agent = navigator.userAgent.toLowerCase();
        let name = navigator.appName;
        let browser = '';

        if (name === 'Microsoft Internet Explorer' || agent.indexOf('trident') > -1 || agent.indexOf('edge/') > -1) {
            browser = 'IE';
            if (name === 'Microsoft Internet Explorer') { // IE old version (IE 10 or Lower)
                agent = /msie ([0-9]{1,}[\.0-9]{0,})/.exec(agent);
                browser += parseInt(agent[1]);
            } else { // IE 11+
                if (agent.indexOf('trident') > -1) { // IE 11
                    browser += 11;
                } else if (agent.indexOf('edge/') > -1) { // Edge
                    browser = 'Edge';
                }
            }
        } else if (agent.indexOf('safari') > -1) { // Chrome or Safari
            if (agent.indexOf('opr') > -1) { // Opera
                browser = 'Opera';
            } else if (agent.indexOf('chrome') > -1) { // Chrome
                browser = 'Chrome';
            } else { // Safari
                browser = 'Safari';
            }
        } else if (agent.indexOf('firefox') > -1) { // Firefox
            browser = 'Firefox';
        }

        return browser;
    },
    getResolution: function() {
        return screen.availWidth + 'x' + screen.availHeight;
    },
    setLogSystemAPI: function(a, b, c, d, e, f, g, h, i, j, k, l) {
        // 접속자 ID 검색
        let url = globals.portalAuthenticationApiUrl + "/login/userinfo";
        ajax.get(url).then(function(response) {
            response = JSON.parse(response);
            if (response.resultCode === 200) {
                let object = {
                    "index": "operation_data",
                    "type": "user_info",
                    "timestamp": Date.now(),
                    "data": JSON.stringify(
                        {
                            id: response.resultData.portal_id,
                            latitude: a,
                            longitude: b,
                            fullAddress: c,
                            address: d,
                            country: e,
                            ip: f,
                            os: g,
                            browser: h,
                            language: i,
                            date: j,
                            fullDate: k,
                            resolution: l,
                        })
                };

                // 비인증 API 호출 방식 이전 (로그 시스템)
                // ajax.post(globals.logsystemApiUrl + "post/", object).then(function(response) {
                //     response = JSON.parse(response);
                //     console.info("###$ - getUserInformation :::");
                // }.bind(this), function(error) {
                //     console.error("Failed!", error);
                // }.bind(this));

                // 비인증 API 호출 (로그 시스템)
                ajax.getUncertToken("/logsystem/post/", "get", function (signature) {
                    let url = globals.unCertApiUrl + "/logsystem/post/";
                    ajax.post(url, object, {signature: signature}).then(function(response) {
                        response = JSON.parse(response);
                        // console.info("###$ - getUserInformation :::");
                    }.bind(this), function(error) {
                        // console.error("Failed!", error);
                    }.bind(this));
                }.bind(this));
            }
        }.bind(this), function(error) {
            // console.error(error);
        }.bind(this));
    },
};