/**
 * Lang Util
 * @author by d7kelz
 */
import $ from "jquery";
import "jquery.cookie";
import Validation from "./validation";
import {DOMAIN_REG_EXP} from "../components/Header/Enums/Enums";

const WEHAGO_LANGUAGE = ['ko', 'en', 'ja'];
const WEHAGO_WRONG_DOMAIN = "www.wehago.com";
const WEHAGOT_WRONG_DOMAIN = "www.wehagot.com";

export default {
    getLanguageUse : function(membership_code) { // membership_code 옵션
        var isUseLanguage = true;
        if (process.env.BUILD_ENV === 'wehagov') {
            isUseLanguage = false;
        }
        else if (membership_code === "C19") { // 코로나 프로모션 사용자 다국어 설정 제외
            isUseLanguage = false;
        }
        return isUseLanguage;
    },
    getLanguage : function(isInit) {
        let currentLanguage = 'ko';
        const cno = $("#h_selected_company_no").val();
        const membership_code = sessionStorage.getItem(cno + "-membership_code");
        if (this.getLanguageUse(membership_code) === false) {
            currentLanguage = 'ko';
        } else if (isInit) {
            let cookieLanguage = $.cookie("locale");
            if (!Validation.checkEmpty(cookieLanguage)) {
                if (!WEHAGO_LANGUAGE.includes(cookieLanguage)) {
                    cookieLanguage = 'ko';
                }
                currentLanguage = cookieLanguage;
            } else {
                let browserLanguage = '';
                if (navigator.language || navigator.userLanguage) {
                    if (!Validation.checkEmpty(navigator.language)) {
                        let lang = navigator.language.split('-')[0];
                        if (WEHAGO_LANGUAGE.includes(lang)) {
                            browserLanguage = lang;
                        } else {
                            browserLanguage = 'ko';
                        }
                    } else { // ie10
                        let lang = navigator.userLanguage.split('-')[0];
                        if (WEHAGO_LANGUAGE.includes(lang)) {
                            browserLanguage = lang;
                        } else {
                            browserLanguage = 'ko';
                        }
                    }
                } else {
                    browserLanguage = 'ko';
                }
                currentLanguage = browserLanguage;
            }
            let regExp = DOMAIN_REG_EXP;
            let DOMAIN_NAME = document.domain.substring(document.domain.search(regExp));
            $.cookie("locale", currentLanguage, {expires:365, path:"/", domain:DOMAIN_NAME});
            $("body").removeClass("ko").removeClass("en").removeClass("ja").addClass(currentLanguage);
        } else {
            currentLanguage = !Validation.checkEmpty($.cookie("locale")) ? $.cookie("locale") : 'ko';
        }
        // console.info("### getLanguage - lang ::: ", currentLanguage, " / isInit ::: ", isInit);
        return currentLanguage;
    },
    setLanguage : function(lang, isRefresh) {
        // console.info("### setLanguage - lang ::: ", lang , " / $.cookie(\"locale\") ::: ", $.cookie("locale"), " / isRefresh ::: ", isRefresh);
        if (!WEHAGO_LANGUAGE.includes(lang)) {
            lang = 'ko';
            isRefresh = true;
        }
        if (lang !== $.cookie("locale")) {
            let regExp = DOMAIN_REG_EXP;
            let DOMAIN_NAME = document.domain.substring(document.domain.search(regExp));
            if (DOMAIN_NAME === WEHAGO_WRONG_DOMAIN || DOMAIN_NAME === ("." + WEHAGO_WRONG_DOMAIN)){
                DOMAIN_NAME = ".wehago.com";
            } else if (DOMAIN_NAME === WEHAGOT_WRONG_DOMAIN || DOMAIN_NAME === ("." + WEHAGOT_WRONG_DOMAIN)) {
                DOMAIN_NAME = ".wehagot.com";
            }
            $.removeCookie("locale", {path: "/"});
            $.removeCookie("locale", {path: "/", domain: ("." + WEHAGO_WRONG_DOMAIN)});
            $.removeCookie("locale", {path: "/", domain: ("." + WEHAGOT_WRONG_DOMAIN)});
            $.cookie("locale", lang, {expires:365, path:"/", domain:DOMAIN_NAME});

            if (isRefresh) {
                window.location.reload();
            } else {
                $("body").removeClass("en").removeClass("ko").removeClass("ja").addClass(lang);
            }
        }
    },
};
