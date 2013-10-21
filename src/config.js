'use strict';


var mixin = require('./util/mixin');


var defaults = module.exports = {

    name: 'PPMiniCart',

    parent: (typeof document !== 'undefined') ? document.body : null,

    action: 'https://www.paypal.com/cgi-bin/webscr',

    target: '',

    duration: 30,

    template: '$TEMPLATE$',

    styles: '$STYLES$',

    strings: {
        button: 'Checkout',
        subtotal: 'Subtotal:',
        discount: 'Discount:',
        processing: 'Processing...'
    }

};


module.exports.load = function load(userConfig) {
    return mixin(defaults, userConfig);
};
