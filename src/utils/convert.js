/**
 * format convert
 * @author by mpark
 */
import $ from 'jquery'

export default {
    mapToJson: function(map) {
        return JSON.stringify([...map]);
    },
    byteToUnit: function (bytes) {
        if (bytes === undefined || bytes === 0) return "0 Byte";

        bytes = parseInt(bytes);
        let s = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let e = Math.floor(Math.log(bytes) / Math.log(1024));

        if (e === "-Infinity") return "0 " + s[0];
        else
            return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2) + " " + s[e];
    },

    byteToSize: function (bytes) {
        if (bytes === undefined || bytes === 0) return "0 Byte";

        bytes = parseInt(bytes);
        let s = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let e = Math.floor(Math.log(bytes) / Math.log(1024));

        if (e === "-Infinity") return "0 " + s[0];
        else
            return (bytes / Math.pow(1024, Math.floor(e))).toFixed(2)
    },

    byteToSizeUnit: function (bytes) {
        if (bytes === undefined || bytes === 0) return "0 Byte";

        bytes = parseInt(bytes);
        let s = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let e = Math.floor(Math.log(bytes) / Math.log(1024));

        if (e === "-Infinity") return "0 " + s[0];
        else
            return s[e];
    },



    unitToByte: function (number, unit) {

        number = Number(number);
        let s = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB'];
        let e = s.indexOf(unit);

        return number * Math.pow(1024, e);
    },

    // form객체를 json object 형태로 변환.
    serializeObject: function (form) {
        let jsonObject = {};
        try {
            // this[0].tagName이 form tag일 경우
            if (form[0].tagName && form[0].tagName.toUpperCase() === "FORM") {
                let serializeArrayData = form.serializeArray();
                if (serializeArrayData) {
                    jsonObject = {};
                    $.each(serializeArrayData, function() {
                        // obj의 key값은 arr의 name, obj의 value는 value값
                        jsonObject[this.name] = this.value;
                    });
                }
            }
        } catch(e) {
            console.info("### serializeObject() - Error ::: ", e.message);
            return {};
        }
        return jsonObject;
    },


    blobToFile: function (blob, fileName) {
        return new File([blob], fileName);
    },

    //html 디코딩
    htmlDecode: function (input) {
        let e = document.createElement('div');
        e.innerHTML = input;
        return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue;
    },
};
