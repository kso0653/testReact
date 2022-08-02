import $ from "jquery";

export const WEHAGO_CLUB_MEMBERSHIP_CODE = ["WH3", "WH4", "WC", "WC1"];
export const WEHAGO_FREE_MEMBERSHIP_CODE = ["WF", "WFP"];
export const WEHAGO_PRO_MEMBERSHIP_CODE = ["WP"];
export const WEHAGO_SINGLE_PACK_MEMBERSHIP_CODE = ["SP"];
export const WEHAGO_HYBRID_MEMBERSHIP_CODE = ["WH", "WH2"];
export const WEHAGO_ACE_MEMBERSHIP_CODE = ["WH3", "WH4"];
export const WEHAGO_T_MEMBERSHIP_CODE = ["WT", "WT1"];
export const WEHAGO_T_EDGE_MEMBERSHIP_CODE = ["WE"];
export const WEHAGO_V_MEMBERSHIP_CODE = ["WV"];
export const WEHAGO_HOMEFFICE_MEMBERSHIP_CODE = ["DT"];
export const WEHAGO_L_MEMBERSHIP_CODE = ["WL"];

export const WEHAGO_CLUB_MEMBERSHIP_NAME = "WEHAGO Club";
export const WEHAGO_FREE_MEMBERSHIP_NAME = "FREE";
export const WEHAGO_FREE_PLUS_MEMBERSHIP_NAME = "FREE+";
export const WEHAGO_PRO_MEMBERSHIP_NAME = "WEHAGO PRO";
export const WEHAGO_SINGLE_PACK_MEMBERSHIP_NAME = "WEHAGO SinglePack";
export const WEHAGO_HYBRID_MEMBERSHIP_NAME = "WEHAGO Hybrid";
export const WEHAGO_ACE_MEMBERSHIP_NAME = "WEHAGO ACE";
export const WEHAGO_T_MEMBERSHIP_NAME = "WEHAGO T";
export const WEHAGO_TAX_ACCOUNTANT_MEMBERSHIP_NAME = "WEHAGO TAX Accountant";
export const WEHAGO_T_EDGE_MEMBERSHIP_NAME = "T EDGE";
export const WEHAGO_V_MEMBERSHIP_NAME = "WEHAGO V";
export const WEHAGO_HOMEFFICE_MEMBERSHIP_NAME = "Homeffice All-in-one";
export const WEHAGO_L_MEMBERSHIP_NAME = "WEHAGO L";

/**
 * sessionStorage 에 있는 멤버쉽코드 반환. 멤버쉽코드 없으면 null 반환
 * @author 김범진A
 * @returns {string|null}
 */
export function getMembershipCode() {
    const companyNo = $('#h_selected_company_no').val();
    
    if(!companyNo && companyNo !== 0)
        return null;

    return sessionStorage.getItem(companyNo + "-membership_code");
}

/**
 * membershipCode 가 WEHAGO Club 멤버쉽코드 인지 여부 반환. 멤버쉽코드 없으면 null 반환
 * @author 김범진A
 * @param {string} membershipCode 멤버쉽코드
 * @returns {boolean | null}
 */
export function isWehagoClubMemberShip(membershipCode) {
    return isRightMembershipCode(WEHAGO_CLUB_MEMBERSHIP_NAME, membershipCode);
}

/**
 * membershipCode 가 WEHAGO Free 또는 Free+ 멤버쉽코드 인지 여부 반환. 멤버쉽코드 없으면 null 반환
 * @author 김범진A
 * @param {string} membershipCode 멤버쉽코드
 * @returns {boolean | null}
 */
export function isWehagoFreeMemberShip(membershipCode) {
    return isRightMembershipCode(WEHAGO_FREE_MEMBERSHIP_NAME, membershipCode);
}

/**
 * membershipCode 가 WEHAGO Pro 멤버쉽코드 인지 여부 반환. 멤버쉽코드 없으면 null 반환
 * @author 김범진A
 * @param {string} membershipCode 멤버쉽코드
 * @returns {boolean | null}
 */
export function isWehagoProMemberShip(membershipCode) {
    return isRightMembershipCode(WEHAGO_PRO_MEMBERSHIP_NAME, membershipCode);
}

