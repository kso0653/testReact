import $ from "jquery";
import "jquery.cookie";
import Lang from "./lang";
import Validation from "./validation";

import LUXDialog from "luna-rocket/LUXDialog";

const globals = require("../config/" + process.env.BUILD_ENV + "/Portal/globals");
const commonSynapOfficeUrl = `${globals.unCertApiUrl}/ObjectStorageCommon`;
const weDriveSynapOfficeUrl = `${globals.unCertApiUrl}/WeDriveStorage`;
// const synapOfficeUrl = `${globals.unCertApiUrl}/SynapOffice`;

export function OpenSynapOffice({oAuthTokenID=$.cookie("AUTH_A_TOKEN"), fid, isWedrive=false, fileName="", readOnly=false}) {
    // oAuthTokenID = 토큰
    // fid = fileUniqueKey
    // isWedrive = 웹스토리지 여부
    // fileName = 파일명
    // readOnly = 읽기모드여부(true: 읽기모드, false: 편집모드)
    console.info("^^^^^ OpenSynapOffice ::: ", {oAuthTokenID, fid, isWedrive, fileName, readOnly});
    if (Validation.checkEmpty(fid) || Validation.checkEmpty(fileName)) {
        LUXDialog.alert('비정상적인 접근입니다.', {type: 'warning'});
        return;
    }

    let idx = fileName.lastIndexOf(".");
    let ext = "";
    if (idx > 0)
        ext = fileName.substring(idx+1).toLowerCase();

    // 지원 가능 확장자
    let docType = "";
    if (["doc", "docx", "hwp"].includes(ext)) {  // 워드
        docType = "word";
    } else if (["ppt", "pptx"].includes(ext)) {  // 슬라이드
        docType = "slide";
    } else if (["xls", "xlsx"].includes(ext)) {  // 셀
        docType = "cell";
    } else {
        LUXDialog.alert("OFFICE 파일 종류가 아닙니다.", {type: "error"});
        return;
    }

    // 다국어
    const currentLanguage = Lang.getLanguage(false);

    // 읽기모드여부(true: 읽기모드, false: 편집모드)
    let permission = readOnly ? "R" : "W";

    let url = isWedrive ? `${weDriveSynapOfficeUrl}` : `${commonSynapOfficeUrl}`;
    url += `/openDoc.cmd`;
    url += `?fid=${fid}`;
    url += `&oAuthTokenID=${oAuthTokenID}`;
    url += `&isWedrive=${isWedrive}`;
    url += `&lang=${currentLanguage}`;
    url += `&permission=${permission}`;
    console.info("### OpenSynapOffice - url ::: ", url);
    window.open(url, "_blank");
}

export function NewSynapOffice({oAuthTokenID=$.cookie("AUTH_A_TOKEN"), fid, isWedrive=false, fileName="", readOnly=false}) {
    // oAuthTokenID = 토큰
    // fid = fileUniqueKey
    // isWedrive = 웹스토리지 여부
    // fileName = 파일명
    // readOnly = 읽기모드여부(true: 읽기모드, false: 편집모드)
    console.info("^^^^^ NewSynapOffice ::: ", {oAuthTokenID, fid, isWedrive, fileName, readOnly});
    if (Validation.checkEmpty(fid) || Validation.checkEmpty(fileName)) {
        LUXDialog.alert('비정상적인 접근입니다.', {type: 'warning'});
        return;
    }

    let idx = fileName.lastIndexOf(".");
    let ext = "";
    if (idx > 0)
        ext = fileName.substring(idx+1).toLowerCase();

    // 지원 가능 확장자
    let docType = "";
    if (["doc", "docx", "hwp"].includes(ext)) {  // 워드
        docType = "word";
    } else if (["ppt", "pptx"].includes(ext)) {  // 슬라이드
        docType = "slide";
    } else if (["xls", "xlsx"].includes(ext)) {  // 셀
        docType = "cell";
    } else {
        LUXDialog.alert("OFFICE 파일 종류가 아닙니다.", {type: "error"});
        return;
    }

    // 다국어
    const currentLanguage = Lang.getLanguage(false);

    // 읽기모드여부(true: 읽기모드, false: 편집모드)
    let permission = readOnly ? "R" : "W";

    let url = isWedrive ? `${weDriveSynapOfficeUrl}` : `${commonSynapOfficeUrl}`;
    url += `/${docType}/newDoc.cmd`;
    url += `?fid=${fid}`;
    url += `&oAuthTokenID=${oAuthTokenID}`;
    url += `&isWedrive=${isWedrive}`;
    url += `&lang=${currentLanguage}`;
    url += `&permission=${permission}`;
    console.info("### NewSynapOffice - url ::: ", url);
    window.open(url, "_blank");
}