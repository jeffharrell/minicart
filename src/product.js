'use strict';


var eventCache = {};


function Product(data) {
    this._data = data;
}


Product.prototype.on = function on(name, event) {
    var cache = eventCache[name];

    if (!cache) {
        cache = eventCache[name] = [];
    }

    cache.push(event);
};


Product.prototype.fire = function on(name) {
    var cache = eventCache[name], i, len, fn;

    if (cache) {
        for (i = 0 , len = cache.length; i < len; i++) {
            fn = cache[i];

            if (typeof fn === 'function') {
                fn.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
};


Product.prototype.get = function get(name) {
    return this._data[name];
};


Product.prototype.set = function set(name, value) {
    var item = this._data[name] = value;



    this.fire('change', name, value);
};


Product.prototype.destroy = function destroy() {
    this._data = [];
    this.fire('destroy', this);
};



module.exports = Product;