/**
 * membershipCode 가 WEHAGO Pro 멤버쉽코드 인지 여부 반환. 멤버쉽코드 없으면 null 반환
 * @author 김범진A
 * @param {string} membershipCode 멤버쉽코드
 * @returns {boolean | null}
 */
export function isWehagoSinglePackMemberShip(membershipCode) {
    return isRightMembershipCode(WEHAGO_SINGLE_PACK_MEMBERSHIP_NAME, membershipCode);
}

/**
 * membershipCode 가 WEHAGO T edge 멤버쉽코드 인지 여부 반환. 멤버쉽코드 없으면 null 반환
 * @author 김범진A
 * @param {string} membershipCode 멤버쉽코드
 * @returns {boolean | null}
 */
export function isWehagoTEdgeMemberShip(membershipCode) {
    return isRightMembershipCode(WEHAGO_T_EDGE_MEMBERSHIP_NAME, membershipCode);
}

/**
 * membershipCode 가 WEHAGO Hybrid 멤버쉽코드 인지 여부 반환. 멤버쉽코드 없으면 null 반환
 * @author 김범진A
 * @param {string} membershipCode 멤버쉽코드
 * @returns {boolean | null}
 */
export function isWehagoHybridMemberShip(membershipCode) {
    return isRightMembershipCode(WEHAGO_HYBRID_MEMBERSHIP_NAME, membershipCode);
}

/**
 * membershipCode 가 WEHAGO V 멤버쉽코드 인지 여부 반환. 멤버쉽코드 없으면 null 반환
 * @author 김범진A
 * @param {string} membershipCode 멤버쉽코드
 * @returns {boolean | null}
 */
export function isWehagoVMemberShip(membershipCode) {
    return isRightMembershipCode(WEHAGO_V_MEMBERSHIP_NAME, membershipCode);
}

/**
 * membershipCode 가 WEHAGO T 멤버쉽코드 인지 여부 반환. 멤버쉽코드 없으면 null 반환
 * @author 김범진A
 * @param {string} membershipCode 멤버쉽코드
 * @returns {boolean | null}
 */
export function isWehagoTMemberShip(membershipCode) {
    return isRightMembershipCode(WEHAGO_T_MEMBERSHIP_NAME, membershipCode); 
}

/**
 * membershipCode 가 WEHAGO L 멤버쉽코드 인지 여부 반환. 멤버쉽코드 없으면 null 반환
 * @author 권찬울
 * @param {string} membershipCode 멤버쉽코드
 * @returns {boolean | null}
 */
export function isWehagoLMemberShip(membershipCode) {
    return isRightMembershipCode(WEHAGO_L_MEMBERSHIP_NAME, membershipCode);
}

/**
 * membershipCode 가 WEHAGO ACE 멤버쉽코드 인지 여부 반환. 멤버쉽코드 없으면 null 반환
 * @author 권찬울
 * @param {string} membershipCode 멤버쉽코드
 * @returns {boolean | null}
 */
export function isWehagoAceMemberShip(membershipCode) {
    return isRightMembershipCode(WEHAGO_ACE_MEMBERSHIP_NAME, membershipCode);
}

/**
 * 멤버쉽 코드 반환
 * @param {string} membershipName 멤버쉽 이름(예: WEHAGO T)
 * @param {string} membershipCode 멤버쉽 코드(예: WT1)
 * @returns {boolean|null}
 */
