'use strict';


var mixin = module.exports = function mixin(dest, source) {
    var value;

    for (var key in source) {
        value = source[key];

        if (value && value.constructor === Object) {
            if (!dest[key]) {
                dest[key] = value;
            } else {
                mixin(dest[key] || {}, value);
            }
        } else {
            dest[key] = value;
        }
    }

    return dest;
};
