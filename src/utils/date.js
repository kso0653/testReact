import $ from "jquery";

/**
 * string utils
 * @author by ssh
 */

Date.prototype.yyyymmdd = function () {
    let mm = this.getMonth() < 9 ? "0" + (this.getMonth() + 1) : (this.getMonth() + 1);
    let dd  = this.getDate() < 10 ? "0" + this.getDate() : this.getDate();
    return [this.getFullYear(), mm, dd].join('');
}

Date.prototype.toFormatString = function(format) {

    let year = this.getFullYear();

    let month = this.getMonth() + 1;

    let day = this.getDate();

    let hour = this.getHours();

    let minute = this.getMinutes();

    let second = this.getSeconds();



    if (format == null) format = "yyyy-MM-dd";

    format = format.replace("yyyy", year);

    format = (month < 10) ? format.replace("MM", "0" + month) : format.replace("MM", month);

    format = format.replace("M", month);

    format = (day < 10) ? format.replace("dd", "0" + day) : format.replace("dd", day);

    format = format.replace("d", day);

    format = (hour < 10) ? format.replace("HH", "0" + hour) : format.replace("HH", hour);

    format = (minute < 10) ? format.replace("mm", "0" + minute) : format.replace("mm", minute);

    format = (second < 10) ? format.replace("ss", "0" + second) : format.replace("ss", second);



    return format;

}


