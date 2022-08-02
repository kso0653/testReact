import "jquery.cookie";
import React from "react";
import $ from "jquery";
import Validation from "./validation";

const SMART_A_JA = {
    "회계관리": "会計管理", // Accounting management
    "급여관리": "給与管理", // Payroll management
    "물류관리": "物流管理",
    "개인조정": "個人調整",
    "법인조정": "法人調整",
    "타임머신": "タイムマシン",
}
const SMART_A_EN = {
    "회계관리": "Accounting management",
    "급여관리": "Payroll management",
    "물류관리": "Logistics management",
    "개인조정": "Personal taxation",
    "법인조정": "Corporate taxation",
    "타임머신": "Time Machine",
}

export const KOSMES = 'kosmes';
export const CHILD_FUND = 'childfund';
export const SSM = 'ssm';
export const IAAS = 'infra';
export const MOIS = 'mois';
export const COSMOS = 'trans-cosmos';
export const NPS = 'nps';

const CHILD_FUND_CNO_DEV = [
    '47650'
];

const CHILD_FUND_CNO_PRODUCTION = [
    '2069992', '321491', '372987'
];

const SSM_CNO_DEV = [
    '50951'
];

const SSM_CNO_MD = [
    '14'
];

export const MOIS_CNO_PRODUCTION = [
    '2181407'
];

export const MOIS_CNO_DEV = [
    '52893'
];

export const COSMOS_CNO_PRODUCTION = [
    '2291883'
];

export const COSMOS_CNO_DEV = [
    '53895'
];

export const LOGIN_STYLE_V2 = [
    CHILD_FUND, SSM , MOIS ,COSMOS, NPS
];

const NODE_ENV_DEV = ['dev', 'local'];
const NODE_ENV_PRODUCTION = ['production'];
const NODE_ENV_MD = ['md'];
const NODE_ENV_V = ['wehagov'];

export const isDev = NODE_ENV_DEV.includes(process.env.BUILD_ENV);
export const isProduction = NODE_ENV_PRODUCTION.includes(process.env.BUILD_ENV);
export const isWehagov = NODE_ENV_V.includes(process.env.BUILD_ENV);

const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");

