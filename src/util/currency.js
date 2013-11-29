'use strict';


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
};


module.exports = function currency(amount, config) {
    var code = config && config.currency || 'USD',
		value = currencies[code],
        before = value.before || '',
        after = value.after || '',
        length = value.length || 2,
		result = amount;

	if (config && config.format) {
		result = before + result.toFixed(length) + after;
	}

	if (config && config.showCode) {
		result += ' ' + code;
	}

    return result;
};
