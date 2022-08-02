import $ from "jquery";
import "jquery.cookie";
import ajax from "./ajax";
import headerUtil from "./headerUtil";
import MainUtil,{KOSMES, SSM, CHILD_FUND, MOIS_CNO_PRODUCTION, MOIS_CNO_DEV} from "./mainutil";

const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");

const {
    isServiceCustomCompany,
} = MainUtil;

export default {
    planLnb: function () {
        let apiUrl = globals.wehagoCommonApiUrl + "/market/membership";

        ajax.get(apiUrl, {cacheUse: true, cacheName: "MainBranchMembership", cacheTime: 120}).then((response) => {
            response = JSON.parse(response);
            // 엣지 플랜일 경우
            if (response.resultCode === 200 && response.resultData != null) {
                let cno = $.cookie('h_selected_company_no') || $('#h_selected_company_no').val();
                let is_client_tax_user = sessionStorage.getItem(cno+"-is_client_tax_user");
                let membership_code = sessionStorage.getItem(cno+"-membership_code");

                let isKosmes = isServiceCustomCompany(KOSMES);
                let isSsm = isServiceCustomCompany(SSM);
                let isChildFund = isServiceCustomCompany(CHILD_FUND);

                const isProduction = ['production'].includes(process.env.BUILD_ENV);
                const isDev = ['dev', 'local'].includes(process.env.BUILD_ENV);

                const isMoisProduction = (MOIS_CNO_PRODUCTION.includes(cno) && isProduction) || (MOIS_CNO_DEV.includes(cno) && isDev);

                if ((response.resultData.membership_code !== undefined && response.resultData.membership_code === "WE")
                    || (is_client_tax_user !== null && is_client_tax_user !== undefined && is_client_tax_user === "T")
                    || (membership_code == "LE")
                    || location.hash.indexOf("#/common/search") > -1 || isKosmes || isSsm || isChildFund || isMoisProduction) {

                    // LNB 숨김처리
                    $("#divNavigator").css("display", "none");
                    $("#divPortalHeader").css("left", "0px");
                    $("#BODY_CLASS > .snbnext").css("left", "0px");

                    if ((window.location.href.indexOf("/#/invoice") > 0 || window.location.href.indexOf("/#/mail") > 0 )&& $("#BODY_CLASS > .snbnext").length === 0 && $("#BODY_CLASS .snbnext").length === 1) {
                        $("#BODY_CLASS .snbnext").css("left", "0px");
                    } else if (window.location.href.indexOf("/managesns") > 0 && $("#BODY_CLASS > .snbnext").length === 0 && $("#root .snbnext").length === 1) {
                        $("#root .snbnext").css("left", "0px");
                    }
                } else if ((response.resultData.membership_code !== undefined && response.resultData.membership_code === "OP") || (membership_code == "OP")){
                    // OP 일경우
                    // LNB, 헤더 숨김처리

                    $("#divNavigator").css("display", "none");
                    $("#divPortalHeader").css("left", "0px");
                    $("#BODY_CLASS > .snbnext").css("left", "0px");
                    if (window.location.href.indexOf("/#/invoice") > 0 && $("#BODY_CLASS > .snbnext").length === 0 && $("#BODY_CLASS .snbnext").length === 1) {
                        $("#BODY_CLASS .snbnext").css("left", "0px");
                    } else if (window.location.href.indexOf("/managesns") > 0 && $("#BODY_CLASS > .snbnext").length === 0 && $("#root .snbnext").length === 1) {
                        $("#root .snbnext").css("left", "0px");
                    }

                    headerUtil.hideHeader();

                } else {
                    // LNB 보임처리
                    $("#divNavigator").css("display", "block");
                    $("#divPortalHeader").css("display", "block");
                    $("#divPortalHeader").css("left", "48px");
                    $("#BODY_CLASS > .snbnext").css("left", "48px");
                    if (window.location.href.indexOf("/#/invoice") > 0 && $("#BODY_CLASS > .snbnext").length === 0 && $("#BODY_CLASS .snbnext").length === 1) {
                        $("#BODY_CLASS .snbnext").css("left", "48px");
                    } else if (window.location.href.indexOf("/managesns") > 0 && $("#BODY_CLASS > .snbnext").length === 0 && $("#root .snbnext").length === 1) {
                        $("#root .snbnext").css("left", "48px");
                    }
                }
            }
        }, (error) => {

        });
    },
    showLnb: function () {
        // LNB 보임처리
        $("#divNavigator").css("display", "block");
        $("#divPortalHeader").css("left", "48px");
        $("#BODY_CLASS > .snbnext").css("left", "48px");
    },
    hideLnb: function () {
        // LNB 숨김처리
        $("#divNavigator").css("display", "none");
        $("#divPortalHeader").css("left", "0px");
        $("#BODY_CLASS > .snbnext").css("left", "0px");
        if (window.location.href.indexOf("/#/invoice") > 0 && $("#BODY_CLASS > .snbnext").length === 0 && $("#BODY_CLASS .snbnext").length === 1) {
            $("#BODY_CLASS .snbnext").css("left", "0px");

            // 전자세금계산서 한번에 안바뀌문 문제 처리
            setTimeout(function () {
                $("#BODY_CLASS .snbnext").css("left", "0px");
            }, 1);
        } else if (window.location.href.indexOf("/managesns") > 0 && $("#BODY_CLASS > .snbnext").length === 0 && $("#root .snbnext").length === 1) {
            $("#root .snbnext").css("left", "0px");
        }
    },

};
