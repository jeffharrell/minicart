'use strict';


var Product = require('./product'),
    util = require('./util');


function Cart(data) {
    var i, len;

    this._eventCache = {};
    this._products = [];

    if (data) {
        for (i = 0, len = data.length; i < len; i++) {
            this.add(data[i]);
        }
    }
}


Cart.prototype.on = function on(name, fn) {
    var cache = this._eventCache[name];

    if (!cache) {
        cache = this._eventCache[name] = [];
    }

    cache.push(fn);
};


Cart.prototype.off = function off(name, fn) {
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


Cart.prototype.fire = function on(name) {
    var cache = this._eventCache[name],
        i, len, fn;

    if (cache) {
        for (i = 0, len = cache.length; i < len; i++) {
            fn = cache[i];

            if (typeof fn === 'function') {
                fn.apply(this, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
};


Cart.prototype.add = function add(data) {
    var that = this,
        product = new Product(data),
        idx = (this._products.push(product) - 1);

    product.on('change', function (key, value) {
        that.fire('change', idx, key, value);
    });

    this.fire('add', idx, data);
    return idx;
};


Cart.prototype.get = function get(idx) {
    return this._products[idx];
};


Cart.prototype.getAll = function getAll() {
    return this._products;
};


Cart.prototype.total = function total(options) {
    var products = this.getAll(),
        result = 0,
        i, len;

    for (i = 0, len = products.length; i < len; i++) {
        result += products[i].total({ unformatted: true });
    }

    if (options && options.unformatted) {
        return result;
    } else {
        return util.currency(result, 'USD');
    }
};


Cart.prototype.remove = function remove(idx) {
    var data = this._products.splice(idx, 1);

    if (data) {
        this.fire('remove', idx, data[0]);
    }

    return !!data.length;
};


Cart.prototype.destroy = function destroy() {
    this._products = [];
    this.fire('destroy');
};




module.exports = Cart;