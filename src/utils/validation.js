/**
 * format validation
 * @author by mpark
 */
import $ from "jquery";
import {Map, List} from "immutable";
export default {
    checkEmpty: function(data) {
        if (data === null) {
            return true;
        }
        if (data === undefined) {
            return true;
        }
        if (typeof data === 'string' && data.trim() === '') {
            return true;
        }
        if (typeof data === "object" && !Object.keys(data).length) {
            return true;
        }
        return false
    },
    checkBlank: function(str) {
        if (str === null) {
            return true;
        }
        if (str === undefined) {
            return true;
        }
        if (typeof str === 'string' && str.trim() === '') {
            return true;
        }
        let blank_pattern = /[\s]/g;
        if (blank_pattern.test(str) === true) {
            return true;
        }
        return false;
    },
    isEmpty : function(data) {
        if (data === null) return true;
        if (typeof data === 'undefined') return true;
        if (typeof data === 'string' && data === '') return true;
        if (Array.isArray(data) && data.length < 1) return true;
        if (typeof data === 'object' && data.constructor.name === 'Object' && Object.keys(data).length < 1 && Object.getOwnPropertyNames(data) < 1) return true;
        if (typeof data === 'object' && data.constructor.name === 'String' && Object.keys(data).length < 1) return true;
        return false;
    },
    isNumeric: function(num) {
        for (let i = 0; i < num.length; i++) {
            let temp = num.substr(i, 1);
            if (temp < "0" || temp > "9") {
                return false;
            }
        }
        return true;
    },
    checkNotStringPattern: function(str) {
        // let pattern = /[~!@#$%^&*()_+|<>?:{}]/;
        // let pattern = /[~!@#$%^&*()_+|<>?:{}]/;	// 특수문자
        let pattern = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+<>@\#$%&\\\=\(\'\"]/gi
        return pattern.test( str );
    },

    checkNotAllowStorageStringPattern: function(str) {
        // 특수문자 제한 정규식 메소드
        // 스토리지에서 제한 문자열 '\', '/', ':', '*', '?', '"', '<', '>', '|', '@'
        let pattern = /[\?\\\/\:\*\"\<\>\|\@]/;
        return pattern.test( str );
    },
    checkNotAllowWeDriveStringPattern: function(str) {
        // 특수문자 제한 정규식 메소드
        // // 웹스토리지에서 제한 문자열 '\', '/', ':', '*', '?', '"', '<', '>', '|', '@', '#', '%', '&', '+'
        // let pattern = /[\?\\\/\:\*\"\<\>\|\@\#\%\&\+]/;
        // 웹스토리지에서 제한 문자열 '\', '/', ':', '*', '?', '"', '<', '>', '|', '@'
        let pattern = /[\?\\\/\:\*\"\<\>\|\@]/;
        return pattern.test( str );
    },
    checkContact: function(num) {
        //전화번호체크
        let regExp = /^\d{2,3}-\d{3,4}-\d{4}$/;
        return regExp.test( num);
    },
    checkEmail: function(str){
        // 이메일주소 체크
        let regExp = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/;
        if (str.length === 0) {
            return false;
        }else{
            return regExp.test(str);
        }
    },
    checkWehagoEmail: function(str){
        str = str.trim();
        if (str.length === 0) {
            return false;
        }
        let splitEmail = str.split("@");
        return (splitEmail.length === 2 && splitEmail[1] === "wehago.com");
    },
    checkDouzoneEmail: function (str) {
        str = str.trim();
        if (str.length === 0) {
            return false;
        }
        let splitEmail = str.split("@");
        return (splitEmail.length === 2 && (splitEmail[1] === "duzon.com" || splitEmail[1] === "douzone.com"));
    },
    //전화번호 유효성체크
    isTel: function(value) {
        return /^0(2|3[1-3]|4[1-4]|5[1-5]|6[1-4])\d{3,4}\d{4}$/g.test(value) || /^(?:(010\d{4})|(01[1|6|7|8|9]-?\d{3,4}))\d{4}$/.test(value) || /^(?:(070\d{4})|(01[1|6|7|8|9]-?\d{3,4}))\d{4}$/.test(value);
    },

    //password 유효성 체크
    checkPwdValid: function(password, personalInfo={mobileNum: '', birthDate: ''}) {

        /** isValid 값 종류
         *  1. success
         *  2. warning
         *  3. error
        * */
        let isValid = '';
        let tooltipTitle = '';
        let tooltipContent = '';

        const regex = {
            success: /^[a-zA-Z0-9!"#$%&'()*-./:;<=>?@\[\\\]^_`{|}~]*$/,
            repeat: /(\w)\1\1/,
            continuity: /(qwe)|(wer)|(ert)|(rty)|(tyu)|(yui)|(uio)|(iop)|(asd)|(sdf)|(dfg)|(fgh)|(ghj)|(hjk)|(jkl)|(zxc)|(xcv)|(cvb)|(vbn)|(bnm)|(123)|(234)|(345)|(456)|(567)|(678)|(789)|(890)/,
            reverse: /(poi)|(oiu)|(iuy)|(uyt)|(ytr)|(tre)|(rew)|(ewq)|(lkj)|(kjh)|(jhg)|(hgf)|(gfd)|(fds)|(dsa)|(mnb)|(nbv)|(bvc)|(vcx)|(cxz)|(098)|(987)|(876)|(765)|(654)|(543)|(432)|(321)/,
            safe: /^[a-zA-Z0-9!"#$%&'()*-./:;<=>?@\[\\\]^_`{|}~]*$/,
        };

        const titles = {
            success: "비밀번호 보안등급 : 안전",
            error: "비밀번호 보안등급 : 사용불가",
            warning: "비밀번호 보안등급 : 안전하지 않음",
            // error: this.props.intl.formatMessage({id: 'ua.passwordSecurityLevel'}) + ": " + this.props.intl.formatMessage({id: 'ua.notAvailable'}),
            // success: this.props.intl.formatMessage({id: 'ua.passwordSecurityLevel'}) + ": " + this.props.intl.formatMessage({id: 'ua.safe'}),
            // warning: this.props.intl.formatMessage({id: 'ua.passwordSecurityLevel'}) + ": " + this.props.intl.formatMessage({id: 'ua.notSafe'}),
        };

        let passwordMinLength = (process.env.BUILD_ENV === 'wehagov') ? 9 : 8;
        const id = $.cookie("h_portal_id");
        /*TODO: 유효성 검사 추가로 해야하는 부분
                1. ID와 동일 여부 체크,
                2. 개인정보(휴대전화번호, 생일) 포함 여부
                3. 가장 최근에 사용했던 비밀 번호 여부
                4. 이전에 사용했던 비밀번호 여부
        */

        if (password.search(regex['success']) != 0) {
            isValid = 'error';
            tooltipTitle = titles['error'];
            tooltipContent = "사용할 수 없는 문자열을 입력하셨습니다.";
        } else if (password.search(regex['repeat']) !== -1 || password.search(regex['continuity']) !== -1 || password.search(regex['reverse']) !== -1) {
            isValid = 'error';
            tooltipTitle = titles['error'];
            tooltipContent = "동일한 문자가 3회이상 반복 또는 키보드 상에서 연속한 위치에 존재하는 비밀번호를 사용할 수 없습니다.";
        } else if (password.length < passwordMinLength || password.length > 16) {
            isValid = 'error';
            tooltipTitle = titles['error'];
            tooltipContent = (process.env.BUILD_ENV === 'wehagov') ? "9자 이상 16자 이하의 비밀번호만 사용할 수 있습니다." : "8자 이상 16자 이하의 비밀번호만 사용할 수 있습니다.";
        } else if(password === id) {
            isValid = 'error';
            tooltipTitle = titles['error'];
            tooltipContent = "사용자의 ID를 그대로 사용할 수 없습니다.";
        } else if(password === personalInfo.mobileNum || password === personalInfo.birthDate) {
            isValid = 'error';
            tooltipTitle = titles['error'];
            tooltipContent = "개인정보(휴대전화번호, 생일)를 포함할 수 없습니다.";
        }else if (password.search(regex['success']) == 0) {

            isValid = 'error';

            let {isSafe, patternCount} = this.isSafe(password);

            if (isSafe) {
                isValid = 'success';
                tooltipTitle = titles['success'];
                tooltipContent = "안전하게 사용할 수 있는 비밀번호입니다.";
            } else {

                if (process.env.BUILD_ENV === 'wehagov' && patternCount > 1) {
                    isValid = false;
                    tooltipTitle = titles['error'];
                    tooltipContent = "공공기관용 클라우드 서비스 보안기준에 따라 9~16자의 영문 대소문자, 숫자, 특수문자 중 3가지 이상 조합하여 입력해주세요.";
                } else if (patternCount > 1) {
                    isValid = 'warning';
                    tooltipTitle = titles['warning'];
                    tooltipContent = "안전도가 높은 비밀번호 사용을 권장합니다.";
                } else {
                    isValid = false;
                    tooltipTitle = titles['error'];
                    tooltipContent = "사용할 수 없는 비밀번호 유형입니다.";
                }
            }
        } else {
            isValid = false;
            tooltipTitle = titles['error'];
            tooltipContent = "사용할 수 없는 문자열을 입력하셨습니다.";
        }

        const result = {
            isValid,
            tooltipTitle,
            tooltipContent,
        };

        return result;
    },
    //Q.
    isSafe : (password) => {
        let pattern = {
            capital: /[A-Z]/,
            small: /[a-z]/,
            number: /[0-9]/,
            special: /[!"#$%'()*,-./:<=>?@\[\\\]^_`{|}~]/,
        };
        let trueCount = 0;

        if (password.search(pattern['capital']) !== -1) trueCount++;
        if (password.search(pattern['small']) !== -1) trueCount++;
        if (password.search(pattern['number']) !== -1) trueCount++;
        if (password.search(pattern['special']) !== -1) trueCount++;

        let passwordMinLength = 8;
        let minTrueCount = 2;
        if (process.env.BUILD_ENV === 'wehagov') {
            passwordMinLength = 9;
            minTrueCount = 3;
        }

        return {
            isSafe: (trueCount >= 3 && password.length >= passwordMinLength) || (trueCount >= minTrueCount && password.length >= 10),
            //문자조합
            patternCount: trueCount
        };
    },

    checkNewPwdSame: function(newPwd, newPwdCheckValue) {
        let isValidate = '';
        let infoText = '';

        if(!this.checkEmpty(newPwd) && !this.checkEmpty(newPwdCheckValue)){
            if((newPwd === newPwdCheckValue)){
                isValidate = true;
                infoText = "비밀번호가 일치합니다.";
            }else{
                isValidate = false;
                infoText = "새 비밀번호와 비밀번호 확인이 일치하지 않습니다.";
            }
        }
        const result = {
            isValidate,
            infoText
        };
        return result;
    },

    /**
     * 검사 대상이 아래와 같은 빈 값인지 검사
     * ex) undefined, null, "", " ", [undefined], and so on.
     * @author 김수지
     * @param Object data: 검사 대상
     * @param Boolean isStringCheck: type이 string인 'null', 'undefined' 등도 empty로 간주할 것인지에 대한 옵션
     * @returns Boolean
     */
    isEmptyData: function (data, isStringCheck = false) {
        let result = false;

        if(isStringCheck) {
            if(typeof data === 'string' && ['undefined', 'null', 'NULL', ''].includes(data)) return true;
        }

        // data type: undefined OR null
        if(data === undefined) return true;
        if(data === null) return true;

        // data type: string
        if(typeof data === 'string' && (data === '' || data.length < 1 || data.trim().length < 1)) return true;

        // data type: array
        if(Array.isArray(data)) {
            if(data.length < 1) return true;
            if(data.length === 1 && data[0] === undefined) return true;
            if(data.length === 1 && data[0] === null) return true;
        }

        // data type: Map(immutable)
        if(Map.isMap(data) && data.size < 1) return true;
        // data type: List(immutable)
        if(List.isList(data) && data.size < 1) return true;
        // data type: object
        if(typeof data === 'object' && Object.keys(data).length < 1) return true;

        return result;
    }
};
