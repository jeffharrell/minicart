'use strict';


var currency = require('./util/currency');


var setters = {
	quantity: function (value) {
		value = parseInt(value, 10);

		if (isNaN(value) || !value) {
			value = 1;
		}

		return value;
	},
	amount: function (value) {
		return parseFloat(value) || 0;
	}
};


function Product(data) {
	data.quantity = setters.quantity(data.quantity);
	data.amount = setters.amount(data.amount);
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
	var setter = setters[key];

	this._data[key] = setter ? setter(value) : value;
    this.fire('change', key);
};


Product.prototype.destroy = function destroy() {
    this._data = [];
    this.fire('destroy', this);
};


Product.prototype.options = function options() {
	var result = [],
		i = 0,
		j,
		key,
		value,
		amount;

	while ((key = this.get('on' + i))) {
		value = this.get('os' + i);
		amount = 0;
		j = 0;

		while (typeof this.get('option_select' + j) !== 'undefined') {
			if (this.get('option_select' + j) === value) {
				amount = setters.amount(this.get('option_amount' + j));
				break;
			}

			j++;
		}

		result.push({
			key: key,
			value: value,
			amount: amount
		});

		i++;
	}

	return result;
};


Product.prototype.total = function total(config) {
    var qty = this.get('quantity'),
        amount = this.get('amount'),
		options = this.options(),
		result, i, len;

	// TODO: cache the result until the product is changed
	for (i = 0, len = options.length; i < len; i++) {
		amount += options[i].amount;
	}

	result = qty * amount;

    if (config && config.unformatted) {
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
			if (this.get('amount') === parseFloat(data.amount)) {
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