export default {
    getSaoLang: function (currentLanguage, code) {
        if (currentLanguage === "ja") {
            return SMART_A_JA[code] || code;
        } else if (currentLanguage === "en") {
            return SMART_A_EN[code] || code;
        }
        return code;
    },
    resetBodyClass: function (classes) {
        $("#BODY_CLASS").removeClass("freemain main3 scrolling is_mobile wehagot tedge v2 v3 dfoex rnd rnd2 aio dz_font dfoex_renew wehagol headfix nia covid lulu-ui smp smpMain cfp cfpMain");
        $("#BODY_CLASS").addClass(classes);
    },
    getMainViewType: function (main_view_type, membership_code, promotion_name) {  //[`WC1`, `WP`, `SP`, `DT`, `BS`] 만 사용 가능
        let viewType = 1;

        if (["1"].includes(main_view_type)) {
            viewType = 1;
        } else if (["2"].includes(main_view_type)) {
            viewType = 2;
        } else {
            if (['DT', 'BS'].includes(membership_code)
                || (['SP'].includes(membership_code) && ['BILL36524'].includes(promotion_name))
                || (['SP'].includes(membership_code) && ['FACTORING'].includes(promotion_name))
                || "jong" === this.getConstructed()
            ) {
                viewType = 2;
            } else {
                viewType = 1;
            }
        }

        return viewType;
    },
    getSaoUnfold: function (cno, membership_code, promotion_name) {  //[`WC1`, `WP`, `SP`, `DT`, `BS`] 만 사용 가능
        let isSaoUnfold = "F";
        cno = cno || $("#h_selected_company_no").val();
        membership_code = membership_code || sessionStorage.getItem(cno+"-membership_code") || $("#h_selected_membership_code").val();
        promotion_name = promotion_name || sessionStorage.getItem(cno+"-promotion_name");
        if (['DT', 'BS'].includes(membership_code)
            || (['SP'].includes(membership_code) && ['BILL36524'].includes(promotion_name))
            || (['SP'].includes(membership_code) && ['FACTORING'].includes(promotion_name))) {
            isSaoUnfold = "T";
        }
        return isSaoUnfold;
    },
    getUseMainSwitch: function (membership_code) {  //[`WC1`, `WP`, `SP`, `DT`, `BS`] 만 사용 가능
        let useMainSwitch = false;
        // if ((process.env.BUILD_ENV === 'dev' || process.env.BUILD_ENV === 'local') && [`WC1`, `WP`, `SP`, `DT`, `BS`].includes(membership_code)) {
        if ([`WC1`, `WP`, `SP`, `DT`, `BS`].includes(membership_code)) {
            useMainSwitch = true;
        }
        return useMainSwitch;
    },
    getConstructed: function (env, cno) { // 구축형 회사 정보
        let construncted_name = "";
        if (Validation.checkEmpty(env)) {
            env = process.env.BUILD_ENV;
        }
        if (isNaN(cno)) {
            cno = $('#h_selected_company_no').val();
        }
        const hostname = location.hostname;

        if (env === "local" || env === "dev") {
            if (cno === "43947") { // 한국가스공사
                construncted_name = "kogas";
            }
            else if (cno === "43948") { // 한국지역정보개발원
                construncted_name = "klid";
            }
            else if (cno === "43949") { // 강원도청
                construncted_name = "gangwon";
            }
            else if (cno === "45139") { // wehagov
                construncted_name = "wehagov";
            }
            else if (cno === "37816") { // YSY
                construncted_name = "ysy";
            }
            else if (cno === "36341") { // erp10g
                construncted_name = "erp10g";
            }
            else if (cno === "42250") { // nia
                construncted_name = "nia";
            }
            else if (cno === "49523") { // 조계사
                construncted_name = "jong";
            }
            else if (CHILD_FUND_CNO_DEV.includes(cno)) { // 초록우산
                construncted_name = CHILD_FUND;
            }
            else if (SSM_CNO_DEV.includes(cno)) { // 삼성서울병원
                construncted_name = SSM;
            }
            else if (hostname.indexOf(IAAS) > -1) { // infra
                construncted_name = IAAS;
            }
            else if (hostname.indexOf(MOIS) > -1) { // infra
                construncted_name = MOIS;
            }
            else if (hostname.indexOf(NPS) > -1) { // 국민연금공단
                construncted_name = NPS;
            }
            else if (hostname.indexOf(COSMOS) > -1) { // trans-cosmos
                construncted_name = COSMOS;
            }
        } else if (env === 'wehagov') {
            if (cno === "12616") { // 한국가스공사
                construncted_name = "nia";
            }
            else if (cno === "12622") { // 한국가스공사
                construncted_name = "kogas";
            }
            else if (cno === "12623") { // 한국지역정보개발원
                construncted_name = "klid";
            }
            else if (cno === "12624") { // 강원도청
                construncted_name = "gangwon";
            }
            else if (hostname.indexOf(IAAS) > -1) { // infra
                construncted_name = IAAS;
            }
            else if (hostname.indexOf(MOIS) > -1) { // infra
                construncted_name = MOIS;
            }
            else if (hostname.indexOf(NPS) > -1) { // 국민연금공단
                construncted_name = NPS;
            }
            else { // wehagov 회사 전체 처리
                construncted_name = "wehagov";
            }
        } else if (env === 'production') {
            if (cno === "1455418") { // YSY
                construncted_name = "ysy";
            }
            else if (cno === "1650149") { // erp10g
                construncted_name = "erp10g";
            }
            else if (cno === "1342858") { // 조계사
                construncted_name = "jong";
            }
            else if (CHILD_FUND_CNO_PRODUCTION.includes(cno)) { // 초록우산(임시) 2069992 는 제거 필요
                construncted_name = CHILD_FUND;
            }
            else if (hostname.indexOf(COSMOS) > -1) { // trans-cosmos
                construncted_name = COSMOS;
            }
        } else if (env === 'md') {
            if (SSM_CNO_MD.includes(cno)) { // 삼성서울병원
                construncted_name = SSM;
            }
            else {
                construncted_name = SSM; // 임시처리
            }
        }
        sessionStorage.setItem(cno + "-construncted_name", construncted_name);
        return construncted_name;
    },
    getLandingUrl: function (portalUrl, hostname, currentLanguage) {
        hostname = hostname || location.hostname;
        portalUrl = portalUrl || globals.portalUrl;
        let landing_url = portalUrl+"/landing/"+currentLanguage+"/home/";
        if (hostname.indexOf("gwtp.wehagov.com") > -1) {  // [wehagov] 도메인 대응
            landing_url = portalUrl + "/#/landinggwtp";
        }
        else if (hostname.indexOf("nia.wehagov.com") > -1) {  // [wehagov] 도메인 대응
            landing_url = portalUrl + "/landingnia/ko/home/";
        }
        else if (hostname.indexOf("kogas.wehagov.com") > -1) {  // [wehagov] kogas 도메인 대응
            landing_url = portalUrl + "/landingv/kogas/home/";
        }
        else if (hostname.indexOf("klid.wehagov.com") > -1) {  // [wehagov] klid 도메인 대응
            landing_url = portalUrl + "/landingv/klid/home/";
        }
        else if (hostname.indexOf("gangwon.wehagov.com") > -1) {  // [wehagov] gangwon 도메인 대응
            landing_url = portalUrl + "/landingv/gangwon/home/";
        }
        else if (hostname.indexOf("infra.wehagov.com") > -1) { // [Wehago V Infra] 도메인 대응
            landing_url = portalUrl + "/landingvinfra/";
        }
        else if (hostname.indexOf("mois.wehagov.com") > -1) { // [Wehago V Infra] 도메인 대응
            landing_url = portalUrl + "/landingmois/";
        }
        else if (hostname.indexOf("nps.wehagov.com") > -1) { // [Wehago V NPS] 도메인 대응
            landing_url = portalUrl + "/landingnps/";
        }
        else if (hostname.indexOf(".wehagov.com") > -1) {  // [wehagov] 도메인 대응
            landing_url = portalUrl+"/landingv/home/";
        }
        else if (hostname.indexOf("wehagot.com") > -1) {  // [wehagot] 도메인 대응
            const url = portalUrl.replace("wehago.", "wehagot.");
            if (currentLanguage === "ja") {
                landing_url = url + "/landingt/ja/home/";
            } else {
                landing_url = url + "/landingt/home/";
            }
        }
        else if (hostname.indexOf("wehagol.com") > -1) {  // [wehagol] 도메인 대응
            const url = portalUrl.replace("wehago.", "wehagol.");
            landing_url = url + "/landingl/ko/home";
        }
        else if (hostname.indexOf("datastore.wehago.com") > -1) {  // [datastore] 도메인 대응
            landing_url = portalUrl + "/#/datastore/landing";
        }
        else if (hostname.indexOf("dfoex.com") > -1) {  // [dFoEX] 도메인 대응
            landing_url = portalUrl + "/landingdfoex/ko/home/";
        }
        else if (hostname.indexOf("rnd.wehago.") > -1) { // [R&D 전문 플랫폼] 도메인 대응
            landing_url = portalUrl + "/landingrnd/ko/home/";
        }
        else if (hostname.indexOf("cloud.koita.or.kr") > -1) { // [R&D 전문 플랫폼] 도메인 대응
            landing_url = portalUrl + "/landingrnd/ko/home/";
        }
        else if (hostname.indexOf("bongeunsa.wehago.com") > -1) { // [봉은사] 도메인 대응
            landing_url = portalUrl + "/landingbs/ko/home/";
        }
        else if (hostname.indexOf("nahago.wehago.com") > -1) { // [나하고] 도메인 대응
            landing_url = portalUrl + "/landingnahago/ko/home/";
        }
        else if (hostname.indexOf("nahago.wehagot.com") > -1) { // [나하고] 도메인 대응
            landing_url = portalUrl + "/landingnahago/ko/home/";
        }
        else if (hostname.indexOf("kosmes.wehago.com") > -1) { // [중진공(kosmes)] 도메인 대응
            landing_url = portalUrl + "/landingkosmes/ko/home/";
        }
        else if (hostname.indexOf("safe.wehago.com") > -1) { // [데이터금고지원사업(safe)] 도메인 대응
            landing_url = portalUrl + "/landingsafe/";
        }

        return landing_url;
    },
    getLandingUrlM: function (membership_code, cno, currentLanguage) { // WEHAGO 소개 메인에서 이동
        const portalUrl = globals.portalUrl;
        const constructedName = this.getConstructed(process.env.BUILD_ENV, cno);
        let landing_url = portalUrl+"/landing/"+currentLanguage+"/home/";

        if (constructedName === "nia") { // [NIA]
            landing_url = portalUrl + "/landingnia/ko/home/";
        }
        else if (constructedName === "kogas") { // 한국가스공사
            landing_url = portalUrl + "/landingv/kogas/home/";
        }
        else if (constructedName === "klid") { // 한국지역정보개발원
            landing_url = portalUrl + "/landingv/klid/home/";
        }
        else if (constructedName === "gangwon") { // 강원도
            landing_url = portalUrl + "/landingv/gangwon/home/";
        }
        else if (['WT', 'WT1', 'WE', 'LE'].includes(membership_code)) { // [WEHAGO T, WEHAGO T edge, 장부회사]
            const url = portalUrl.replace("wehago.", "wehagot.");
            if (currentLanguage === "ja") {
                landing_url = url + "/landingt/ja/home/";
            } else {
                landing_url = url + "/landingt/home/";
            }
        }
        else if (['RND'].includes(membership_code) || location.hostname.indexOf("rnd.wehago.") > -1 || location.hostname.indexOf("cloud.koita.or.kr") > -1) {
            // [R&D 전문 플랫폼]
            landing_url = portalUrl + "/landingrnd/ko/home/";
        }
        else if (['BS'].includes(membership_code)) { // [봉은사]
            landing_url = portalUrl + "/landingbs/ko/home/";
        }
        else if (['WL', 'LG'].includes(membership_code)) { // [WEHAGO L, WEHAGO L Edge]
            const url = portalUrl.replace("wehago.", "wehagol.");
            landing_url = url + "/landingl/ko/home/";
        }
        else if (['DP'].includes(membership_code) || location.hostname.indexOf("dataportal.wehago.") > -1 || location.hostname.indexOf("bigdata-sme.") > -1) { // [데이터유통포털]
            landing_url = portalUrl + "/#/datastore/landing";
        }
        else if (location.hostname.indexOf("gwtp.wehagov.com") > -1) {  // [GWTP] 도메인 대응
            landing_url = portalUrl + "/#/landinggwtp";
        }
        else if (location.hostname.indexOf("safe.wehago.com") > -1) { // [데이터금고지원사업(safe)] 도메인 대응
            landing_url = portalUrl + "/landingsafe";
        }
        else if (process.env.BUILD_ENV === 'wehagov') {
            // [WEHAGOV]
            landing_url = portalUrl+"/landingv/home/";
        }
        return landing_url;
    },
    getServiceUrl: function (service_url, hostname) {
        hostname = hostname || location.hostname;
        service_url = service_url || "";
        if (hostname.indexOf("wehagot.") > -1) {  // [WEHAGO T] 도메인 대응
            service_url = service_url.replace("wehago.", "wehagot.");
        } else if (hostname.indexOf("dfoex.") > -1) {  // [dFoEx] 도메인 대응
            service_url = service_url.replace("wehago.", "dfoex.");
        } else if (hostname.indexOf("rnd.wehago.") > -1) {  // [R&D 전문 플랫폼] 도메인 대응
            service_url = service_url.replace("www.wehago.", "rnd.wehago.").replace("dev.wehago.", "dev.rnd.wehago.").replace("cloud.koita.or.kr", "rnd.wehago.com");
        } else if (hostname.indexOf("cloud.koita.or.kr") > -1) {  // [R&D 전문 플랫폼] 도메인 대응
            service_url = service_url.replace("www.wehago.com", "cloud.koita.or.kr");
            // } else if (location.hostname.search(/(nia|kogas|klid|gangwon|infra|mois)\.(wehagov)/) > -1) {  // [WEHAGOV] 구축형 회사 도메인 대응
        } else if (location.hostname.search(/(dev|local).(nia|klid|infra|mois|nps)\.(wehago[\w])/) > -1) {  // 개발, 로컬 [WEHAGOV] 구축형 회사 도메인 대응
            const customSubDomain = hostname.replace(/(dev|local)\.([^\/\.]+)\.wehago[\w]*..+/gi, "$2");
            service_url = service_url.replace("dev", `dev.${customSubDomain}`);
        } else if (location.hostname.search(/(nia|klid|infra|mois|nps)\.(wehagov)/) > -1) {  // [WEHAGOV] 구축형 회사 도메인 대응
            const customSubDomain = hostname.replace(/([^\/\.]+)\.wehagov\..+/gi, "$1");
            service_url = service_url.replace("www", customSubDomain)
            if(process.env.BUILD_ENV === "local" || process.env.BUILD_ENV === "dev"){
                service_url =  service_url.replace("dev", `dev.${customSubDomain}`);
            }
        } else if (hostname.indexOf("kogas.wehagov.") > -1) {  // [WEHAGOV] 한국가스공사 도메인 대응
            service_url = service_url.replace("www.wehagov.com", "kogas.wehagov.com");
        } else if (hostname.indexOf("gangwon.wehagov.") > -1) {  // [WEHAGOV] 강원도 도메인 대응
            service_url = service_url.replace("www.wehagov.com", "gangwon.wehagov.com");
        } else if (hostname.indexOf("bongeunsa.wehago.") > -1) {  // [봉은사] 도메인 대응: 서비스 url 이동
            service_url = service_url.replace("www.wehago.", "bongeunsa.wehago.");
        } else if (hostname.indexOf("nahago.wehago.") > -1) {  // [나하고] 도메인 대응: 서비스 url 이동
            service_url = service_url.replace("www.wehago.", "nahago.wehago.").replace("dev.wehago.", "dev.nahago.wehago.");
        } else if (hostname.indexOf("nahago.wehagot.") > -1) {  // [나하고] 도메인 대응: 서비스 url 이동
            service_url = service_url.replace("www.wehago.", "nahago.wehagot.");
        } else if (hostname.indexOf("wehagol.") > -1) {  // [WEHAGO L] 도메인 대응
            service_url = service_url.replace("wehago.", "wehagol.");
        } else if (hostname.indexOf("childfund") > -1){
            service_url = service_url.replace("dev.wehago.", "dev.childfund.wehago.").replace("www.wehago.com", "data.childfund.or.kr");
        } else if (hostname.indexOf("kosmes") > -1){
            service_url = service_url.replace("dev.wehago.", "dev.kosmes.wehago.").replace("www.wehago.com", "kosmes.wehago.com");
        } else if (hostname.indexOf("safe.wehago.") > -1) {  // [데이터금고지원사업(safe)] 도메인 대응
            service_url = service_url.replace("dev.wehago.", "dev.safe.wehago.").replace("www.wehago.", "safe.wehago.");
        } else if (hostname.indexOf("trans-cosmos.wehago.") > -1) {  // [트랜스코스모스코리아(trans-cosmos)] 도메인 대응
            service_url = service_url.replace("dev.wehago.", "dev.trans-cosmos.wehago.").replace("www.wehago.", "trans-cosmos.wehago.");
        } else if (hostname.indexOf("wehagom.") > -1) {  // [WEHAGO M] 도메인 대응
            service_url = service_url.replace("wehago.", "wehagom.");
        } else if (hostname.indexOf("docc.") > -1) {  // [삼성병원] 도메인 대응
            const customDomain = hostname.replace(/.*docc.([^\.]+).com/gi, "$1");
            if (process.env.BUILD_ENV === "md") {
                service_url = service_url.replace("www.", "docc.").replace(/wehago[\w]*./, `${customDomain}.`);
            } else {
                service_url = service_url.replace(/wehago[\w]*./, `${customDomain}.`);
            }
        } else if (hostname.search(/(nps)\.(wehagov)/) > -1 || hostname.search(/(dev|local).(nps)\.(wehago)/) > -1) {
	        if(service_url.search(/([^\/\.]+).(wehago|wehagov)/) > -1){
	            try{
                    const serviceUrl = new URL(service_url);
	                service_url = service_url.replace(serviceUrl.hostname, hostname);
                }catch (e) {
                    console.error('service_url',service_url);
	                console.error(e);
                }
            }
        }
	    let isMois = false;

        const isDev = NODE_ENV_DEV.includes(process.env.BUILD_ENV);
        const isProduction = NODE_ENV_PRODUCTION.includes(process.env.BUILD_ENV);
        const isMd = NODE_ENV_MD.includes(process.env.BUILD_ENV);
        const isWehagov = NODE_ENV_V.includes(process.env.BUILD_ENV);

        const cno = $.cookie('h_selected_company_no') || $('#h_selected_company_no').val();

        if(cno && (isDev && hostname.includes(MOIS))
            || (MOIS_CNO_DEV.includes(cno) && isDev)
            || (hostname.includes(MOIS) && isWehagov)
            || (MOIS_CNO_PRODUCTION.includes(cno) && isProduction)){
            isMois = true;
        }

        if(isMois){
            if (hostname.indexOf("dev.wehago.com") > -1) {
                service_url = service_url.replace("dev.wehago.", "dev.mois.wehago.");
            }else if(hostname.indexOf("www.wehago.com") > -1){
                service_url = service_url.replace("www.wehago.", "mois.wehagov.");
            }else if(hostname.indexOf("mois.wehagov.com") > -1){
                service_url = service_url.replace("www.wehagov.", "mois.wehagov.");
            }
        }

        // 강원 TP 일경우
        if (hostname.indexOf("gwtp.wehago") > -1) {
            service_url = service_url.replace("www.wehago", "gwtp.wehago");
        }
        return service_url;
    },
    hideCloudstorage: function (env, cno, constructedName) {
        cno = Number(cno);
        return ((process.env.BUILD_ENV === 'dev' || process.env.BUILD_ENV === 'local') && cno === 14800) ? true
            : (process.env.BUILD_ENV === 'production' && [5582, 734345].includes(cno)) ? true
                : (process.env.BUILD_ENV === 'wehagov') ? true : false;
    },
    isServiceCustomCompany : function (service) {
        let isResult = false;
        const host = location.hostname;

        const cno = $.cookie('h_selected_company_no') || $('#h_selected_company_no').val();

        const isDev = NODE_ENV_DEV.includes(process.env.BUILD_ENV);
        const isProduction = NODE_ENV_PRODUCTION.includes(process.env.BUILD_ENV);
        const isMd = NODE_ENV_MD.includes(process.env.BUILD_ENV);
        const isWehagov = NODE_ENV_V.includes(process.env.BUILD_ENV);

        try {
            switch (service) {
                case KOSMES :
                    if(host.includes(KOSMES)){
                        isResult = true;
                    }
                    break;
                case CHILD_FUND :
                    if(cno && ((isDev && CHILD_FUND_CNO_DEV.includes(cno)) || (isProduction && CHILD_FUND_CNO_PRODUCTION.includes(cno)))){
                        isResult = true;
                    }
                    break;
                case SSM :
                    if(cno && (isDev && SSM_CNO_DEV.includes(cno) || isMd)){
                        isResult = true;
                    }
                    break;
                case IAAS :
                    if(cno && (isDev && host.includes(IAAS)) || (host.includes(IAAS) && isWehagov)){
                        isResult = true;
                    }
                    break;
                case MOIS :
                    if(cno && (isDev && host.includes(MOIS))
                        || (MOIS_CNO_DEV.includes(cno) && isDev)
                        || (host.includes(MOIS) && isWehagov)
                        || (MOIS_CNO_PRODUCTION.includes(cno) && isProduction)){
                        isResult = true;
                    }
                    break;
                case COSMOS :
                    if((!cno && host.includes(COSMOS))
                        || (COSMOS_CNO_DEV.includes(cno) && isDev)
                        || (COSMOS_CNO_PRODUCTION.includes(cno) && isProduction)){
                        isResult = true;
                    }
                    break;
                case NPS :
                    if(host.includes(NPS)){
                        isResult = true;
                    }
                    break;
                default :
                    break;
            }
        }catch (e) {
            console.error(e);
        }

        return isResult;
    },
    goServiceCustomMain : function (companyNo) {
        const cno = $('#h_selected_company_no').val() || companyNo + '';

        const membershipSubCode = sessionStorage.getItem(cno+"-membership_sub_code") || null;
        const origin = location.origin;

        const isDev = NODE_ENV_DEV.includes(process.env.BUILD_ENV);
        const isProduction = NODE_ENV_PRODUCTION.includes(process.env.BUILD_ENV);

        let portalOrginUrl = globals.portalOriginUrl;

        let isLocal = false;
        if(isDev && origin.includes('local.')){
            isLocal  = true;
        }

        try{
            /*if(membershipSubCode === 'KOSME') {
	            /!*중진공*!/
	            if (!isLocal) {
		            location.href = location.href.replace(origin, globals.kosmeUrl);
	            } else {
		            location.href = location.href.replace(origin, 'http://local.kosmes.wehago.com:3000');
	            }
            }else */if((isDev && CHILD_FUND_CNO_DEV.includes(cno)) || (isProduction && CHILD_FUND_CNO_PRODUCTION.includes(cno))){
                /*초록우산*/
                if (!isLocal) {
                    location.href = location.href.replace(origin, globals.childfundUrl);
                } else {
                    location.href = location.href.replace(origin, 'http://local.childfund.wehago.com:3000');
                }
            }else if((MOIS_CNO_DEV.includes(cno) && isDev) || (MOIS_CNO_PRODUCTION.includes(cno) && isProduction)){
                if(isProduction){
                    window.parent.location.href = location.href.replace(origin, 'https://mois.wehagov.com');
                }else{
                    window.parent.location.href = location.href.replace(origin, 'http://dev.mois.wehago.com');
                }
            }else{
                if(!isLocal){
                    location.href = location.href.replace(origin, globals.portalUrl);
                }else{
                    location.href = location.href.replace(origin, 'http://local.wehago.com:3000');
                }
            }
        }catch (e) {
            console.error(e);
        }
    },
    getServiceImageUrl : function (image_url) {
        let serviceImageUrl = `${globals.staticUrl}/imgs/main/ico_basic_64.png`;
        if (!Validation.checkEmpty(image_url)) {
            if (image_url.indexOf('/uploads/') > -1) {
                serviceImageUrl = `${globals.portalUrl}${image_url}`;
            } else {
                serviceImageUrl = `${globals.staticUrl}${image_url}`;
            }
        }
        return serviceImageUrl;
    },
    getServiceName : function (serviceName, serviceCode, constructedName) {
        if (!constructedName) {
            constructedName = this.getConstructed();
        }

        if ([MOIS, NPS].includes(constructedName)) {
            if (serviceCode === "companyboard") {
                return "공유게시판";
            } else if (serviceCode === "accounts") {
                return "기업정보";
            }
        }

        return serviceName;
    },
    getLoginCustomInfo : function () {
        let customType = {
            name: ""
            , title: "WEHAGO"
            , subtitle: "Intelligence Platform"
            , imageUrl: "cfp/bg_login.png"
        };
        if (location.hostname.search(/(local|dev|data)\.childfund/) > -1) {
            customType.name = CHILD_FUND;
            customType.title = "지능형 아동복지 빅데이터 플랫폼";
            customType.subtitle = "Childfund Intelligent \nBig Data Platform";
            customType.imageUrl = "cfp/bg_login_03.png";
            customType.copyRightText = 'Copyright © ChildFund Korea. All rights reserved.';
        }
        else if (location.hostname.search(/(local|dev|docc)\.(samsunghospital)/) > -1) {
            customType.name = SSM
            customType.title = "삼성서울병원";
            customType.subtitle = "Medical Intelligence Platform";
            customType.imageUrl = "smp/login_bg.png";
        }
        else if (location.hostname.search(/(wehagom)/) > -1) { // 임시처리
            customType.name = SSM
            customType.title = "삼성서울병원";
            customType.subtitle = "Medical Intelligence Platform";
            customType.imageUrl = "smp/login_bg.png";
        }
        else if (location.hostname.search(/(mois.wehagov)/) > -1) { // 임시처리
            customType.name = MOIS
            customType.title = "WEHAGO V 행정안전부";
            customType.subtitle = "Ministry of the Interior and Safety";
            customType.imageUrl = "lulu/mois_login_bg.png";
        }
        else if (location.hostname.search(/(trans-cosmos.wehago.)/) > -1) { // 임시처리
	        customType.name = COSMOS
	        customType.title = "WEHAGO transcosmos Korea";
	        customType.subtitle = "Global Digital Transformation Partner";
	        customType.imageUrl = "lulu/tcm_login_bg.png";
        }
        else if (location.hostname.search(/(local|dev)\.(nps.wehago.)/) > -1 || location.hostname.search(/(nps.wehagov.)/) > -1) {
            customType.name = NPS
            customType.title = "WEHAGO V 국민연금공단";
            customType.subtitle = "National Pension Service";
            customType.imageUrl = "lulu/nps_login_bg.png";
        }
        return customType;
    },
    isMoisSnsService : function () {
        const isDev = NODE_ENV_DEV.includes(process.env.BUILD_ENV);
        const isProduction = NODE_ENV_PRODUCTION.includes(process.env.BUILD_ENV);

        const cno = $.cookie('h_selected_company_no') || $('#h_selected_company_no').val();

        if((MOIS_CNO_DEV.includes(cno) && isDev) || (MOIS_CNO_PRODUCTION.includes(cno) && isProduction)){
            return true;
        }

        return false;
    }
};
