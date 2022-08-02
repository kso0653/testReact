/**
 * format utils
 * @author by ssh
 */


export default {
    date: function(date, fmt) {
        var format = "yyyy-MM-dd";
        if ( fmt != null ) format = fmt;

        var nDate = date.replace(/\/|\-/g, "");
        var nFormat = format.replace(/\/|\-/g, "");

        if (nDate.length != nFormat.length) return "";

        var yS = nFormat.indexOf("y");
        var mS = nFormat.indexOf("M");
        var dS = nFormat.indexOf("d");

        var year = nDate.substr(yS, 4);
        var month = nDate.substr(mS, 2);
        var day = nDate.substr(dS, 2);

        // 날짜가 넘어갈경우 마지막 날짜처리
        if (month > 12) month = 12;
        if (month == "01" || month == "03" || month == "05" || month == "07" || month == "08" || month == "10" || month == "12" )
        {
            if (day > 31) day = 31;
        } else {
            if (day > 30) day = 30;
        }

        format = format.replace("yyyy", year);
        format = format.replace("MM", month);
        format = format.replace("dd", day);

        return format;
    },
    //금액 change
    decimal: function(number, decimals, dec_point, thousands_sep) {
        if (typeof number == 'number') {
            number = number.toString();
        }
        if (null == number || "" == number) return "";
        number = number.replace(/,/g,"");

        if (0 < number.indexOf(".")) {
            if (3 >= number.substr(0, number.indexOf(".")).length) return number.substr(0, number.indexOf(".")+1) + this.rPad(number.substr(number.indexOf(".")+1), "0", decimals, true);
        } else {
            if (3 >= number.length){
                if (decimals == 0){
                    return this.rPad(number, "0", decimals);
                } else {
                }
            }
        }

        dec_point = ".";
        thousands_sep = ",";
        var n = number, prec = decimals, dec = dec_point, sep = thousands_sep;
        n = !isFinite(+n) ? 0 : +n;
        prec = !isFinite(+prec) ? 0 : Math.abs(prec);
        sep = sep == undefined ? ',' : sep;

        var s = n.toFixed(prec),
            abs = Math.abs(n).toFixed(prec),
            _, i;

        if (abs >= 1000) {
            _ = abs.split(/\D/);
            i = _[0].length % 3 || 3;

            _[0] = s.slice(0,i + (n < 0)) +
                _[0].slice(i).replace(/(\d{3})/g, sep+'$1');

            s = _.join(dec || '.');
        } else {
            s = abs.replace('.', dec_point);
        }
        return s;
    },
    //숫자형 change
    number: function(number) {
        return this.decimal(number);
    },

    //사업자등록번호
    companyRegNo: function (companyRegNo) {
        let convertValue = "";
        if (companyRegNo != null && companyRegNo.length === 10) {
            let frontValue = companyRegNo.substring(0, 3);
            let middleValue = companyRegNo.substring(3, 5);
            let backValue = companyRegNo.substring(5, 10);
            convertValue = frontValue + '-' + middleValue + '-' + backValue;
        } else {
            convertValue = companyRegNo;
        }
        return convertValue;
    },
    //법인등록번호
    businessRegNo: function (businessRegNo) {
        let convertValue = "";
        if (businessRegNo != null && businessRegNo.length === 13) {
            let frontValue = businessRegNo.substring(0, 6);
            let middleValue = businessRegNo.substring(6, 13);
            convertValue = frontValue + '-' + middleValue;
        } else {
            convertValue = businessRegNo;
        }
        return convertValue;
    },

    //주민등록번호
    regNumber: function (regNumber) {
        let convertValue = "";
        if (regNumber != null && regNumber.length === 13) {
            let frontValue = regNumber.substring(0, 6);
            let middleValue = regNumber.substring(6, 13);
            convertValue = frontValue + '-' + middleValue;
        } else {
            convertValue = regNumber;
        }
        return convertValue;
    },

    //주민등록번호 마스킹 처리
    regNumberWithMasking: function (regNumber = "") {
        regNumber = regNumber.replace(/-gi/, "");
        let convertValue = "";
        if (regNumber != null && regNumber.length > 7) {
            let frontValue = regNumber.substring(0, 6);
            let middleValue = regNumber.substring(6, 7);
            convertValue = frontValue + '-' + middleValue + '******';
        } else {
            convertValue = regNumber;
        }
        return convertValue;
    },

    // bytes 단위 변환
    byteConvert: function (bytes) {
        if (bytes==0) return "0 Byte";

        let s = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, e)).toFixed(2) + " " + s[e];
    },

    // bytes 단위 변환 (결과 소수점 제외)
    byteConvertIntResult: function (bytes) {
        if (bytes==0) return "0 Byte";

        let s = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let e = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.floor((bytes / Math.pow(1024, e))) + " " + s[e];
    },

    // bytes 단위 변환 (결과 소수점 포함)
    byteConvertIntResultWithdDecimal: function (bytes) {
        let s = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'];
        let e = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, e)).toFixed(2) + " " + s[e];
    },

    //전화번호
    telno: function (tel1, tel2, tel3) {
        let convertValue = "";
        if (tel1 == null && tel2 == null && tel3 == null) {
            convertValue = '';
        }else{
            convertValue = tel1 + '-' + tel2 + '-' + tel3;
        }
        return convertValue;
    },

    //전화번호 (각 전화번호 포맷에 맞게 변환하여 반환)
    contact: function (tel) {
        if (tel === null || tel === undefined || tel === '') {
            return '';
        }

        let convertValue = "";

        try{
            if(tel.length === 8) {
                convertValue = tel.replace(/(\d{4})(\d{4})/, '$1-$2');
            }
            else{
                convertValue = tel.replace(/(^02.{0}|^01.{1}|[0-9]{3})([0-9]+)([0-9]{4})/,"$1-$2-$3");
            }
        }catch (e) {
            console.error(e);
        }

        return convertValue;
    },

    //날짜 변환
    dateType: function (date) {
        let convertValue = "";
        if(date == null) {
            convertValue ='';
        }
        else {
            //ex> 2018-06-12 , 2018.06.12 , 2018/06/12 -> 2018년 06월 12일 형태로 변환처리
            convertValue = date.replace(/(\d{4})[\.|\/|\-](\d{2})[\.|\/|\-](\d{2})/, "$1년 $2월 $3일" );
        }
        return convertValue;

    },

    //날짜 변환
    base64_encode: function (str) {
        if (window.btoa) // Internet Explorer 10 and above
            return window.btoa(unescape(encodeURIComponent(str)));
        else {
            // Cross-Browser Method (compressed)

            // Create Base64 Object
            let Base64 = {
                _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
                encode: function (e) {
                    let t = "";
                    let n, r, i, s, o, u, a;
                    let f = 0;
                    e = Base64._utf8_encode(e);
                    while (f < e.length) {
                        n = e.charCodeAt(f++);
                        r = e.charCodeAt(f++);
                        i = e.charCodeAt(f++);
                        s = n >> 2;
                        o = (n & 3) << 4 | r >> 4;
                        u = (r & 15) << 2 | i >> 6;
                        a = i & 63;
                        if (isNaN(r)) {
                            u = a = 64
                        } else if (isNaN(i)) {
                            a = 64
                        }
                        t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a)
                    }
                    return t
                },
                decode: function (e) {
                    let t = "";
                    let n, r, i;
                    let s, o, u, a;
                    let f = 0;
                    e = e.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                    while (f < e.length) {
                        s = this._keyStr.indexOf(e.charAt(f++));
                        o = this._keyStr.indexOf(e.charAt(f++));
                        u = this._keyStr.indexOf(e.charAt(f++));
                        a = this._keyStr.indexOf(e.charAt(f++));
                        n = s << 2 | o >> 4;
                        r = (o & 15) << 4 | u >> 2;
                        i = (u & 3) << 6 | a;
                        t = t + String.fromCharCode(n);
                        if (u != 64) {
                            t = t + String.fromCharCode(r)
                        }
                        if (a != 64) {
                            t = t + String.fromCharCode(i)
                        }
                    }
                    t = Base64._utf8_decode(t);
                    return t
                },
                _utf8_encode: function (e) {
                    e = e.replace(/\r\n/g, "\n");
                    let t = "";
                    for (let n = 0; n < e.length; n++) {
                        let r = e.charCodeAt(n);
                        if (r < 128) {
                            t += String.fromCharCode(r)
                        } else if (r > 127 && r < 2048) {
                            t += String.fromCharCode(r >> 6 | 192);
                            t += String.fromCharCode(r & 63 | 128)
                        } else {
                            t += String.fromCharCode(r >> 12 | 224);
                            t += String.fromCharCode(r >> 6 & 63 | 128);
                            t += String.fromCharCode(r & 63 | 128)
                        }
                    }
                    return t
                },
                _utf8_decode: function (e) {
                    let t = "";
                    let n = 0;
                    let r = c1 = c2 = 0;
                    while (n < e.length) {
                        r = e.charCodeAt(n);
                        if (r < 128) {
                            t += String.fromCharCode(r);
                            n++
                        } else if (r > 191 && r < 224) {
                            c2 = e.charCodeAt(n + 1);
                            t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                            n += 2
                        } else {
                            c2 = e.charCodeAt(n + 1);
                            c3 = e.charCodeAt(n + 2);
                            t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                            n += 3
                        }
                    }
                    return t
                }
            }
            // Encode the String
            return Base64.encode(unescape(encodeURIComponent(str)));
        }
    },
    /**
     * 계좌번호 반환
     * @author 김범진A
     * @param {string} str 계좌번호
     * @param {string=} splitter 계좌번호 사이에 구분자로 들어갈 값. 기본값은 '-'
     * @param patternNum 계좌번호 패턴 자리 숫자. 기본값은 4자리
     * @return {*}
     */
    account: function (str, splitter = '-', patternNum = 4) {
        let resultAccount = '';

        if(typeof str !== 'string')
            return null;

        str = str.replace(/\s/gi, "");

        if(!str)
            return '';

        if(typeof splitter !== 'string')
            splitter = '-';

        if(typeof patternNum !== 'number')
            patternNum = 4;

        for(let i=0; i<str.length; i+=patternNum) {
            resultAccount += str.substr(i, patternNum);
            resultAccount += splitter;
        }

        // 마지막 splitter 제거
        resultAccount = resultAccount.slice(0, - 1);

        return resultAccount
    },

    // 앞 0으로 채우기
    pad0: function(n, width) {
        n = n + '';
        return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n
    },

    rPad: function(sOrgStr, sPaddingChar, iNum, fix) {
        if (sOrgStr == null){
            return "";
        }

        if (sPaddingChar == null){
            sPaddingChar = "";
        }

        if (iNum == null){
            iNum = undefined;
        }

        var sReturn
        var sPaddingStr = "";

        for (var i=0; i < iNum; i++) {
            sPaddingStr += sPaddingChar;
        }

        if (fix) sReturn = (sOrgStr + sPaddingStr).substring(0, iNum);
        else sReturn = (sOrgStr + sPaddingStr);

        return sReturn;
    },
};
