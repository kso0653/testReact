/**
 * format utils
 * @author by ssh
 */


export default {
    _patterns : {
     url : '(?:\\b(?:(?:(?:(ftp|https?|mailto|telnet):\\/\\/)?(?:((?:[\\w$\\-'
    + '_\\.\\+\\!\\*\\\'\\(\\),;\\?&=]|%[0-9a-f][0-9a-f])+(?:\\:(?:[\\w$'
    + '\\-_\\.\\+\\!\\*\\\'\\(\\),;\\?&=]|%[0-9a-f][0-9a-f])+)?)\\@)?((?'
    + ':[\\d]{1,3}\\.){3}[\\d]{1,3}|(?:[a-z0-9]+\\.|[a-z0-9][a-z0-9\\-]+'
    + '[a-z0-9]\\.)+(?:biz|com|info|name|net|org|pro|aero|asia|cat|coop|'
    + 'edu|gov|int|jobs|mil|mobi|museum|tel|travel|ero|gov|post|geo|cym|'
    + 'arpa|ac|ad|ae|af|ag|ai|al|am|an|ao|aq|ar|as|at|au|aw|ax|az|ba|bb|'
    + 'bd|be|bf|bg|bh|bi|bj|bm|bn|bo|br|bs|bt|bw|by|bz|ca|cc|cd|cf|cg|ch'
    + '|ci|ck|cl|cm|cn|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|ee|eg|e'
    + 'r|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gd|ge|gf|gg|gh|gi|gl|gm|gn|gp|gq|'
    + 'gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|in|io|iq|ir|is|it'
    + '|je|jm|jo|jp|ke|kg|kh|ki|km|kn|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|l'
    + 't|lu|lv|ly|ma|mc|me|md|mg|mh|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|mv|'
    + 'mw|mx|my|mz|na|nc|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|pa|pe|pf|pg|ph'
    + '|pk|pl|pn|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|s'
    + 'i|sk|sl|sm|sn|sr|st|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tl|tm|tn|to|tr|'
    + 'tt|tv|tw|tz|ua|ug|uk|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|ye|za|zm'
    + '|zw)|localhost)\\b(?:\\:([\\d]+))?)|(?:(file):\\/\\/\\/?)?([a-z]:'
    + '))(?:\\/((?:(?:[\\w$\\-\\.\\+\\!\\*\\(\\),;:@=ㄱ-ㅎㅏ-ㅣ가-힣]|%['
    + '0-9a-f][0-9a-f]|&(?:nbsp|lt|gt|amp|cent|pound|yen|euro|sect|copy|'
    + 'reg);)*\\/)*)([^\\s\\/\\?:\\"\\\'<>\\|#]*)(?:[\\?:;]((?:\\b[\\w]+'
    + '(?:=(?:[\\w\\$\\-\\.\\+\\!\\*\\(\\),;:=ㄱ-ㅎㅏ-ㅣ가-힣]|%[0-9a-f]'
    + '[0-9a-f]|&(?:nbsp|lt|gt|amp|cent|pound|yen|euro|sect|copy|reg);)*'
    + ')?\\&?)*))*(#[\\w\\-ㄱ-ㅎㅏ-ㅣ가-힣]+)?)?)',
        querystring: new RegExp('(\\b[\\w]+(?:=(?:[\\w\\$\\-\\.\\+\\!\\*\\(\\),;'
            + ':=ㄱ-ㅎㅏ-ㅣ가-힣]|%[0-9a-f][0-9a-f]|&(?:nbsp|lt|gt|amp|cent|poun'
            + 'd|yen|euro|sect|copy|reg);)*)?)\\&?', 'gi')
    },

    /**
     *  _process : 정규식 컴파일 후 검색 * @param	(string)	string	문자열 * @param	(string)	modifiers
     *  정규식 수식어 * @return	(mixed)	정규식 결과 = [ array | null ]
     */

    _process : function (string, modifiers){

        if ( ! string) throw new Error(1, '입력값이 비어 있습니다.');
        var p = new RegExp(this._patterns.url, modifiers);
        return string.match(p);
    },

    /** * parse : 하나의 URL 주소를 분석 * @param	(string)	url	URL 주소 * @return	(object)	객체로 리턴
     *
     * */
    collect : function (text){
        var r = _process(text, 'gmi');
        return (r) ? r : [];
    },

    /** * parse : 하나의 URL 주소를 분석 * @param	(string)	url	URL 주소 * @return	(object)	객체로 리턴 */
    parse : function (url, type){
        console.log("url : " +  url)
        var r = this._process(url, 'mi'); if ( ! r) return {};

         console.log("r =" ,r);

        // HTTP 인증정보
        if (r[2]) r[2] = r[2].split(':');
        // 쿼리스트링 분석
        if (r[9]) { r[9] = r[9].match(this._patterns.querystring);

            for (var n = 0; n < r[9].length; n++){
                r[9][n] = (r[9][n] ? r[9][n].replace(/\&$/, '').split('=') : []);
                if (r[9][n].length == 1) r[9][n][1] = '';
            }
        }
        // 프로토콜이 없을 경우 추가
        if ( ! r[1] && ! r[5]) {
            // 도메인이 없는 경우 로컬 파일 주소로 설정
            if ( ! r[3]) r[5] = 'file';
            // E-Mail 인지 체크
            else if (r[0].match(new RegExp('^('+ r[2][0] +'@'+ r[3] +')$')))
                r[1] = 'mailto';
            // 기타 기본 포트를 기준으로 프로토콜 설정.
            // 포트가 없을 경우 기본적으로 http 로 설정
            else {
                switch (r[4]) {
                    case 21:	r[1] = 'ftp'; break;
                    case 23:	r[1] = 'telnet'; break;
                    case 443:	r[1] = 'https'; break;
                    case 80: default:	r[1] = 'http'; break;
                }
            }
            r[0] = (r[1] ? r[1] +'://' : r[5] +':///') + r[0];
        }
        return {
                'url'	    : r[0], // 전체 URL
                'protocol'	: (r[1] ? r[1]      : r[5]),	// [ftp|http|https|mailto|telnet] | [file]
                'userid'	: (r[2] ? r[2][0]   : ''),	// 아이디 : HTTP 인증 정보
                'userpass'	: (r[2] ? r[2][1]   : ''),	// 비밀번호
                'domain'	: (r[3] ? r[3]      : ''),	// 도메인주소
                'port'	    : (r[4] ? r[4]      : ''),	// 포트
                'drive'	    : (r[6] ? r[6]      : ''),	// 'file' 프로토콜인 경우
                'directory'	: (r[7] ? r[7]      : ''),	// 하위 디렉토리
                'filename'	: (r[8] ? r[8]      : ''),	// 파일명
                'querys'	: (r[9] ? r[9]      : ''),	// 쿼리스트링
                'anchor'	: (r[10] ? r[10]    : '')	// Anchor
        };
    }
};