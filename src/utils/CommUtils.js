

let CommUtils = {

    // 그리드 자동 계산
    phoneFormatter(num, type){

        var afterStr = num.split('-');

        if(type === 1){
            return afterStr[0];
        } else if(type === 2){
            return afterStr[1];
        } else if(type === 3){
            return afterStr[2];
        }
        return num;
    },
    FormatPhone(phoneNum) {
        if(this.isPhone(phoneNum)) {
            var rtnNum;
            var regExp =/(02)([0-9]{3,4})([0-9]{4})$/;
            var myArray;
            if(regExp.test(phoneNum)){
                myArray = regExp.exec(phoneNum);
                rtnNum = myArray[1]+'-' + myArray[2]+'-'+myArray[3];
                return rtnNum;
            } else {
                regExp =/(0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/;
                if(regExp.test(phoneNum)){
                    myArray = regExp.exec(phoneNum);
                    rtnNum = myArray[1]+'-'+myArray[2]+'-'+myArray[3];
                    return rtnNum;
                } else {
                    return phoneNum;
                }
            }
        } else {
            return phoneNum;
        }
    },
    FormatMobile(phoneNum) {
        if (this.isMobile(phoneNum)) {
            var rtnNum;
            var regExp = /(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/;
            var myArray;
            if (regExp.test(phoneNum)) {
                myArray = regExp.exec(phoneNum);
                rtnNum = myArray[1] + '-' + myArray[2] + '-' + myArray[3];
                return rtnNum;
            } else {
                return phoneNum;
            }
        } else {
            return phoneNum;
        }
    },
    isMobile(phoneNum) {
        var regExp =/(01[016789])([1-9]{1}[0-9]{2,3})([0-9]{4})$/;
        var myArray;
        if(regExp.test(phoneNum)){
            myArray = regExp.exec(phoneNum);
            return true;
        } else {
            return false;
        }
    },
    isPhone(phoneNum) {
        var regExp =/(02)([0-9]{3,4})([0-9]{4})$/;
        var myArray;
        if(regExp.test(phoneNum)){
            myArray = regExp.exec(phoneNum);
            return true;
        } else {
            regExp =/(0[3-9]{1}[0-9]{1})([0-9]{3,4})([0-9]{4})$/;
            if(regExp.test(phoneNum)){
                myArray = regExp.exec(phoneNum);
                return true;
            } else {
                return false;
            }
        }
    }

};


export default CommUtils;
