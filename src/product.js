'use strict';


var util = require('./util');


function Product(data) {
    this._data = data;
    this._eventCache = {};
}


Product.prototype.on = function on(name, fn) {
    var cache = this._eventCache[name];

    if (!cache) {
        cache = this._eventCache[name] = [];
    }

    cache.push(fn);
};


Product.prototype.off = function off(name, fn) {
    var cache = this._eventCache[name],
        i, len;

    if (cache) {
        for (i = 0, len = cache.length; i < len; i++) {
            if (cache[i] === fn) {
                cache = cache.splice(i, 1);
            }
        }
    }
};


Product.prototype.fire = function on(name) {
    var cache = this._eventCache[name], i, len, fn;

    if (cache) {
        for (i = 0, len = cache.length; i < len; i++) {
            fn = cache[i];

            if (typeof fn === 'function') {
                fn.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
};


Product.prototype.get = function get(key) {
    return this._data[key];
};


Product.prototype.set = function set(key, value) {
    var data = {};
    data[key] = value;

    this._data[key] = value;
    this.fire('change', data);
};


Product.prototype.destroy = function destroy() {
    this._data = [];
    this.fire('destroy', this);
};


Product.prototype.qty = function qty() {
    return parseInt(this.get('quantity'), 10) || 1;
};


Product.prototype.total = function total(options) {
    var qty = this.qty(),
        amount = parseFloat(this.get('amount')),
        result = qty * amount;

    if (options && options.unformatted) {
        return result;
    } else {
        return util.currency(result, 'USD');
    }
};



module.exports = Product;