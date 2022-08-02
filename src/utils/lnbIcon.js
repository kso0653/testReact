import "jquery.cookie";
import React from "react";
import Validation from "./validation";

import LUXServiceIcon from 'luna-rocket/LUXServiceIcon';

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
export default {
    getSaoLang: function (currentLanguage, code) {
        if (currentLanguage === "ja") {
            return SMART_A_JA[code] || code;
        } else if (currentLanguage === "en") {
            return SMART_A_EN[code] || code;
        }
        return code;
    },
    getLnbIcon: function (service_code, background, size, disabled, lnb) {

        let className = [];
        let style = {};
        let svgStyle = {};
        if (Validation.checkEmpty(size)) {
            size = "small";
        }
        if (Validation.checkEmpty(background)) {
            background = true;
        }
        if (Validation.checkEmpty(disabled)) {
            disabled = false;
        }
        if (Validation.checkEmpty(lnb)) {
            lnb = false;
        }

        // luna 컴포넌트와 service_code가 상이한 경우 변경
        service_code = this.getServiceCodeIcon(service_code);


        if(background && disabled) {
            style.background = "#cfcfcf";
        }

        className.push(
            <LUXServiceIcon type={service_code} size={size} background={background} style={style} svgStyle={svgStyle} lnb={lnb}/>
        );
        return className;
    },


    getServiceCodeIcon: function (service_code) {

        if(typeof service_code === "string") {
            service_code = service_code.replace("-sp", "");
        }

        // luna 컴포넌트와 service_code가 상이한 경우 변경
        switch (service_code) {
            case "expense_claim": {
                // 경비청구
                service_code = "expencebill";
                break;
            }
            case "expensemonitoring": {
                // 경비청구 모니터링
                service_code = "oldexpense";
                break;
            }
            case "wecrm": {
                // WE CRM
                service_code = "CRM";
                break;
            }
            case "yetax": {
                // 연말정산
                service_code = "taxadjustment";
                break;
            }
            case "al": {
                // 나의세무사
                service_code = "taxmate";
                break;
            }
            case "smarta": {
                // Smart A 10
                service_code = "sao";
                break;
            }
            case "smartah": {
                // 물류관리
                service_code = "saol";
                break;
            }
            case "smartaw": {
                // 인사 - 급여관리
                service_code = "humanresource";
                break;
            }
            case "taxagent": {
                // 수임처관리
                service_code = "suim";
                break;
            }
            case "kebinuri": {
                // 깨비누리
                service_code = "babynuri";
                break;
            }
            case "kidscok": {
                // 유아교육키즈콕
                service_code = "babycok";
                break;
            }
            case "eobuba": {
                // 어부바
                service_code = "babyabuba";
                break;
            }
            case "gulumma": {
                // 걸음마
                service_code = "babytoddler";
                break;
            }
            case "kidslabedu": {
                // 아이교실 CLOUD
                service_code = "babycloud";
                break;
            }
            case "imarker": {
                // 아이마커
                service_code = "babymarker";
                break;
            }
            case "e-noti": {
                // 심플독 알림장
                service_code = "babynotice";
                break;
            }
            case "inglish": {
                // 인글리쉬 주니어
                service_code = "babyenglish";
                break;
            }
            case "edupre": {
                // 교육계획안
                service_code = "babyplan";
                break;
            }
            case "legal": {
                // Smart 법무서비스
                service_code = "law";
                break;
            }
            case "wallet": {
                // 전용계좌관리
                service_code = "pa";
                break;
            }
            case "eapprovals": {
                // 전자결재
                service_code = "eauth";
                break;
            }
            case "neors": {
                // 내 PC 원격접속
                service_code = "rcs";
                break;
            }
            case "etcsmartaw": {
                // 급여관리
                service_code = "humanresource";
                break;
            }
            case "etcsmarta": {
                // 급여관리
                service_code = "account";
                break;
            }
            case "etcsmartap": {
                // 개인조정
                service_code = "saoin";
                break;
            }
            case "etcsmartac": {
                // 법인조정
                service_code = "saoc";
                break;
            }
            case "timemachine": {
                // 타임머신
                service_code = "tmi";
                break;
            }
            case "wehago_bi": {
                // WEHAGO BI
                service_code = "bi";
                break;
            }
            case "wehagomeet": {
                // 화상회의
                service_code = "wemeet";
                break;
            }
            case "webrtc": {
                // 화상회의
                service_code = "wemeet";
                break;
            }
            case "factoring_sb": {
                // 매출채권팩토링
                service_code = "gt";
                break;
            }
            case "factoring_ft": {
                // 팩토링(팩터)
                service_code = "gt";
                break;
            }
            case "dataportal_1": {
                // 데이터유통포털
                service_code = "dt";
                break;
            }
            case "datafolder": {
                // 데이터유통포털
                service_code = "dat";
                break;
            }
            case "gift": {
                // 선물하기
                service_code = "gft";
                break;
            }
            case "tp": {
                // 강원기업관리(기관용)
                service_code = "TPOG";
                break;
            }
            case "tpedge": {
                // 강원기업관리(기업용)
                service_code = "TPCO";
                break;
            }
            case "insurance": {
                // 보험관리
                service_code = "ins";
                break;
            }
            case "hanwha": {
                // 한화손해보험
                service_code = "hanhwa";
                break;
            }
            case "print": {
                // 복합기
                service_code = "mm";
                break;
            }
            case "managesns": {
                // 소셜채널관리
                service_code = "socialchannel";
                break;
            }
            case "govmanage": {
                // NAYANA 관리자
                service_code = "nyn";
                break;
            }
            case "bookmark": {
                // 즐겨찾기
                service_code = "hgasfa";
                break;
            }

            default: {
                break;
            }
        }

        return service_code;
    },
};
