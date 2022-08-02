/**
 * console utils
 * @author by cukwon
 * # Bug : 콘솔 위치 미 출력되는 이슈 존재 ( 추가 수정 필요 )
 */

const serverEnv = process.env.BUILD_ENV;

const invisibleServiceList = ['production', 'wehagov']; // 콘솔 미출력 서버 (운영 서버)
// const invisibleServiceList = ['local', 'dev'];  // 테스트 용도 (개발 서버)

const wehagoConsole = (callback) => {
    let isVisible = !(invisibleServiceList.includes(serverEnv))
    // isVisible = true // 테스트 용도 ( 화면 노출 )
    // isVisible = false // 테스트 용도 ( 화면 미노출 )
    if(isVisible) {
        callback();
    };
}

export default {
    wehagoConsole : wehagoConsole,
    // memory: any;
    // assert(condition?: boolean, message?: string, ...data: any[]): void;
    assert: (condition, message, ...data) => {
        wehagoConsole(() => console.assert(condition, message, ...data));
    },
    // clear(): void;
    clear: () => {
        wehagoConsole(() => console.clear())
    },
    // count(label?: string): void;
    count: (label) => {
        wehagoConsole(() => console.count(label));
    },
    // debug(message?: any, ...optionalParams: any[]): void;
    debug: (message, ...optionalParams) => {
        wehagoConsole(() => console.debug(message, ...optionalParams))
    },
    // dir(value?: any, ...optionalParams: any[]): void;
    dir: (value, ...optionalParams) => {
        wehagoConsole(() => console.dir(value, ...optionalParams))
    },
    // dirxml(value: any): void;
    dirxml: (value) => {
        wehagoConsole(() => console.dirxml(value))
    },
    // error(message?: any, ...optionalParams: any[]): void;
    error: (message, ...optionalParams) => {
        wehagoConsole(() => console.error(message, ...optionalParams))
    },
    // exception(message?: string, ...optionalParams: any[]): void;
    exception: (message, ...optionalParams) => {
        wehagoConsole(() => console.exception(message, ...optionalParams))
    },
    // group(groupTitle?: string, ...optionalParams: any[]): void;
    group: (groupTitle, ...optionalParams) => {
        wehagoConsole(() => console.group(groupTitle, ...optionalParams))
    },
    // groupCollapsed(groupTitle?: string, ...optionalParams: any[]): void;
    groupCollapsed: (groupTitle, ...optionalParams) => {
        wehagoConsole(() => console.groupCollapsed(groupTitle, ...optionalParams))
    },
    // groupEnd(): void;
    groupEnd: () => {
        wehagoConsole(() => console.groupEnd())
    },
    // info(message?: any, ...optionalParams: any[]): void;
    info: (message, ...optionalParams) => {
        wehagoConsole(() => console.info(message, ...optionalParams))
    },
    // log(message?: any, ...optionalParams: any[]): void;
    log: (message, ...optionalParams) => {
        wehagoConsole(() => console.log(message, ...optionalParams))
    },
    // markTimeline(label?: string): void;
    markTimeline: (label) => {
        wehagoConsole(() => console.markTimeline(label))
    },
    // profile(reportName?: string): void;
    profile: (reportName) => {
        wehagoConsole(() => console.profile(reportName))
    },
    // profileEnd(reportName?: string): void;
    profileEnd: (reportName) => {
        wehagoConsole(() => console.profileEnd(reportName))
    },
    // table(...tabularData: any[]): void;
    table: (tabularData) => {
        wehagoConsole(() => console.table(tabularData))
    },
    // time(label?: string): void;
    time: (label) => {
        wehagoConsole(() => console.time(label))
    },
    // timeEnd(label?: string): void;
    timeEnd: (label) => {
        wehagoConsole(() => console.timeEnd(label))
    },
    // timeStamp(label?: string): void;
    timeStamp: (label) => {
        wehagoConsole(() => console.timeStamp(label))
    },
    // timeline(label?: string): void;
    timeline: (label) => {
        wehagoConsole(() => console.timeline(label))
    },
    // timelineEnd(label?: string): void;
    timelineEnd: (label) => {
        wehagoConsole(() => console.timelineEnd(label))
    },
    // trace(message?: any, ...optionalParams: any[]): void;
    trace: (message, ...optionalParams) => {
        wehagoConsole(() => console.trace(message, ...optionalParams))
    },
    // warn(message?: any, ...optionalParams: any[]): void;
    warn: (message, ...optionalParams) => {
        wehagoConsole(() => console.warn(message, ...optionalParams))
    },
};
