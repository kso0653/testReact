import detector from "detector";

const getDeviceName = function() {
    // https://www.npmjs.com/package/detector
    return detector.device.name;
}

const getOsName = function() {
    // https://www.npmjs.com/package/detector
    return detector.os.name;
}

const getBrowserName = function() {
    // https://www.npmjs.com/package/detector
    return detector.browser.name;
}

const checkMobile = function () {
    let isMobile = false;
    const deviceName = getDeviceName();
    if (deviceName !== "pc" && deviceName !== "mac") {
        isMobile = true;
    }
    return isMobile;
}

export default {
    checkMobile : checkMobile,
    getDeviceName : getDeviceName,
    getOsName : getOsName,
    getBrowserName : getBrowserName,
};
