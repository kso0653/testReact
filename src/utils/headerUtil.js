import $ from "jquery";
import "jquery.cookie";
import ajax from "./ajax";

const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");

export default {
    showHeader: function () {
        // 헤더 보임처리
        $("#divPortalHeader").css("display", "block");
        $("#BODY_CLASS > .snbnext").css("top", "54px");
        if (window.location.href.indexOf("/#/invoice") > 0 && $("#BODY_CLASS > .snbnext").length === 0 && $("#BODY_CLASS .snbnext").length === 1) {
            $("#BODY_CLASS .snbnext").css("top", "54px");
        }
    },
    hideHeader: function () {
       // 헤더 숨김
        $("#divPortalHeader").css("display", "none");
        $("#BODY_CLASS > .snbnext").css("top", "0px");
        if (window.location.href.indexOf("/#/invoice") > 0 && $("#BODY_CLASS > .snbnext").length === 0 && $("#BODY_CLASS .snbnext").length === 1) {
            $("#BODY_CLASS .snbnext").css("top", "0px");
        }
    },

};
