const globals = require("../../../../../config/" + process.env.BUILD_ENV + "/Portal/globals");

const runAndroidApp = function() {
    location.href = "intent://wehago#Intent;scheme=qrcode;action=android.intent.action.VIEW;category=android.intent.category.BROWSABLE;package=com.duzon.android.lulubizpotal;end"
}

const runIosApp = function() {
    location.href = "wehago://?";  // ios WEHAGO앱 실행
    setTimeout(function() {
        location.href = globals.iosWEHAGOSetupUrl;  // ios WEHAGO앱 미설치로 인해 마켓 실행
    }, 500);
}

const runApp = function () {

}

export default {

};
