'use strict';


var currency = require('./util/currency');


function Product(data) {
	data.quantity = data.quantity || 1;
	data.href = data.href || (typeof window !== 'undefined') ? window.location.href : null,

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

	//    // Add option amounts to the total amount
	//    option_index = (product.option_index) ? product.option_index : 0;
	//
	//    while (product['os' + option_index]) {
	//        i = 0;
	//
	//        while (typeof product['option_select' + i] !== 'undefined') {
	//            if (product['option_select' + i] === product['os' + option_index]) {
	//                product.amount = product.amount + parseFloat(product['option_amount' + i]);
	//                break;
	//            }
	//
	//            i++;
	//        }
	//
	//        option_index++;
	//    }

    if (options && options.unformatted) {
        return result;
    } else {
        return currency(result, 'USD');
    }
};


Product.prototype.isEqual = function isEqual(data) {
	var match = false;

	if (data instanceof Product) {
		data = data._data;
	}

	if (this.get('item_name') === data.item_name) {
		if (this.get('item_number') === data.item_number) {
			if (this.get('amount') === data.amount) {
				var i = 0;

				match = true;

				while (typeof data['os' + i] !== 'undefined') {
					if (this.get('os' + i) !== data['os' + i]) {
						match = false;
						break;
					}

					i++;
				}
			}
		}
	}

	return match;
};


module.exports = Product;
