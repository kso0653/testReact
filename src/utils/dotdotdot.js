/**
 * Created by parkjeonghyun on 2017. 4. 26..
 */
/**
 * 말줄임
 */
import $ from 'jquery'

export default {
    setDotdotdot: function () {

        if ($.fn.dotdotdot) {
            return;
        }

        $.fn.dotdotdot = function (o) {
            if (this.length === 0) {
                if (!o || o.debug !== false) {
                    debug(true, 'No element found for "' + this.selector + '".');
                }
                return this;
            }
            if (this.length > 1) {
                return this.each(
                    function () {
                        $(this).dotdotdot(o);
                    }
                );
            }


            let $dot = this;

            if ($dot.data('dotdotdot')) {
                $dot.trigger('destroy.dot');
            }

            $dot.data('dotdotdot-style', $dot.attr('style') || '');
            $dot.css('word-wrap', 'break-word');
            if ($dot.css('white-space') === 'nowrap') {
                $dot.css('white-space', 'normal');
            }

            $dot.bind_events = function () {
                $dot.bind(
                    'update.dot',
                    function (e, c) {
                        e.preventDefault();
                        e.stopPropagation();

                        opts.maxHeight = ( typeof opts.height === 'number' )
                            ? opts.height
                            : getTrueInnerHeight($dot);

                        opts.maxHeight += opts.tolerance;

                        if (typeof c !== 'undefined') {
                            if (typeof c === 'string' || c instanceof HTMLElement) {
                                c = $('<div />').append(c).contents();
                            }
                            if (c instanceof $) {
                                orgContent = c;
                            }
                        }

                        $inr = $dot.wrapInner('<div class="dotdotdot" />').children();
                        $inr.empty()
                            .append(orgContent.clone(true))
                            .find('br').replaceWith('  <br />  ').end()
                            .css({
                                'height': 'auto',
                                'width': 'auto',
                                'border': 'none',
                                'padding': 0,
                                'margin': 0,
                            });

                        let after = false,
                            trunc = false;

                        if (conf.afterElement) {
                            after = conf.afterElement.clone(true);
                            after.show();
                            conf.afterElement.remove();
                        }
                        if (test($inr, opts)) {
                            if (opts.wrap === 'children') {
                                trunc = children($inr, opts, after);
                            }
                            else {
                                trunc = ellipsis($inr, $dot, $inr, opts, after);
                            }
                        }
                        $inr.replaceWith($inr.contents());
                        $inr = null;

                        if ($.isFunction(opts.callback)) {
                            opts.callback.call($dot[0], trunc, orgContent);
                        }

                        conf.isTruncated = trunc;
                        return trunc;
                    }
                ).bind(
                    'isTruncated.dot',
                    function (e, fn) {
                        e.preventDefault();
                        e.stopPropagation();

                        if (typeof fn === 'function') {
                            fn.call($dot[0], conf.isTruncated);
                        }
                        return conf.isTruncated;
                    }
                ).bind(
                    'originalContent.dot',
                    function (e, fn) {
                        e.preventDefault();
                        e.stopPropagation();

                        if (typeof fn === 'function') {
                            fn.call($dot[0], orgContent);
                        }
                        return orgContent;
                    }
                ).bind(
                    'destroy.dot',
                    function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        $dot.unwatch()
                            .unbind_events()
                            .empty()
                            .append(orgContent)
                            .attr('style', $dot.data('dotdotdot-style') || '')
                            .data('dotdotdot', false);
                    }
                );
                return $dot;
            };	//	/bind_events

            $dot.unbind_events = function () {
                $dot.unbind('.dot');
                return $dot;
            };	//	/unbind_events

            $dot.watch = function () {
                $dot.unwatch();
                if (opts.watch === 'window') {
                    let $window = $(window),
                        _wWidth = $window.width(),
                        _wHeight = $window.height();

                    $window.bind(
                        'resize.dot' + conf.dotId,
                        function () {
                            if (_wWidth !== $window.width() || _wHeight !== $window.height() || !opts.windowResizeFix) {
                                _wWidth = $window.width();
                                _wHeight = $window.height();

                                if (watchInt) {
                                    clearInterval(watchInt);
                                }
                                watchInt = setTimeout(
                                    function () {
                                        $dot.trigger('update.dot');
                                    }, 10
                                );
                            }
                        }
                    );
                }
                else {
                    watchOrg = getSizes($dot);
                    watchInt = setInterval(
                        function () {
                            let watchNew = getSizes($dot);
                            if (watchOrg.width !== watchNew.width ||
                                watchOrg.height !== watchNew.height) {
                                $dot.trigger('update.dot');
                                watchOrg = getSizes($dot);
                            }
                        }, 100
                    );
                }
                return $dot;
            };
            $dot.unwatch = function () {
                $(window).unbind('resize.dot' + conf.dotId);
                if (watchInt) {
                    clearInterval(watchInt);
                }
                return $dot;
            };

            let orgContent = $dot.contents(),
                opts = $.extend(true, {}, $.fn.dotdotdot.defaults, o),
                conf = {},
                watchOrg = {},
                watchInt = null,
                $inr = null;


            if (!( opts.lastCharacter.remove instanceof Array )) {
                opts.lastCharacter.remove = $.fn.dotdotdot.defaultArrays.lastCharacter.remove;
            }
            if (!( opts.lastCharacter.noEllipsis instanceof Array )) {
                opts.lastCharacter.noEllipsis = $.fn.dotdotdot.defaultArrays.lastCharacter.noEllipsis;
            }


            conf.afterElement = getElement(opts.after, $dot);
            conf.isTruncated = false;
            conf.dotId = dotId++;


            $dot.data('dotdotdot', true)
                .bind_events()
                .trigger('update.dot');

            if (opts.watch) {
                $dot.watch();
            }

            return $dot;
        };


        //	public
        $.fn.dotdotdot.defaults = {
            'ellipsis': '... ',
            'wrap': 'word',
            'fallbackToLetter': true,
            'lastCharacter': {},
            'tolerance': 0,
            'callback': null,
            'after': null,
            'height': null,
            'watch': false,
            'windowResizeFix': true,
            'debug': false,
        };
        $.fn.dotdotdot.defaultArrays = {
            'lastCharacter': {
                'remove': [' ', '\u3000', ',', ';', '.', '!', '?'],
                'noEllipsis': [],
            },
        };


        //	private
        let dotId = 1;

        function children($elem, o, after) {
            let $elements = $elem.children(),
                isTruncated = false;

            $elem.empty();

            for (let a = 0, l = $elements.length; a < l; a++) {
                let $e = $elements.eq(a);
                $elem.append($e);
                if (after) {
                    $elem.append(after);
                }
                if (test($elem, o)) {
                    $e.remove();
                    isTruncated = true;
                    break;
                }
                else {
                    if (after) {
                        after.detach();
                    }
                }
            }
            return isTruncated;
        }

        function ellipsis($elem, $d, $i, o, after) {
            let $elements = $elem.contents(),
                isTruncated = false;

            $elem.empty();

            let notx = 'table, thead, tbody, tfoot, tr, col, colgroup, object, embed, param, ol, ul, dl, blockquote, select, optgroup, option, textarea, script, style';
            for (let a = 0, l = $elements.length; a < l; a++) {

                if (isTruncated) {
                    break;
                }

                let e = $elements[a],
                    $e = $(e);

                if (typeof e === 'undefined' || ( e.nodeType === 3 && $.trim(e.data).length === 0 )) {
                    continue;
                }

                $elem.append($e);
                if (after) {
                    $elem[$elem.is(notx) ? 'after' : 'append'](after);
                }
                if (test($i, o)) {
                    if (e.nodeType === 3) // node is TEXT
                    {
                        isTruncated = ellipsisElement($e, $d, $i, o, after);
                    }
                    else {
                        isTruncated = ellipsis($e, $d, $i, o, after);
                    }

                    if (!isTruncated) {
                        $e.remove();
                        isTruncated = true;
                    }
                }

                if (!isTruncated) {
                    if (after) {
                        after.detach();
                    }
                }
            }
            return isTruncated;
        }

        function ellipsisElement($e, $d, $i, o, after) {
            let e = $e[0];

            if (!e) {
                return false;
            }

            let txt = getTextContent(e),
                space = ( txt.indexOf(' ') !== -1 ) ? ' ' : '\u3000',
                separator = ( o.wrap === 'letter' ) ? '' : space,
                textArr = txt.split(separator),
                position = -1,
                midPos = -1,
                startPos = 0,
                endPos = textArr.length - 1;

            if (o.fallbackToLetter && endPos === 0 && endPos === startPos) {
                separator = '';
                textArr = txt.split(separator);
                endPos = textArr.length - 1;
            }

            while (startPos <= endPos && !( startPos === 0 && endPos === 0 )) {
                let m = Math.floor(( startPos + endPos ) / 2);
                if (m === midPos) {
                    break;
                }
                midPos = m;

                setTextContent(e, textArr.slice(0, midPos + 1).join(separator) + o.ellipsis);

                if (!test($i, o)) {
                    position = midPos;
                    startPos = midPos;
                }
                else {
                    endPos = midPos;
                }
            }

            if (position !== -1 && !( textArr.length === 1 && textArr[0].length === 0 )) {
                txt = addEllipsis(textArr.slice(0, position + 1).join(separator), o);
                setTextContent(e, txt);
            }
            else {
                let $w = $e.parent();
                $e.remove();

                let afterLength = ( after && after.closest($w).length ) ? after.length : 0;

                if ($w.contents().length > afterLength) {
                    e = findLastTextNode($w.contents().eq(-1 - afterLength), $d);
                }
                else {
                    e = findLastTextNode($w, $d, true);
                    if (!afterLength) {
                        $w.remove();
                    }
                }
                if (e) {
                    txt = addEllipsis(getTextContent(e), o);
                    setTextContent(e, txt);
                    if (afterLength && after) {
                        $(e).parent().append(after);
                    }
                }
            }

            return true;
        }

        function test($i, o) {
            return $i.innerHeight() > o.maxHeight;
        }

        function addEllipsis(txt, o) {
            while ($.inArray(txt.slice(-1), o.lastCharacter.remove) > -1) {
                txt = txt.slice(0, -1);
            }
            if ($.inArray(txt.slice(-1), o.lastCharacter.noEllipsis) < 0) {
                txt += o.ellipsis;
            }
            return txt;
        }

        function getSizes($d) {
            return {
                'width': $d.innerWidth(),
                'height': $d.innerHeight(),
            };
        }

        function setTextContent(e, content) {
            if (e.innerText) {
                e.innerText = content;
            }
            else if (e.nodeValue) {
                e.nodeValue = content;
            }
            else if (e.textContent) {
                e.textContent = content;
            }

        }

        function getTextContent(e) {
            if (e.innerText) {
                return e.innerText;
            }
            else if (e.nodeValue) {
                return e.nodeValue;
            }
            else if (e.textContent) {
                return e.textContent;
            }
            else {
                return "";
            }
        }

        function getPrevNode(n) {
            do
            {
                n = n.previousSibling;
            }
            while (n && n.nodeType !== 1 && n.nodeType !== 3);

            return n;
        }

        function findLastTextNode($el, $top, excludeCurrent) {
            let e = $el && $el[0], p;
            if (e) {
                if (!excludeCurrent) {
                    if (e.nodeType === 3) {
                        return e;
                    }
                    if ($.trim($el.text())) {
                        return findLastTextNode($el.contents().last(), $top);
                    }
                }
                p = getPrevNode(e);
                while (!p) {
                    $el = $el.parent();
                    if ($el.is($top) || !$el.length) {
                        return false;
                    }
                    p = getPrevNode($el[0]);
                }
                if (p) {
                    return findLastTextNode($(p), $top);
                }
            }
            return false;
        }

        function getElement(e, $i) {
            if (!e) {
                return false;
            }
            if (typeof e === 'string') {
                e = $(e, $i);
                return ( e.length )
                    ? e
                    : false;
            }
            return !e.jquery
                ? false
                : e;
        }

        function getTrueInnerHeight($el) {
            let h = $el.innerHeight(),
                a = ['paddingTop', 'paddingBottom'];

            for (let z = 0, l = a.length; z < l; z++) {
                let m = parseInt($el.css(a[z]), 10);
                if (isNaN(m)) {
                    m = 0;
                }
                h -= m;
            }
            return h;
        }

        function debug(d, m) {
            if (!d) {
                return false;
            }
            if (typeof m === 'string') {
                m = 'dotdotdot: ' + m;
            }
            else {
                m = ['dotdotdot:', m];
            }

            if (typeof window.console !== 'undefined') {
                if (typeof window.console.log !== 'undefined') {
                    window.console.log(m);
                }
            }
            return false;
        }


        //	override jQuery.html
        let _orgHtml = $.fn.html;
        $.fn.html = function (str) {
            if (str !== undefined && !$.isFunction(str) && this.data('dotdotdot')) {
                return this.trigger('update', [str]);
            }
            return _orgHtml.apply(this, arguments);
        };


        //	override jQuery.text
        let _orgText = $.fn.text;
        $.fn.text = function (str) {
            if (str !== undefined && !$.isFunction(str) && this.data('dotdotdot')) {
                str = $('<div />').text(str).html();
                return this.trigger('update', [str]);
            }
            return _orgText.apply(this, arguments);
        };
    },
}