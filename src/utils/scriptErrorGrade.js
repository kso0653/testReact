/**
 * common script error grade check type
 * @author by mbh9031
 */

const RISK_A_GRADE = [
    '/#/initialization',                                    // 초기설정
    '/#/point/charge',                                      // 포인트충전
    '/#/market/payment/service',                            // 신규서비스구매
    '/#/market/payment/charge/change',                      // 서비스요금제변경구매
    '/#/market/cart/user',                                  // 유저라이선스구매
    '/#/join',                                              // 회원가입
    '/#/company/companymailsettings/companymail/domainmanagement',   // 도메인연장
    '/#/company/companymailsettings/companymail',                    // 도메인구매
];

export default {
    checkRisk: function(url) {
        if (url.indexOf('/#/') !== -1) { // 로그인 후
            let tempA = url.split('/#/')[1];
            let tempB = '/#/'+ tempA;

            if (RISK_A_GRADE.indexOf(tempB) !== -1) { // A 등급
                return 'A';
            } else { // A 등급 외
                return '';
            }
        } else { // 로그인 전
            return '';
        }
    },
};