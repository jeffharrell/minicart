'use strict';


var config = require('../config');


(function (window, document) {


    module.exports = (function () {
        var name = config.name;

        // NOOP for Node
        if (!window) {
            return {
                load: function () {},
                save: function () {},
                remove: function () {}
            };
            // Use HTML5 client side storage
        } else if (window.localStorage) {
            return {

                /**
                 * Loads the saved data
                 *
                 * @return {object}
                 */
                load: function () {
                    var data = localStorage.getItem(name),
                        todayDate, expiresDate;

                    if (data) {
                        data = JSON.parse(decodeURIComponent(data));
                    }

                    if (data && data.expires) {
                        todayDate = new Date();
                        expiresDate = new Date(data.expires);

                        if (todayDate > expiresDate) {
                            util.storage.remove();
                            return;
                        }
                    }

                    // A little bit of backwards compatibility for the moment
                    if (data && data.value) {
                        return data.value;
                    } else {
                        return data;
                    }
                },


                /**
                 * Saves the data
                 *
                 * @param items {object} The list of items to save
                 * @param duration {Number} The number of days to keep the data
                 */
                save: function (items, duration) {
                    var date = new Date(),
                        data = [],
                        wrappedData, item, len, i;

                    if (items) {
                        for (i = 0, len = items.length; i < len; i++) {
                            item = items[i];
                            data.push({
                                product: item.product,
                                settings: item.settings
                            });
                        }

                        date.setTime(date.getTime() + duration * 24 * 60 * 60 * 1000);
                        wrappedData = {
                            value: data,
                            expires: date.toGMTString()
                        };

                        localStorage.setItem(name, encodeURIComponent(JSON.stringify(wrappedData)));
                    }
                },


                /**
                 * Removes the saved data
                 */
                remove: function () {
                    localStorage.removeItem(name);
                }
            };

            // Otherwise use cookie based storage
        } else {
            return {

                /**
                 * Loads the saved data
                 *
                 * @return {object}
                 */
                load: function () {
                    var key = name + '=',
                        data, cookies, cookie, value, i;

                    try {
                        cookies = document.cookie.split(';');

                        for (i = 0; i < cookies.length; i++) {
                            cookie = cookies[i];

                            while (cookie.charAt(0) === ' ') {
                                cookie = cookie.substring(1, cookie.length);
                            }

                            if (cookie.indexOf(key) === 0) {
                                value = cookie.substring(key.length, cookie.length);
                                data = JSON.parse(decodeURIComponent(value));
                            }
                        }
                    } catch (e) {}

                    return data;
                },


                /**
                 * Saves the data
                 *
                 * @param items {object} The list of items to save
                 * @param duration {Number} The number of days to keep the data
                 */
                save: function (items, duration) {
                    var date = new Date(),
                        data = [],
                        item, len, i;

                    if (items) {
                        for (i = 0, len = items.length; i < len; i++) {
                            item = items[i];
                            data.push({
                                product: item.product,
                                settings: item.settings
                            });
                        }

                        date.setTime(date.getTime() + duration * 24 * 60 * 60 * 1000);
                        document.cookie = config.name + '=' + encodeURIComponent(JSON.stringify(data)) + '; expires=' + date.toGMTString() + '; path=' + config.cookiePath;
                    }
                },


                /**
                 * Removes the saved data
                 */
                remove: function () {
                    this.save(null, -1);
                }
            };
        }
    })();


    util.currency = function (amount, code) {
        var currencies = {
                AED: { before: '\u062c' },
                ANG: { before: '\u0192' },
                ARS: { before: '$' },
                AUD: { before: '$' },
                AWG: { before: '\u0192' },
                BBD: { before: '$' },
                BGN: { before: '\u043b\u0432' },
                BMD: { before: '$' },
                BND: { before: '$' },
                BRL: { before: 'R$' },
                BSD: { before: '$' },
                CAD: { before: '$' },
                CHF: { before: '' },
                CLP: { before: '$' },
                CNY: { before: '\u00A5' },
                COP: { before: '$' },
                CRC: { before: '\u20A1' },
                CZK: { before: 'Kc' },
                DKK: { before: 'kr' },
                DOP: { before: '$' },
                EEK: { before: 'kr' },
                EUR: { before: '\u20AC' },
                GBP: { before: '\u00A3' },
                GTQ: { before: 'Q' },
                HKD: { before: '$' },
                HRK: { before: 'kn' },
                HUF: { before: 'Ft' },
                IDR: { before: 'Rp' },
                ILS: { before: '\u20AA' },
                INR: { before: 'Rs.' },
                ISK: { before: 'kr' },
                JMD: { before: 'J$' },
                JPY: { before: '\u00A5' },
                KRW: { before: '\u20A9' },
                KYD: { before: '$' },
                LTL: { before: 'Lt' },
                LVL: { before: 'Ls' },
                MXN: { before: '$' },
                MYR: { before: 'RM' },
                NOK: { before: 'kr' },
                NZD: { before: '$' },
                PEN: { before: 'S/' },
                PHP: { before: 'Php' },
                PLN: { before: 'z' },
                QAR: { before: '\ufdfc' },
                RON: { before: 'lei' },
                RUB: { before: '\u0440\u0443\u0431' },
                SAR: { before: '\ufdfc' },
                SEK: { before: 'kr' },
                SGD: { before: '$' },
                THB: { before: '\u0E3F' },
                TRY: { before: 'TL' },
                TTD: { before: 'TT$' },
                TWD: { before: 'NT$' },
                UAH: { before: '\u20b4' },
                USD: { before: '$' },
                UYU: { before: '$U' },
                VEF: { before: 'Bs' },
                VND: { before: '\u20ab' },
                XCD: { before: '$' },
                ZAR: { before: 'R' }
            },
            currency = currencies[code] || {},
            before = currency.before || '',
            after = currency.after || '';

        return before + amount.toFixed(2) + after;
    };


})(typeof window === 'undefined' ? null : window, typeof document === 'undefined' ? null : document);

