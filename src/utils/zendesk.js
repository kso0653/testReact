import $ from "jquery";
import ajax from "../utils/ajax";
import Validation from "./validation";

const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");

export default {
    getZendeskUrl: function () {
        // 1. 디폴트 주소
        let url = "https://wehagohelp.zendesk.com";
        // 2. BUILD_ENV 따라 처리
        // 3. 플랜코드에 따라 처리
        if(process.env.BUILD_ENV === "wehagov"){
            return "https://wehagovhelp.zendesk.com";
        }else if ($("#h_selected_company_no") !== undefined && $("#h_selected_company_no").val() !== undefined && $("#h_selected_company_no").val() !== ""){
            if (sessionStorage.getItem($("#h_selected_company_no").val() + "-membership_code") !== null && sessionStorage.getItem($("#h_selected_company_no").val() + "-membership_code") !== undefined){
                let membership_code = sessionStorage.getItem($("#h_selected_company_no").val() + "-membership_code");
                if (membership_code !== null && membership_code !== undefined && membership_code.indexOf("WT") > -1){
                    return "https://wehagothelp.zendesk.com";
                } else if (membership_code !== null && membership_code !== undefined && membership_code.indexOf("WE") > -1){
                    return "https://wehagotedgehelp.zendesk.com";
                } else {
                    return url;
                }
            }
        }
        // 3. 없으면 도메인 따라 처리
        if (document.location.href.toLowerCase().indexOf("wehagot.com") > -1){
            return "https://wehagothelp.zendesk.com";
        }
        return url;
    },
    getZendeskUserGuideUrl: function () {
        let zendesk_url = this.getZendeskUrl();
        let user_guide = "/hc/ko/categories/360000202554-WEHAGO이용가이드";
        if (zendesk_url.indexOf("wehagothelp") > -1){
            user_guide = "/hc/ko/categories/360000052442";
        } else if (zendesk_url.indexOf("wehagotedgehelp") > -1){
            user_guide = "/hc/ko/categories/360000052521-이용가이드";
        }
        return zendesk_url + user_guide;
    },
    getZendeskRequestNewUrl: function () {
        let zendesk_url = this.getZendeskUrl();
        let request_new = "/hc/ko/requests/new";
        if (zendesk_url.indexOf("wehagothelp") > -1){
            request_new = "/hc/ko/requests/new";
        }
        return zendesk_url + request_new;
    },
    getZendeskNoticeUrl: function () {
        let zendesk_url = this.getZendeskUrl();
        let user_guide = "/hc/ko/sections/360000548774-WEHAGO공지사항";
        if (zendesk_url.indexOf("wehagothelp") > -1){
            user_guide = "/hc/ko/sections/360000078521-WEHAGO-T-공지사항";
        } else if (zendesk_url.indexOf("wehagovhelp") > -1){
            user_guide = "/hc/ko/sections/900001417323-WEHAGO-V-공지사항";
        } else if (zendesk_url.indexOf("wehagotedgehelp") > -1){
            user_guide = "/hc/ko/sections/900000151366";
        }
        return zendesk_url + user_guide;
    },
    gotoWehagohelpdesk: function (toUrl) {
        if(toUrl && typeof toUrl === "string") {
            let url = `${globals.wehagoCommonApiUrl}/cs/gotowehagohelpdesk?toUrl=${toUrl}`;
            ajax.get(url).then((response) => {
                response = JSON.parse(response);

                if (response.resultCode === 200) {
                    if (!Validation.checkEmpty(response.resultData) && typeof (response.resultData) === "string") {
                        window.open(response.resultData);
                    } else {
                        window.open(this.getZendeskUrl());
                    }
                }else{
                    window.open(this.getZendeskUrl());
                }
            })
        }
    }
};
