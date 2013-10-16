'use strict';


var config = module.exports = {

    name: 'PPMiniCart',

    parent: (typeof document !== 'undefined') ? document.body : null,

    action: 'https://www.paypal.com/cgi-bin/webscr',

    target: '',

    duration: 30,

    cookiePath: '/',

    template: '$TEMPLATE$',

    styles: '$STYLES$',

    strings: {
        button: 'Checkout',
        subtotal: 'Subtotal:',
        discount: 'Discount:',
        processing: 'Processing...'
    }

};


function merge(dest, source) {
	var value;

	for (var key in source) {
		value = source[key];

		if (value && value.constructor === Object) {
			merge(dest[key], value);
		} else {
			dest[key] = value;
		}
	}

	return dest;
}


module.exports.load = function load(userConfig) {
    return merge(config, userConfig);
};
