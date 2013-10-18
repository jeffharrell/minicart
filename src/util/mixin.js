'use strict';


var mixin = module.exports = function mixin(dest, source) {
	var value;

	for (var key in source) {
		value = source[key];

		if (value && value.constructor === Object) {
			mixin(dest[key], value);
		} else {
			dest[key] = value;
		}
	}

	return dest;
};
