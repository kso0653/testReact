// export function numberWithSymbol(value, symbol = ',') {
//     if (value == null) return '';
//     var parts = value.toString().split('.');
//     return parts[0].replace(/\B(?=(\d{3})+(?=$))/g, symbol) + (parts[1] ? '.' + parts[1] : '')
// }

/**
 * string utils
 * @author by ssh
 */

const randomInt = require("random-int");

export default {
    lPad: function(sOrgStr, sPaddingChar, iNum, fix) {
        if (sOrgStr == null || sPaddingChar == null || iNum == null) return "";

        var sReturn
        var sPaddingStr = "";

        for (var i=0; i < iNum; i++) {
            sPaddingStr += sPaddingChar;
        }

        if (fix) sReturn = (sPaddingStr + sOrgStr).substring((sPaddingStr + sOrgStr).length-iNum, (sPaddingStr + sOrgStr).length);
        else sReturn = (sPaddingStr + sOrgStr);

        return sReturn;
    },
    rPad: function(sOrgStr, sPaddingChar, iNum, fix) {
        if (sOrgStr == null || sPaddingChar == null || iNum == null) return "";

        var sReturn
        var sPaddingStr = "";

        for (var i=0; i < iNum; i++) {
            sPaddingStr += sPaddingChar;
        }

        if (fix) sReturn = (sOrgStr + sPaddingStr).substring(0, iNum);
        else sReturn = (sOrgStr + sPaddingStr);

        return sReturn;
    },
    fixNull: function(obj) {
        if (obj == null || obj == undefined)
            return "";
        else
            return obj;
    },
    numberWithSymbol: function(value, symbol = ',') {
        if (value == null) return '';
        var parts = value.toString().split('.');
        return parts[0].replace(/\B(?=(\d{3})+(?=$))/g, symbol) + (parts[1] ? '.' + parts[1] : '')
    },
    replaceSpace: function(str) {
        let regExp = /\s/g;
        return str.replace(regExp, '');
    },
    getRandomString: function(string_length) {
        let chars = "1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
        let randomString = '';
        for (let i=0; i<string_length; i++) {
            //let rNum = Math.floor(Math.random() * chars.length);
            let rnum = randomInt(0, chars.length - 1);
            randomString += chars.substring(rnum, rnum+1);
        }
        return randomString;
    },
    /* timestamp를 이용한 랜덤 생성. 다음기회에 쓰자
    mathRandom: function () {
        let seed = new Date().getTime();
        seed = (seed*9301+49297) % 233280;
        return seed/(233280.0);
    },
    */
    /**
     *  replace 전체
     */
    replaceAll(str, target, replaceStr) {
        return str.split(target).join(replaceStr);
    }
};

/**
 * content 에 url 링크가 있으면 a 태그로 변환해서 반환
 * @param content
 * @returns {*}
 */
export function autoLink(content) {
    if(!content && content !== 0)
        return content;

    if(typeof content !== 'string') {
        content = content + '';
    }

    let regUrl = new RegExp('(^|[^"=])(http|https|ftp|telnet|news|irc):\\/\\/([-\\/.a-zA-Z0-9_~#%$?&=:200-377;가-힣+,!\'@]+)', 'gi');
    let regUrl2 = /(^|[^\/])(www\.[-a-zA-Z0-9@:%._\+~#=가-힣]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&\/\/=,!']*)/gim;

    if(content.indexOf("/app/kibana#/") > -1){
        regUrl = new RegExp('(^|[^"=])(http|https|ftp|telnet|news|irc):\\/\\/([-\\/.a-zA-Z0-9_~#%$?&=:200-377();가-힣+,!\'@]+)', 'gi');
        regUrl2 = /(^|[^\/])(www\.[-a-zA-Z0-9@:%._\+~#=가-힣]{2,256}\.[a-z]{2,6}\b[-a-zA-Z0-9@:%_\+.~#?&\/\/=(),!']*)/gim;
    }
    
    return content.replace(regUrl, '$1<a class="contentsLink" href="$2://$3" target="_blank" style="color : #1a0dab">$2://$3</a>')
                  .replace(regUrl2, '$1<a class="contentsLink" href="http://$2" target="_blank" style="color : #1a0dab">$2</a>')
}
