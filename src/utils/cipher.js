/**
 * Cipher Util
 * @author by d7kelz
 */
let CryptoJS = require("crypto-js");

export default {
    aes256Encrypt : function(plainText, key) {  // AES256 암호화
        let encStr = "";
        try {
            // 암호화
            plainText += ''
            encStr = CryptoJS.AES.encrypt(plainText, CryptoJS.enc.Utf8.parse(key), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            }).toString();
            // console.info("### CipherUtil - encrypt value :::", encStr);
        } catch (e) {
            encStr = null;
        }
        return encStr;
    },
    aes256Decrypt : function(cipherText, key) {  // AES256 복호화
        let decStr = "";
        try {
            // 복호화
            decStr = CryptoJS.AES.decrypt(cipherText, CryptoJS.enc.Utf8.parse(key), {
                mode: CryptoJS.mode.ECB,
                padding: CryptoJS.pad.Pkcs7,
            }).toString(CryptoJS.enc.Utf8);
            // console.info("### CipherUtil - decrypt value :::", decStr);
        } catch (e) {
            decStr = null;
        }
        return decStr;
    },
};
