'use strict';


var Product = require('./product'),
    Pubsub = require('./util/pubsub'),
    Storage = require('./util/storage'),
    constants = require('./constants'),
    currency = require('./util/currency'),
    mixin = require('./util/mixin');



/**
 * Renders the Mini Cart to the page's DOM.
 *
 * @constructor
 * @param {string} name Name of the cart (used as a key for storage)
 * @param {duration} number Time in milliseconds that the cart data should persist
 */
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


/**
 * Adds an item to the cart. This fires an "add" event.
 *
 * @param {object} data Item data
 * @return {number} Item location in the cart
 */
Cart.prototype.add = function add(data) {
    var that = this,
        items = this.items(),
        idx = false,
        isExisting = false,
        product, key, len, i;

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
            isExisting = true;
            break;
        }
    }

    // If not, then try to add it
    if (!product) {
        product = new Product(data);

        if (product.isValid()) {
            idx = (this._items.push(product) - 1);

            product.on('change', function (key, value) {
                that.save();
                that.fire('change', idx, key, value);
            });

            this.save();
        }
    }

    if (product) {
        this.fire('add', idx, product, isExisting);
    }

    return idx;
};


/**
 * Returns the carts current items.
 *
 * @param {number} idx (Optional) Returns only that item.
 * @return {array|object}
 */
Cart.prototype.items = function get(idx) {
    return (typeof idx === 'number') ? this._items[idx] : this._items;
};


/**
 * Returns the carts current settings.
 *
 * @param {string} name (Optional) Returns only that setting.
 * @return {array|string}
 */
Cart.prototype.settings = function settings(name) {
    return (name) ? this._settings[name] : this._settings;
};


/**
 * Returns the cart discount.
 *
 * @param {object} config (Optional) Currency formatting options.
 * @return {number|string}
 */
Cart.prototype.discount = function discount(config) {
    var result = parseFloat(this.settings('discount_amount_cart')) || 0;

    if (!result) {
        result = (parseFloat(this.settings('discount_rate_cart')) || 0) * this.subtotal() / 100;
    }

    config = config || {};
    config.currency = this.settings('currency_code');

    return currency(result, config);
};


/**
 * Returns the cart total without discounts.
 *
 * @param {object} config (Optional) Currency formatting options.
 * @return {number|string}
 */
Cart.prototype.subtotal = function subtotal(config) {
    var products = this.items(),
        result = 0,
        i, len;

    for (i = 0, len = products.length; i < len; i++) {
        result += products[i].total();
    }

    config = config || {};
    config.currency = this.settings('currency_code');

    return currency(result, config);
};


/**
 * Returns the cart total.
 *
 * @param {object} config (Optional) Currency formatting options.
 * @return {number|string}
 */
Cart.prototype.total = function total(config) {
    var result = 0;

    result += this.subtotal();
    result -= this.discount();

    config = config || {};
    config.currency = this.settings('currency_code');

    return currency(result, config);
};


/**
 * Remove an item from the cart. This fires a "remove" event.
 *
 * @param {number} idx Item index to remove.
 * @return {boolean}
 */
Cart.prototype.remove = function remove(idx) {
    var item = this._items.splice(idx, 1);

    if (this._items.length === 0) {
        this.destroy();
    }

    if (item) {
        this.save();
        this.fire('remove', idx, item[0]);
    }

    return !!item.length;
};


/**
 * Saves the cart data.
 */
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


/**
 * Proxies the checkout event
 * The assumption is the view triggers this and consumers subscribe to it
 *
 * @param {object} The initiating event
 */
Cart.prototype.checkout = function checkout(evt) {
    this.fire('checkout', evt);
};


/**
 * Destroy the cart data. This fires a "destroy" event.
 */
Cart.prototype.destroy = function destroy() {
    Storage.prototype.destroy.call(this);

    this._items = [];
    this._settings = { bn: constants.BN };

    this.fire('destroy');
};




module.exports = Cart;