function isRightMembershipCode(membershipName, membershipCode) {
    if(!membershipCode)
        return null;
    
    if(typeof membershipName !== 'string')
        return null;
    
    if(typeof membershipCode !== 'string')
        return null;
    
    membershipCode = membershipCode.toUpperCase();
    
    switch (membershipName) {
        // WEHAGO Club
        case WEHAGO_CLUB_MEMBERSHIP_NAME:
            return WEHAGO_CLUB_MEMBERSHIP_CODE.includes(membershipCode);
    
        // WEHAGO Free
        case WEHAGO_FREE_MEMBERSHIP_NAME:
        case WEHAGO_FREE_PLUS_MEMBERSHIP_NAME:
            return WEHAGO_FREE_MEMBERSHIP_CODE.includes(membershipCode);
            
        // WEHAGO PRO
        case WEHAGO_PRO_MEMBERSHIP_NAME:
            return WEHAGO_PRO_MEMBERSHIP_CODE.includes(membershipCode);

        // WEHAGO SinglePack
        case WEHAGO_SINGLE_PACK_MEMBERSHIP_NAME:
            return WEHAGO_SINGLE_PACK_MEMBERSHIP_CODE.includes(membershipCode);
    
        // WEHAGO T Edge
        case WEHAGO_T_EDGE_MEMBERSHIP_NAME:
            return WEHAGO_T_EDGE_MEMBERSHIP_CODE.includes(membershipCode);
            
        // WEHAGO Hybrid
        case WEHAGO_HYBRID_MEMBERSHIP_NAME:
            return WEHAGO_HYBRID_MEMBERSHIP_CODE.includes(membershipCode);

        // WEHAGO ACE
        case WEHAGO_ACE_MEMBERSHIP_NAME:
            return WEHAGO_ACE_MEMBERSHIP_CODE.includes(membershipCode);
    
        // WEHAGO T
        case WEHAGO_T_MEMBERSHIP_NAME:
        case WEHAGO_TAX_ACCOUNTANT_MEMBERSHIP_NAME:
            return WEHAGO_T_MEMBERSHIP_CODE.includes(membershipCode);
            
        // WEHAGO V
        case WEHAGO_V_MEMBERSHIP_NAME:
            return WEHAGO_V_MEMBERSHIP_CODE.includes(membershipCode);

        // WEHAGO L
        case WEHAGO_L_MEMBERSHIP_NAME:
            return WEHAGO_L_MEMBERSHIP_CODE.includes(membershipCode);
    }
    
    return null;
}

/**
 * membershipCode 가 WEHAGO Club 멤버쉽코드 인지 여부 반환. 멤버쉽코드 없으면 null 반환
 * @author 권찬울
 * @param {string} membershipCode 멤버쉽코드
 * @returns {string} membershipName 맴버쉽명
 */
export function getMemberShipName(membershipCode) {
    // 검증 로직
    if (!membershipCode) {
        return "";
    }

    // 실제 로직
    let membershipName = ""
    membershipCode = membershipCode.toUpperCase();

    if(WEHAGO_CLUB_MEMBERSHIP_CODE.includes(membershipCode)) {
        // WEHAGO CLUB
        membershipName = WEHAGO_CLUB_MEMBERSHIP_NAME;
    } else if (WEHAGO_FREE_MEMBERSHIP_CODE.includes(membershipCode)) {
        // WEHAGO Free
        membershipName = WEHAGO_FREE_MEMBERSHIP_NAME;
    } else if (WEHAGO_PRO_MEMBERSHIP_CODE.includes(membershipCode)) {
        // WEHAGO PRO
        membershipName = WEHAGO_PRO_MEMBERSHIP_NAME;
    } else if (WEHAGO_SINGLE_PACK_MEMBERSHIP_CODE.includes(membershipCode)) {
        // WEHAGO SinglePack
        membershipName = WEHAGO_SINGLE_PACK_MEMBERSHIP_NAME;
    } else if (WEHAGO_T_EDGE_MEMBERSHIP_CODE.includes(membershipCode)) {
        // WEHAGO T Edge
        membershipName = WEHAGO_T_EDGE_MEMBERSHIP_NAME;
    } else if (WEHAGO_HYBRID_MEMBERSHIP_CODE.includes(membershipCode)) {
        // WEHAGO Hybrid
        membershipName = WEHAGO_HYBRID_MEMBERSHIP_NAME;
    } else if (WEHAGO_ACE_MEMBERSHIP_CODE.includes(membershipCode)) {
        // WEHAGO ACE
        membershipName = WEHAGO_ACE_MEMBERSHIP_NAME;
    } else if (WEHAGO_T_MEMBERSHIP_CODE.includes(membershipCode)) {
        // WEHAGO T
        membershipName = WEHAGO_T_MEMBERSHIP_NAME;
    } else if (WEHAGO_V_MEMBERSHIP_CODE.includes(membershipCode)) {
        // WEHAGO V
        membershipName = WEHAGO_V_MEMBERSHIP_NAME;
    } else if (WEHAGO_L_MEMBERSHIP_CODE.includes(membershipCode)) {
        // WEHAGO L
        membershipName = WEHAGO_L_MEMBERSHIP_NAME;
    }

    return membershipName;
}
