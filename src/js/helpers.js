// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

(function($, APP, undefined) {
    /**
     * Форматирование чисел
     *
     * @param number
     * @param decimals
     * @param dec_point
     * @param thousands_sep
     * @returns {string}
     */
    APP.Helpers.numberFormat = function(number, decimals, dec_point, thousands_sep) {
        var i, j, kw, kd, km;

        // input sanitation & defaults
        if( isNaN(decimals = Math.abs(decimals)) ){
            decimals = 2;
        }
        if( dec_point == undefined ){
            dec_point = ",";
        }
        if( thousands_sep == undefined ){
            thousands_sep = ".";
        }

        i = parseInt(number = (+number || 0).toFixed(decimals)) + "";

        if( (j = i.length) > 3 ){
            j = j % 3;
        } else{
            j = 0;
        }

        km = (j ? i.substr(0, j) + thousands_sep : "");
        kw = i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands_sep);
        //kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).slice(2) : "");
        kd = (decimals ? dec_point + Math.abs(number - i).toFixed(decimals).replace(/-/, 0).slice(2) : "");


        return km + kw + kd;
    };

    /**
     * Форматирование цены
     *
     * @param price
     */
    APP.Helpers.price = function(price) {
        return APP.Helpers.numberFormat(price, 0, '.', ' ');
    };

    APP.Helpers.formattedPrice = function (price) {
        return APP.Helpers.price(price) + ' <span class="rub">i</span>';
    };



    /**
     * Аналог функции php htmlspecialchars
     *
     * @param text
     * @returns {XML|string}
     */
    APP.Helpers.htmlSpecialChars = function(text) {
        return text
            .replace(/&/ig, "&amp;")
            .replace(/</ig, "&lt;")
            .replace(/>/ig, "&gt;")
            .replace(/"/ig, "&quot;")
            .replace(/'/ig, "&#039;");
    };

    /**
     * Аналог функции php strip_tags
     *
     * @param text
     * @returns {XML|string|void|*}
     */
    APP.Helpers.stripTags = function(text) {
        return text.replace(/<\/?[^>]+>/gi, '');
    };

    /**
     * Возвращает true, если браузера поддерживает видео
     *
     * @returns {boolean}
     */
    APP.Helpers.supportsVideo = function() {
        return !!document.createElement('video').canPlayType;
    };

    /**
     * Возвращает true, если это тач-устройство
     * @returns {boolean|*}
     */
    APP.Helpers.isTouch = function() {
        return 'ontouchstart' in document.documentElement || navigator.msMaxTouchPoints;
    };

    /**
     * Окончание слов
     *
     * @param i
     * @param str1
     * @param str2
     * @param str3
     * @returns {*}
     */
    APP.Helpers.pluralForm = function(i, str1, str2, str3) {
        function plural(a) {
            if (a % 10 == 1 && a % 100 != 11) return 0;
            else if (a % 10 >= 2 && a % 10 <= 4 && (a % 100 < 10 || a % 100 >= 20)) return 1;
            else return 2;
        }

        switch (plural(i)) {
            case 0: return str1;
            case 1: return str2;
            default: return str3;
        }
    };

    /**
     * Параметры вызова fancybox
     *
     * @type {{padding: number, wrapCSS: string, fitToView: boolean, tpl: {closeBtn: string}, afterShow: Function}}
     */
    APP.Helpers.fancyOptions = {
        autoHeight: true,
        closeClick: false,
        autoCenter: true,
        openSpeed: 400,
        closeSpeed: 400,
        openEffect: 'fade',
        closeEffect: 'fade',
        padding: 0,
        closeBtn: true,
        scrolling: 'visible',
        afterShow: function () {
            if (!this.href) {
                return;
            }

            var popup = false;
            var found = false;
            var options = {};
            if (this.href.substr(0, 1) === '#') {
                popup = this.href.substr(1);
            }
            if (found = this.href.match(/^\/popups\/([a-zA-Z0-9\-]+)\/(.*)$/i)) {
                popup = 'popup-' + found[1];
                if (found[2]) {
                    options = can.deparam(found[2].substr(1));
                }
            }
            if (popup) {
                var $popup = this.wrap.find('#' + popup);
                var popupPlugin = can.capitalize(can.camelize(popup));
                var controls    = $popup.data('controls');
                if (APP.Controls[popupPlugin] && !controls) {
                    new APP.Controls[popupPlugin]($popup, options);
                }
            }
        }
    };

    /**
     * Параметры вызова Raty
     *
     * @type {{starType: string, score: Function, readOnly: Function, hints: string[], noRatedMsg: string, halfShow: boolean}}
     */
    APP.Helpers.ratyOptions = {
        starType: 'i',
        score: function () {
            return $(this).data('score');
        },
        readOnly: function () {
            return $(this).data('read-only') ? true : false;
        },
        hints: ['1', '2', '3', '4', '5'],
        noRatedMsg: 'Оценок пока нет',
        halfShow: true
    };

    /**
     * Параметры вызова qTip
     *
     * @type {{content: {text: Function}, style: {classes: string, tip: {corner: string, mimic: string, border: number, width: number, height: number}}, position: {my: string, at: string}}}
     */
    APP.Helpers.qTipOptions = {
        content: {
            text: function (event, api) {
                return $(this).attr('title');
            }
        },
        style: {
            classes: 'qtip-bootstrap qtip-shadow',
            tip: {
                corner: 'bottom center',
                mimic: 'center',
                border: 1,
                width: 10,
                height: 5
            }
        },
        position: {
            my: 'bottom center',
            at: 'top center'
        }
    };

    /**
     * Определяет размер файла исчислим в МБ и КБ
     *
     * @param size
     */
    APP.Helpers.determineSize = function(size) {

        var prefix = '';
        var mb = 1024 * 1024;
        var kb = 1024;

        if (size >= mb || size >= (100 * kb)) {
            size = (size / mb).toFixed(2);
            prefix = 'Mb'
        } else {
            if (size > kb) {
                size = (size / kb).toFixed(2);
            } else {
                size = 0.1
            }

            prefix = 'Kb'
        }

        return {
            value:  size,
            prefix: prefix
        }
    };

    /**
     * Возвращает расширение файла по его имени
     *
     * @param fileName
     * @returns {T|*}
     */
    APP.Helpers.getExtension = function(fileName) {
        var parts = fileName.split('.');
        return parts.length > 1 ? parts.pop() : false;
    };

    /**
     * Подсчет кол-ва элементов в объекте
     *
     * @param obj
     * @returns {number}
     */
    APP.Helpers.countOfObject = function(obj) {
        var i = 0;
        if (obj == null || typeof(obj) !="object") {
            return 0;
        }

        for (x in obj) {
            i++;
        }

        return i;
    };

    /**
     * Открывает fancybox
     *
     * @param params
     */
    APP.Helpers.openPopup = function (params) {
        params = params || {};
        var options = $.extend({}, APP.Helpers.fancyOptions, params);
        $.fancybox(options);
    };

    /**
     * Удаляет из объекта пустые значения
     *
     * @param obj
     * @returns {*}
     */
    APP.Helpers.clearEmptyValues = function (obj) {
        for (var key in obj) {
            if (obj[key] === '') {
                delete obj[key];
            }
        }
        return obj;
    };
})(jQuery, window.APP);
