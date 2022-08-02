/**
 * Wehago Client Cache With Session Storage
 */

export default {

    /**
     * 세션 스토리지 저장
     * @param sess_name
     * @param data
     */
    setItem: function (sess_name, data) {
        let sess_obj = {
            since : Math.floor(Date.now()),
            data : data
        }
        sessionStorage.setItem(sess_name, JSON.stringify(sess_obj));
    },

    /**
     * 세션 스토리지 조회
     * @param sess_name
     * @param 시간 - 초단위
     * @return json : gap - 시간차이 (millisecond), data - 데이터
     */
    getItem: function (sess_name, time) {
        let sess = sessionStorage.getItem(sess_name);
        if (sess == null){
            //return null;
            return {"cache" : false};
        } else {
            let sess_obj = JSON.parse(sess);
            let data = sess_obj.data;
            let gap = new Date().getTime() - new Date(sess_obj.since).getTime();

            if (gap > time * 1000) {
                return {"cache": false, "data": null};
            }
            return {"cache" : true, "data": data};
        }
    }


};