export default {
    getyyyymmdd: function(dateObj) {
        let mm = dateObj.getMonth() < 9 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
        let dd  = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
        return [dateObj.getFullYear(), mm, dd].join('');
    },
    getyyyymm: function(dateObj) {
        let mm = dateObj.getMonth() < 9 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
        return [dateObj.getFullYear(), mm].join('');
    },
    getyyyy: function(dateObj) {
        return [dateObj.getFullYear()].join('');
    },
    getmm: function(dateObj) {
        let mm = dateObj.getMonth() < 9 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
        return [mm].join('');
    },
    getdd: function(dateObj) {
        let dd  = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
        return [dd].join('');
    },
    gethh: function(dateObj) {
        let dd  = dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours();
        return [dd].join('');
    },
    getmmm: function(dateObj) {
        let dd  = dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes();
        return [dd].join('');
    },
    getss: function(dateObj) {
        let dd  = dateObj.getSeconds() < 10 ? "0" + dateObj.getSeconds() : dateObj.getSeconds();
        return [dd].join('');
    },
    getyyyymmddCommmaFormat: function(dateObj) {
        let mm = dateObj.getMonth() < 9 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
        let dd  = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
        return [dateObj.getFullYear(),'.', mm, '.', dd].join('');
    },
    getyyyymmddDashFormat: function(dateObj) {
        let mm = dateObj.getMonth() < 9 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
        let dd  = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
        return [dateObj.getFullYear(),'-', mm, '-', dd].join('');
    },
    getyyyymmddhhmmss: function(dateObj) {
        var yyyy = dateObj.getFullYear().toString();
        var MM = this.getdatepad(dateObj.getMonth() + 1,2);
        var dd = this.getdatepad(dateObj.getDate(), 2);
        var hh = this.getdatepad(dateObj.getHours(), 2);
        var mm = this.getdatepad(dateObj.getMinutes(), 2)
        var ss = this.getdatepad(dateObj.getSeconds(), 2)
        return yyyy + MM + dd+  hh + mm + ss;
    },
    getdatepad: function(number, length) {
        var str = '' + number;
        while (str.length < length) {
            str = '0' + str;
        }
        return str;
    },
    /**
     * 현재 페이지의 서버에 요청하여 서버시간을 가져와 처리합니다.
     * @returns {{start: *, end: *}}
     */
    getTime: function() {
        let xmlHttp;
        let target = this;

        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();
        }
        else if (window.ActiveXObject) {
            xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
        }
        else {
            return ;
        }

        let currentDateClass;

        //xmlHttp.open('GET', window.location.href.toString(), false);
        xmlHttp.open('GET', window.location.protocol + "//" + window.location.host, false);
        xmlHttp.setRequestHeader("Content-Type", "text/html");
        xmlHttp.onload = function() {
            currentDateClass = new Date(xmlHttp.getResponseHeader("Date"));
            let dateStr = target.getyyyymmddhhmmss(currentDateClass);
            let y = dateStr.substr(0,4),
                m = dateStr.substr(4,2)-1,
                d = dateStr.substr(6,2);
            currentDateClass = new Date(y, m, d);
        };
        xmlHttp.send('');

        //서버의 Date 값 response new Date()객체에 넣기 전엔 시간표준이 GMT로 표시
        // let serverDate = xmlHttp.getResponseHeader("Date");
        // let currentDateClass = new Date(serverDate);

        let endDate = this.getyyyymmdd(currentDateClass);

        currentDateClass.setMonth(currentDateClass.getMonth()-3);
        let startDate = this.getyyyymmdd(currentDateClass);
        // console.log("****** ", startDate , ' / ', endDate);
        return {'start':startDate, 'end':endDate}
    } ,

    getServerDate: function() {
        let target = this;
        try {
            let xmlHttp;

            if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            }
            else if (window.ActiveXObject) {
                xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
            }
            else {
                return null;
            }

            let currentDateClass = null;

            xmlHttp.open('GET', window.location.protocol + "//" + window.location.host + '?t=' + new Date().getTime(), false);
            xmlHttp.setRequestHeader("Content-Type", "text/html");
            xmlHttp.onload = function() {
                currentDateClass = new Date(xmlHttp.getResponseHeader("Date"));
                let dateStr = target.getyyyymmddhhmmss(currentDateClass);
                let y = dateStr.substr(0,4),
                    m = dateStr.substr(4,2)-1,
                    d = dateStr.substr(6,2),
                    hh = dateStr.substr(8,2),
                    mm = dateStr.substr(10,2),
                    ss = dateStr.substr(12,2);

                currentDateClass = new Date(y, m, d, hh, mm, ss);
            };
            xmlHttp.send('');

            return currentDateClass;
        } catch(e) {
            let dateStr = target.getyyyymmddhhmmss(new Date());
            let y = dateStr.substr(0,4),
                m = dateStr.substr(4,2)-1,
                d = dateStr.substr(6,2),
                hh = dateStr.substr(8,2),
                mm = dateStr.substr(10,2),
                ss = dateStr.substr(12,2);

            return new Date(y, m, d, hh, mm, ss);
        }
    } ,
    getCommonFormat: function(dateObj) {
        let resultDateString;
        let currDateObj = new Date();   // 오늘날짜

        let currDt      = new Date(currDateObj.toDateString());
        let targetDt    = new Date(dateObj.toDateString());
        let diffDate    = (currDt.getTime() - targetDt.getTime()) / (1000*60*60*24) ;

        if(currDateObj.toDateString() ==  dateObj.toDateString()) {      // 1. (오늘) : 오늘 오전 10:13
            resultDateString = "오늘 " +  dateObj.toLocaleTimeString();
            let lastIndex = resultDateString.lastIndexOf(':');
            resultDateString = resultDateString.slice(0, lastIndex);
        } else if(diffDate <= 1.00000001){                               // 2. (어제) : 어제 오전 10:13
            resultDateString = "어제 " +  dateObj.toLocaleTimeString();
            let lastIndex = resultDateString.lastIndexOf(':');
            resultDateString = resultDateString.slice(0, lastIndex);
        } else if(currDateObj.getFullYear() ==  dateObj.getFullYear() ){ // 3. (당해년도) : MM.DD
            let mm = dateObj.getMonth() < 9 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
            let dd = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
            resultDateString = mm +"."+ dd;
        } else if(currDateObj.getFullYear() >  dateObj.getFullYear() ){  // 4. (이전년도) : YYYY.MM.DD
            let mm = dateObj.getMonth() < 9 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
            let dd = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();

            resultDateString = dateObj.getFullYear() +"."+ mm +"."+ dd;
        } else {
            // 예) 2010.7.21 수요일 오전 10:13:44
            resultDateString = dateObj.toLocaleString();
        }

        return resultDateString;
    } ,

    getChatFormat: function(dateObj) {
        let resultDateString;
        let currDateObj = new Date();   // 오늘날짜

        if(currDateObj.toDateString() ==  dateObj.toDateString()) {      // 1. (오늘) : 오늘 오전 10:13
            resultDateString = dateObj.toLocaleTimeString();
            //resultDateString = resultDateString.slice(0, -3);
            let lastIndex = resultDateString.lastIndexOf(':');
            resultDateString = resultDateString.slice(0, lastIndex);
        } else {  // 4. (이전년도) : YYYY.MM.DD
            let mm = dateObj.getMonth() < 9 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
            let dd = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
            let hh = dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours();
            let mi = dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes();
            resultDateString = dateObj.getFullYear() +"-"+ mm +"-"+ dd + " "+ hh + ":" + mi;
        }
        return resultDateString;
    } ,
    
    getWeTalkChatFormat: function(dateObj) {
        let resultDateString;
        let currDateObj = new Date();   // 오늘날짜

        const locale = $.cookie("locale");
        const countryFormat =  locale === 'en' || locale ==='ja' ? 'en-US' : 'ko-KR'

        if(currDateObj.toDateString() ==  dateObj.toDateString()) {      // 1. (오늘) : 오늘 오전 10:13

            resultDateString = dateObj.toLocaleTimeString(countryFormat);
            let lastIndex = resultDateString.lastIndexOf(':');

            if(locale === 'en' || locale ==='ja'){
                resultDateString = resultDateString.slice(0, lastIndex) + resultDateString.slice(lastIndex + 3);
            }else{
                resultDateString = resultDateString.slice(0, lastIndex);
            }

        } else {  // 4. (이전년도) : YYYY.MM.DD
            let mm = dateObj.getMonth() < 9 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
            let dd = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
            let hh = dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours();
            let mi = dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes();
            resultDateString = dateObj.getFullYear() +"-"+ mm +"-"+ dd + " "+ hh + ":" + mi;
        }
        return resultDateString;
    } ,
    getWeTalkChatRenewalFormat: function(dateObj) {
        // (오늘) : 오늘 오전 10:13

        let resultDateString;

        const locale = $.cookie("locale");
        const countryFormat = locale === 'en' || locale === 'ja' ? 'en-US' : 'ko-KR'


        resultDateString = dateObj.toLocaleTimeString(countryFormat);
        let lastIndex = resultDateString.lastIndexOf(':');

        if (locale === 'en' || locale === 'ja') {
            resultDateString = resultDateString.slice(0, lastIndex) + resultDateString.slice(lastIndex + 3);
        } else {
            resultDateString = resultDateString.slice(0, lastIndex);
        }
        return resultDateString;
    },

	getDateFileInfo: function(dateObj) {
		let mm = dateObj.getMonth() < 9 ? "0" + (dateObj.getMonth() + 1) : (dateObj.getMonth() + 1);
		let dd = dateObj.getDate() < 10 ? "0" + dateObj.getDate() : dateObj.getDate();
		let hh = dateObj.getHours() < 10 ? "0" + dateObj.getHours() : dateObj.getHours();
		let mi = dateObj.getMinutes() < 10 ? "0" + dateObj.getMinutes() : dateObj.getMinutes();
		return dateObj.getFullYear() +"-"+ mm +"-"+ dd + " "+ hh + ":" + mi;
	} ,

    getDateMask: function(dateObj, strMask) {
        return [this.getyyyy(dateObj), this.getmm(dateObj), this.getdd(dateObj)].join(strMask);
    } ,
    getTimeMask: function(dateObj, strMask) {
        return [this.gethh(dateObj), this.getmmm(dateObj)].join(strMask);
    },
    getTimeSecondsMask: function(dateObj, strMask) {
        return [this.gethh(dateObj), this.getmmm(dateObj), this.getss(dateObj)].join(strMask);
    },
    getDateKoreaMask: function(dateObj) {
        return this.getyyyy(dateObj) +"년"+ this.getmm(dateObj)+"월"+this.getdd(dateObj)+ "일";
    } ,
    getDateKoreaMask2: function(dateObj, formatType) {
        // yyyy-MM-dd hh:mm:ss
        if (formatType === "yyyy-MM") {
            return this.getyyyy(dateObj)+"년 "+this.getmm(dateObj)+"월";
        } else if (formatType === "yyyy-MM-dd") {
            return this.getyyyy(dateObj)+"년 "+this.getmm(dateObj)+"월 "+this.getdd(dateObj)+"일";
        } else if (formatType === "yyyy-MM-dd hh") {
            return this.getyyyy(dateObj)+"년 "+this.getmm(dateObj)+"월 "+this.getdd(dateObj)+"일 "+this.gethh(dateObj)+"시";
        } else {
            return this.getyyyy(dateObj)+"년 "+this.getmm(dateObj)+"월 "+this.getdd(dateObj)+"일 "+this.getDayText(dateObj)+"요일 "+this.getTimeSecondsMask(dateObj, ":");
        }
    },
    getDateLanguageMask: function(dateObj) {
        const locale = $.cookie("locale");

        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        if(locale === 'en'){
            return monthNames[dateObj.getMonth()] + " " + this.getdd(dateObj) + ", " + this.getyyyy(dateObj);
        }else if(locale ==='ja'){
            return this.getyyyy(dateObj) +"年"+ this.getmm(dateObj)+"月"+this.getdd(dateObj)+ "日";
        }

        return this.getyyyy(dateObj) +"년 "+ this.getmm(dateObj)+"월 "+this.getdd(dateObj)+ "일 ";
    } ,
    getDateLanguageMask2: function(dateObj, formatType) {
        const locale = $.cookie("locale");

        if(locale ==='en'){
            const monthNames = [
                "January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
            ];

            if (formatType === "yyyy-MM") {
                return monthNames[dateObj.getMonth()] + ", " + this.getyyyy(dateObj);
            } else if (formatType === "yyyy-MM-dd") {
                return monthNames[dateObj.getMonth()] + " " + this.getdd(dateObj) + ", " + this.getyyyy(dateObj);
            } else if (formatType === "yyyy-MM-dd hh") {
                return monthNames[dateObj.getMonth()] + " " + this.getdd(dateObj) + ", " + this.getyyyy(dateObj) + " "+this.gethh(dateObj)+"o'clock";;
            } else {
                return monthNames[dateObj.getMonth()] + " " + this.getdd(dateObj) + ", " + this.getyyyy(dateObj) + " " +this.getDayText2(dateObj)+" "+this.getTimeSecondsMask(dateObj, ":");
            }
        }else if(locale ==='ja') {
            if (formatType === "yyyy-MM") {
                return this.getyyyy(dateObj)+"年 "+this.getmm(dateObj)+"月";
            } else if (formatType === "yyyy-MM-dd") {
                return this.getyyyy(dateObj)+"年 "+this.getmm(dateObj)+"月 "+this.getdd(dateObj)+"日";
            } else if (formatType === "yyyy-MM-dd hh") {
                return this.getyyyy(dateObj)+"年 "+this.getmm(dateObj)+"月 "+this.getdd(dateObj)+"日 "+this.gethh(dateObj)+"時";
            } else {
                return this.getyyyy(dateObj)+"年 "+this.getmm(dateObj)+"月 "+this.getdd(dateObj)+"日 "+this.getDayText2(dateObj)+" "+this.getTimeSecondsMask(dateObj, ":");
            }
        }else{
            if (formatType === "yyyy-MM") {
                return this.getyyyy(dateObj)+"년 "+this.getmm(dateObj)+"월";
            } else if (formatType === "yyyy-MM-dd") {
                return this.getyyyy(dateObj)+"년 "+this.getmm(dateObj)+"월 "+this.getdd(dateObj)+"일";
            } else if (formatType === "yyyy-MM-dd hh") {
                return this.getyyyy(dateObj)+"년 "+this.getmm(dateObj)+"월 "+this.getdd(dateObj)+"일 "+this.gethh(dateObj)+"시";
            } else {
                return this.getyyyy(dateObj)+"년 "+this.getmm(dateObj)+"월 "+this.getdd(dateObj)+"일 "+this.getDayText2(dateObj)+"요일 "+this.getTimeSecondsMask(dateObj, ":");
            }
        }


    } ,
    getNextPayDate: function(dateObj) {
        let currentYear = dateObj.getFullYear();
        let currentMonth = dateObj.getMonth() + 1;
        let currentDay = dateObj.getDate();
        let resultMonth;
        let resultDay;
        let resultYear = currentYear;

        if (currentDay == 1) {
            resultMonth = new Date(dateObj.getYear(), currentMonth, 0).getMonth() + 1;
            resultDay = new Date(dateObj.getYear(), currentMonth, 0).getDate();
        } else if (currentMonth == 1) {
            let test = new Date(dateObj.getYear(), currentMonth + 1, 0);
            if (currentDay > 28) {
                resultMonth = test.getMonth() + 1;
                resultDay = test.getDate() - 1;
            } else {
                resultMonth = new Date(dateObj.getYear(), currentMonth + 1, 0).getMonth();
                resultMonth = resultMonth + 1;
                resultDay = currentDay - 1;
            }
        } else {
            resultMonth = new Date(dateObj.getYear(), currentMonth + 1, 0).getMonth();
            resultMonth = resultMonth + 1;
            resultDay = currentDay - 1;
        }

        if (resultMonth == 1 && resultDay != 31) {
            resultYear = currentYear + 1;
        }

        if (resultMonth < 10) {
            resultMonth = '0' + resultMonth;
        } else {
            resultMonth;
        }
        if (resultDay < 10) {
            resultDay = '0' + resultDay;
        } else {
            resultDay;
        }
        return {
            year: resultYear,
            month: resultMonth,
            day: resultDay
        };
    },
    getDayText: function(dateObj) {
        const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
        return WEEK[dateObj.getDay()];
    },
    getDayText2: function(dateObj) {
        const locale = $.cookie("locale");

        const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
        const WEEK_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const WEEK_JA = ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'];

        if(locale == 'en'){
            return WEEK_EN[dateObj.getDay()];
        } else if(locale == 'ja'){
            return WEEK_JA[dateObj.getDay()];
        } else{
            return WEEK[dateObj.getDay()];
        }
    },
    /**
     * 서버 시간 반환
     * @author 김범진A
     * @param fmt 반환받을 형식, 기본값은 yyyy-MM-dd HH:mm:ss 형식 (반환 형식은 date.js의 Date.prototype.toFormatString 참조)
     * @returns {String}
     */
    getServerTime: function(fmt = "yyyy-MM-dd HH:mm:ss") {
        let target = this;
        try {
            let xmlHttp;

            if (window.XMLHttpRequest) {
                xmlHttp = new XMLHttpRequest();
            }
            else if (window.ActiveXObject) {
                xmlHttp = new ActiveXObject('Msxml2.XMLHTTP');
            }
            else {
                return null;
            }

            let currentDateClass = null;

            xmlHttp.open('GET', window.location.protocol + "//" + window.location.host, false);
            xmlHttp.setRequestHeader("Content-Type", "text/html");
            xmlHttp.onload = function () {
                currentDateClass = new Date(xmlHttp.getResponseHeader("Date"));
                let dateStr = target.getyyyymmddhhmmss(currentDateClass);
                let y = dateStr.substr(0, 4),
                    m = dateStr.substr(4, 2) - 1,
                    d = dateStr.substr(6, 2),
                    hh = dateStr.substr(8, 2),
                    mm = dateStr.substr(10, 2),
                    ss = dateStr.substr(12, 2);

                currentDateClass = new Date(y, m, d, hh, mm, ss);
            };
            xmlHttp.send('');

            return currentDateClass.toFormatString(fmt);
        } catch(e) {
            let dateStr = target.getyyyymmddhhmmss(new Date());
            let y = dateStr.substr(0, 4),
                m = dateStr.substr(4, 2) - 1,
                d = dateStr.substr(6, 2),
                hh = dateStr.substr(8, 2),
                mm = dateStr.substr(10, 2),
                ss = dateStr.substr(12, 2);

            let currentDateClass = new Date(y, m, d, hh, mm, ss);
            return currentDateClass.toFormatString(fmt);
        }
    },
    isBeforeDateTime: function(d1, d2) {
        return (d1.getTime() < d2.getTime());
    },
    isAfterDateTime: function(d1, d2) {
        return (d1.getTime() > d2.getTime());
    },
    isSameDateTime: function(d1, d2) {
        return (d1.getTime() === d2.getTime());
    },
    getDefaultYYYYMMDD: function(objectDate, format) {
        if(objectDate.length !== 8){
            return objectDate;
        }
        return objectDate.substr(0,4) + format + objectDate.substr(4,2) + format + objectDate.substr(6,2);
    },

    getDefaultYYYYMM: function(objectDate, format) {
        if(objectDate.length !== 6){
            return objectDate;
        }
        return objectDate.substr(0,4) + format + objectDate.substr(4,2);
    },

    fn_DayOfMonth(year, month)
    {
        return 32 - new Date(year, month-1, 32).getDate();
    },

    getYYYMMDDPARSE : function(str) {
        if(str === undefined || str.length < 8){
            return new Date();
        }
        var y = str.substr(0, 4);
        var m = str.substr(4, 2);
        var d = str.substr(6, 2);
        return new Date(y,m-1,d);
    },

    getKoreaYYYYMMDD: function(str) {
        if(str === undefined || str.length < 8){
            return "";
        }
        var y = str.substr(0, 4);
        var m = str.substr(4, 2);
        var d = str.substr(6, 2);

        return y + "년" + m + "월"  + d + "일";
    },

    yyyymmddToDate: function(yyyymmdd) {
        let y = yyyymmdd.substr(0,4),
            m = yyyymmdd.substr(4,2),
            d = yyyymmdd.substr(6,2);
        return new Date(y, m, d);
    },

    yyyymmddhhmmssToDate: function(yyyymmddhhmmss) {
        let y = yyyymmddhhmmss.substr(0, 4),
            m = yyyymmddhhmmss.substr(4, 2) - 1,
            d = yyyymmddhhmmss.substr(6, 2),
            hh = yyyymmddhhmmss.substr(8, 2),
            mm = yyyymmddhhmmss.substr(10, 2),
            ss = yyyymmddhhmmss.substr(12, 2);

        return new Date(y, m, d, hh, mm, ss);
    },

    yyyymmddToCommonDateFromat: function(yyyymmdd) {
        let y = yyyymmdd.substr(0,4),
            m = yyyymmdd.substr(4,2),
            d = yyyymmdd.substr(6,2);
        return y + "." + m + "." + d;
    },
    between_Dat1_and_Dat2 : (dat1,dat2) => {
        let diff = dat2.getTime() - dat1.getTime(); //날짜 빼기
        const isDone = diff > 0 ? false:true
        diff = Math.abs(diff)
    
        const currSec = 1000; // 밀리세컨
        const currMin = 60 * 1000; // 초 * 밀리세컨
        const currHour = 60 * 60 * 1000; // 분 * 초 * 밀리세컨
        const currDay = 24 * 60 * 60 * 1000; // 시 * 분 * 초 * 밀리세컨
            
        const day = Math.floor(diff/currDay); //d-day 일
        const hour = Math.floor(diff/currHour); //d-day 시
        const min = Math.floor(diff/currMin); //d-day 분
        const sec = Math.floor(diff/currSec); //d-day 초
            
        let viewHour = hour-(day*24);
        let viewMin = min-(hour*60);
        let viewSec = sec-(min*60);
    
        viewHour = viewHour < 10 ? '0'+viewHour : viewHour
        viewMin = viewMin < 10 ? '0'+viewMin : viewMin
        viewSec = viewSec < 10 ? '0'+viewSec : viewSec
    
            
        //시분초 말고 일까지만 보여주면 day만 노출하면 된다.
        return {day,viewHour,viewMin,viewSec,isDone}
      },

    formatDate(date, format){
        let d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();
        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        if(format == 'yyyy'){
            return year;
        }else if(format == 'MM'){
            return month
        }else if(format == 'dd'){
            return day
        }else if(format == 'yyyy/MM/dd'){
            return year+'/'+month+'/'+day;
        }else if(format == 'yyyy-MM-dd'){
            return year+'-'+month+'-'+day;
        }else if(format == 'yyyy.MM.dd'){
            return year+'.'+month+'.'+day;
        }else{
            return [year, month, day].join('');
        }

        return [year, month, day].join('');
    },
    /**
     * 대화 내 투표의 날짜 데이터 표현 방식인 yyyy년 mm월 dd일 (요일)로 반환
     * ex) 2022년 1월 26일 (수)
     * @author 김수지
     * @returns {String}
     */
    getVoteDateFormat(dateParam) {
        const preDate = dateParam instanceof Date ? dateParam : new Date(Number(dateParam));

        const year = preDate.getFullYear();
        const month = preDate.getMonth() + 1;
        const date = preDate.getDate();
        const day = this.getDayText(preDate);

        return year + "년 " + month + "월 " + date + "일 " + "(" + day + ")";
    }
};
