/**
 * selection 반환
 * @author 김범진A
 * @returns {Selection}
 */
export function getSelection() {
    if (window.getSelection) {
        return window.getSelection();
    }
    else if (document.getSelection) {
        return document.getSelection();
    }
    // IE < 9
    else {
        let selection = document.selection;

        if (selection) {
            return selection;
        }
    }

    return null;
}

/**
 * Range 반환
 * @author 김범진A
 * @param {Selection} [selection='getSelection()']
 * @returns {Range}
 */
export function getRange(selection=getSelection()) {
    if(!selection)
        return null;

    let range;

    if(selection.createRange) {
        range = selection.createRange();
    }
    else if(selection.getRangeAt) {
        if(selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
        }
    }

    if(!range) {
        if(document.createRange) {
            range = document.createRange();
        }
        // IE < 9
        else if(document.body.createTextRange) {
            range = document.body.createTextRange;
        }
    }

    if(range) {
        range.collapse(true);
    }

    return range;
}

/**
 * 커서 위치 설정
 * @author 김범진A
 * @param {Node} startNode 시작 Node
 * @param {number} startOffset 시작 Node의 길이
 * @param {Node} [endNode='StartNode'] 종료 Node
 * @param {number} [endOffset='StartOffset'] 종료 Node의 길이
 * @param {Selection} [selection='getSelection()']
 * @param {Range} [range='getRange()']
 * @return {*}
 */
export function setRangeStart({startNode, startOffset, endNode, endOffset, selection=getSelection(), range=getRange()}) {
    if(!selection) return;
    if(!range) return;
    if(!startNode instanceof Node) return;
    if(!startOffset && startOffset !== 0) return;

    range.setStart(startNode, startOffset);

    if(endNode && endNode instanceof Node) {
        if(!endOffset && endOffset !== 0) {
            endOffset = 0;
        }

        range.setEnd(endNode, endOffset);
    }
    else {
        range.setEnd(startNode, startOffset);
    }

    selection.removeAllRanges();
    selection.addRange(range);

    return range;
}

/**
 * 현재 커서 위치 반환
 * @author 김범진A
 * @param {string} [forcedNodeId] 커서 위치를 확인하고 싶은 Node ID. 커서가 Node ID에 위치 하지 않을 경우, forcedNodeId의 마지막 Node 정보 반환
 * @param {Selection} [sel='getSelection()'] Selection
 * @return {Object} {startNode, startOffset, endNode, endOffset}
 */
export function getCurrentPosition(forcedNodeId, sel=getSelection()) {
    if(!sel) return null;

    let nodeInfo;

    nodeInfo = {
        startNode: sel.anchorNode,
        startOffset: sel.anchorOffset,
        endNode: sel.focusNode,
        endOffset: sel.focusOffset,
    };

    if(forcedNodeId) {
        let parentNode = nodeInfo.startNode && nodeInfo.startNode.parentNode;
        let forcedNode = document.getElementById(forcedNodeId);

        // forcedNode 가 없으면 그대로 반환
        if(!forcedNode) {
            return nodeInfo
        }

        // Node가 forceNodeId 이면 그대로 반환
        if(nodeInfo.startNode && (nodeInfo.startNode.id === forcedNodeId)) {
            return nodeInfo;
        }

        // 부모 Node가 forceNodeId 이면 그대로 반환

        while(true) {
            if(!parentNode)
                break;

            if(parentNode.id === forcedNodeId)
                return nodeInfo;

            parentNode = parentNode.parentNode;
        }

        // forceNodeId 가 아닐 경우, forcedNodeId의 마지막 Node 정보 반환
        if(forcedNode.hasChildNodes()) {
            const lastChild = forcedNode.lastChild;
            const lastChildLen = lastChild.length;

            return {
                startNode: lastChild,
                startOffset: lastChildLen,
                endNode: lastChild,
                endOffset: lastChildLen,
            }
        }
        else {
            return {
                startNode: forcedNode,
                startOffset: 0,
                endNode: forcedNode,
                endOffset: 0,
            }
        }
    }

    return nodeInfo
}

/**
 * startNode 또는 endNode 의 After 로 range 설정. startNode 또는 endNode 둘 중 하나는 필수
 * @author 김범진A
 * @param {Node} [startNode]
 * @param {Node} [endNode]
 * @param {Selection} [selection='getSelection()']
 * @param {Range} [range='getRange()']
 * @returns {Range}
 */
export function setRangeAfter({startNode, endNode, selection=getSelection(), range=getRange()}) {
    if(!selection) return null;
    if(!range) return null;
    if(!startNode && !endNode) return null;
    if(startNode && !startNode instanceof Node) return null;
    if(endNode && !endNode instanceof Node) return null;

    if(startNode) {
        range.setStartAfter(startNode);
    }

    if(endNode) {
        range.setEndAfter(startNode);
    }

    selection.removeAllRanges();
    selection.addRange(range);

    return range;
}
