import $ from "jquery";
import "jquery.cookie";

export default function load(component, cb) {
    component.then(loadRouteDefault(cb))
        .catch((error) => {
            console.log("js load error - ", error);

            if (error.toString().indexOf("chunk") !== -1) {
                reloadWindow();
            } else if (error.props && error.props.toString().indexOf("chunk") !== -1) {
                //reloadWindow();
                // UI 배포로 인해 js 파일을 못찾을경우 강제 새로고침 실시한다.
                // 단, 무한 호출을 막기위해 5회로 제한하며 세션스토리지에서 관리한다.
                try {
                    let js_load_fail = sessionStorage.getItem("js_load_fail");
                    if (js_load_fail == null) {
                        sessionStorage.setItem("js_load_fail", "1");
                        window.location.reload(true);
                    } else {
                        js_load_fail = parseInt(sessionStorage.getItem("js_load_fail"));
                        if (js_load_fail < 3) {
                            sessionStorage.setItem("js_load_fail", String(js_load_fail + 1));
                            window.location.reload(true);
                        } else {
                            reloadWindow();
                        }
                    }
                } catch (e) {
                    console.log("js_load_fail");
                    reloadWindow();
                }
            } else {
                throw error;
            }
        })
}

export function reloadWindow() {
    if (sessionStorage.getItem("reload") === null) {
        sessionStorage.setItem("reload", "T");
        window.location.reload(true);
    } else if (sessionStorage.getItem("reload") === "T") {
        sessionStorage.setItem("reload", "F");
        // eslint-disable-next-line no-restricted-globals
        location.href = window.location.origin + '/error404.html';
    }
}

function loadRouteDefault(cb) {
    return (module) => {
        cb(null, module.default);
        return module;
    }
}
