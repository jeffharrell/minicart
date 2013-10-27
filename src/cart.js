'use strict';


var Product = require('./product'),
	Pubsub = require('./util/pubsub'),
	Storage = require('./util/storage'),
    constants = require('./constants'),
    currency = require('./util/currency'),
	mixin = require('./util/mixin');


function Cart(name, duration) {
    var data, items, settings, len, i;

	this._items = [];
	this._settings = { bn: constants.BN };

	Pubsub.call(this);
	Storage.call(this, name, duration);

	if ((data = this.load())) {
		items = data.items;
		settings = data.settings;

		if (settings) {
			this._settings = settings;
		}

		if (items) {
			for (i = 0, len = items.length; i < len; i++) {
				this.add(items[i]);
			}
		}
    }
}


mixin(Cart.prototype, Pubsub.prototype);
mixin(Cart.prototype, Storage.prototype);


Cart.prototype.add = function add(data) {
    var that = this,
		items = this.items(),
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
			product.set('quantity', product.get('quantity') + (parseInt(data.quantity, 10) || 1));
			idx = i;
			break;
		}
	}

	// If not, then add it
	if (!product) {
		product = new Product(data);
		idx = (this._items.push(product) - 1);

		product.on('change', function (key, value) {
			that.save();
			that.fire('change', idx, key, value);
		});

		this.save();
		this.fire('add', idx, data);
	}

    return idx;
};


Cart.prototype.items = function get(idx) {
    return (typeof idx === 'number') ? this._items[idx] : this._items;
};


Cart.prototype.settings = function settings(name) {
	return (name) ? this._settings[name] : this._settings;
};


Cart.prototype.discount = function discount(config) {
	var result = parseFloat(this.settings('discount_amount_cart')) || 0;

	if (!result) {
		result = (parseFloat(this.settings('discount_rate_cart')) || 0) * this.subtotal() / 100;
	}

	return currency(result, this.settings('currency_code'), config);
};


Cart.prototype.subtotal = function subtotal(config) {
	var products = this.items(),
		result = 0,
		i, len;

	for (i = 0, len = products.length; i < len; i++) {
		result += products[i].total();
	}

	return currency(result, this.settings('currency_code'), config);
};


Cart.prototype.total = function total(config) {
    var result = 0;

	result += this.subtotal();
	result -= this.discount();

	return currency(result, this.settings('currency_code'), config);
};


Cart.prototype.remove = function remove(idx) {
    var data = this._items.splice(idx, 1);

    if (data) {
		this.save();
        this.fire('remove', idx, data[0]);
    }

    return !!data.length;
};


Cart.prototype.save = function save() {
	var items = this.items(),
		settings = this.settings(),
		data = [],
		i, len;

	for (i = 0, len = items.length; i < len; i++) {
		data.push(items[i].get());
	}

	Storage.prototype.save.call(this, {
		items: data,
		settings: settings
	});
};


Cart.prototype.destroy = function destroy() {
	Storage.prototype.destroy.call(this);

    this._items = [];
    this.fire('destroy');
};




module.exports = Cart;
