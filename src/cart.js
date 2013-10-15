'use strict';


var Product = require('./product'),
    constants = require('./constants'),
    currency = require('./util/currency');


function Cart(data) {
    var i, len;

    this._products = [];
	this._settings = {};
	this._eventCache = {};

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
		items = this.getAll(),
        product, idx, key, len, i;


	// Prune cart settings data from the product
	for (key in data) {
		if (constants.SETTINGS.test(key)) {
			this._settings[key] = data[key];
			delete data[key];
		}
	}

	// Look to see if the same product has already been added
	for (i = 0, len = items.length; i < len; i++) {
		if (items[i].isEqual(data)) {
			product = items[i];
			product.set('quantity', product.get('quantity') + (data.quantity || 1));
			idx = i;
			break;
		}
	}

	// If not, then add it
	if (!product) {
		product = new Product(data);
		idx = (this._products.push(product) - 1);

		product.on('change', function (key, value) {
			that.fire('change', idx, key, value);
		});

		this.fire('add', idx, data);
	}

    return idx;
};


Cart.prototype.get = function get(idx) {
    return this._products[idx];
};


Cart.prototype.getAll = function getAll() {
    return this._products;
};


Cart.prototype.settings = function settings(name) {
	return (name) ? this._settings[name] : this._settings;
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
        return currency(result, 'USD');
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
