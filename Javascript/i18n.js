(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.i18n = factory());
}(this, function () {
    'use strict';
    /** @class i18n */
    const i18n = function (language) {
        if (!(this instanceof i18n)) {
            return new i18n(language);
        }

        /*** language supplied by browser */
        this.language = language || navigator.language || navigator.userLanguage || navigator.browserLanguage;
        /*** supported languages */
        Object.defineProperty(this, 'supported', {
            value: [
                'en-US'
            ]
        });

        /*** language to use */
        Object.defineProperty(this, 'realLanguage', {
            value: (this.supported.indexOf(this.language) > -1) ? this.language : 'en-US'
        });

        /** get translations */
        Object.defineProperty(this, 'getJSON', {
            value: function () {
                if (i18n.c) {
                    return i18n.c;
                }

                const res = new XMLHttpRequest();
                res.open('GET', 'i18n/' + this.realLanguage + '.json');
                res.send();

                return new Promise(function (resolve) {
                    res.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            resolve(this.response);
                        }
                    }
                }).then(function (result) {
                    Object.defineProperty(i18n, 'c', {
                        value: JSON.parse(result),
                        writable: !0
                    });
                });
            }
        });
    };

    return i18n;
}));