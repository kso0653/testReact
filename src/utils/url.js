// import $ from 'jquery';

export default {

    /**
     * url 파라미터
     */
    getUrlParams: function () {
        var params = {};
        document.location.hash.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) { params[key] = value; });
        return params;
    },

    /**
     * 썸네일 이미지 변경
     */
    getThumbnailUrl: function (profile_url, type) {
        if(typeof profile_url !== "string"){
            return profile_url;
        }

        if(typeof type !== "string" || type === "") {
            type = "sm"
        }

        type = type.indexOf("_") === 0 ? type : ("_" + type);

        if(profile_url.lastIndexOf(".") > -1) {
            profile_url = profile_url.substring(0, profile_url.lastIndexOf("."))+type+profile_url.substring(profile_url.lastIndexOf("."), profile_url.length);
        } else {
            profile_url = profile_url+type;
        }
        return profile_url;
    },

    /**
     * 썸네일 이미지 변경 (sm)
     */
    getThumbnailUrlSm: function (profile_url) {
        profile_url = this.getThumbnailUrl(profile_url, "sm");
        return profile_url;
    },

    /**
     * 썸네일 이미지 변경 (ss)
     */
    getThumbnailUrlSs: function (profile_url) {
        profile_url = this.getThumbnailUrl(profile_url, "ss");
        return profile_url;
    },

    /**
     * smartA 서비스 코드
     */
    getSmartAServiceCode: function () {

        let serviceCode = "";
        let location = document.location;
        try {
            if(location.hash.indexOf("smarta") > -1) {
                serviceCode = 'smarta';
            }
            return serviceCode;

        } catch (e) {
            console.log(e);
            return "";
        }
    },
};
