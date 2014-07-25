'use strict';


var currency = require('./util/currency'),
    Pubsub = require('./util/pubsub'),
    mixin = require('./util/mixin');


var parser = {
    quantity: function (value) {
        value = parseInt(value, 10);

        if (isNaN(value) || !value) {
            value = 1;
        }

        return value;
    },
    amount: function (value) {
        return parseFloat(value) || 0;
    },
    href: function (value) {
        if (value) {
            return value;
        } else {
            return (typeof window !== 'undefined') ? window.location.href : null;
        }
    }
};


/**
 * Creates a new product.
 *
 * @constructor
 * @param {object} data Item data
 */
function Product(data) {
    data.quantity = parser.quantity(data.quantity);
    data.amount = parser.amount(data.amount);
    data.href = parser.href(data.href);

    this._data = data;
    this._options = null;
    this._discount = null;
    this._amount = null;
    this._total = null;

    Pubsub.call(this);
}


mixin(Product.prototype, Pubsub.prototype);


/**
 * Gets the product data.
 *
 * @param {string} key (Optional) A key to restrict the returned data to.
 * @return {array|string}
 */
Product.prototype.get = function get(key) {
    return (key) ? this._data[key] : this._data;
};


/**
 * Sets a value on the product. This is used rather than manually setting the
 * value so that we can fire a "change" event.
 *
 * @param {string} key
 * @param {string} value
 */
Product.prototype.set = function set(key, value) {
    var setter = parser[key];

    this._data[key] = setter ? setter(value) : value;
    this._options = null;
    this._discount = null;
    this._amount = null;
    this._total = null;

    this.fire('change', key);
};


/**
 * Parse and return the options for this product.
 *
 * @return {object}
 */
Product.prototype.options = function options() {
    var result, key, value, amount, i, j;

    if (!this._options) {
        result = [];
        i = 0;

        while ((key = this.get('on' + i))) {
            value = this.get('os' + i);
            amount = 0;
            j = 0;

            while (typeof this.get('option_select' + j) !== 'undefined') {
                if (this.get('option_select' + j) === value) {
                    amount = parser.amount(this.get('option_amount' + j));
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

        this._options = result;
    }

    return this._options;
};


/**
 * Parse and return the discount for this product.
 *
 * @param {object} config (Optional) Currency formatting options.
 * @return {number|string}
 */
Product.prototype.discount = function discount(config) {
    var flat, rate, num, limit, result, amount;

    if (!this._discount) {
        result = 0;
        num = parseInt(this.get('discount_num'), 10) || 0;
        limit = Math.max(num, this.get('quantity') - 1);

        if (this.get('discount_amount') !== undefined) {
            flat = parser.amount(this.get('discount_amount'));
            result += flat;
            result += parser.amount(this.get('discount_amount2') || flat) * limit;
        } else if (this.get('discount_rate') !== undefined) {
            rate = parser.amount(this.get('discount_rate'));
            amount = this.amount();

            result += rate * amount / 100;
            result += parser.amount(this.get('discount_rate2') || rate) * amount * limit / 100;
        }

        this._discount = result;
    }

    return currency(this._discount, config);
};


/**
 * Parse and return the total without discounts for this product.
 *
 * @param {object} config (Optional) Currency formatting options.
 * @return {number|string}
 */
Product.prototype.amount = function amount(config) {
    var result, options, len, i;

    if (!this._amount) {
        result = this.get('amount');
        options = this.options();

        for (i = 0, len = options.length; i < len; i++) {
            result += options[i].amount;
        }

        this._amount = result;
    }

    return currency(this._amount, config);
};


/**
 * Parse and return the total for this product.
 *
 * @param {object} config (Optional) Currency formatting options.
 * @return {number|string}
 */
Product.prototype.total = function total(config) {
    var result;

    if (!this._total) {
        result  = this.get('quantity') * this.amount();
        result -= this.discount();

        this._total = parser.amount(result);
    }

    return currency(this._total, config);
};


/**
 * Determine if this product has the same data as another.
 *
 * @param {object|Product} data Other product.
 * @return {boolean}
 */
Product.prototype.isEqual = function isEqual(data) {
    var match = false;

    if (data instanceof Product) {
        data = data._data;
    }

    if (this.get('item_name') === data.item_name) {
        if (this.get('item_number') === data.item_number) {
            if (this.get('amount') === parser.amount(data.amount)) {
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


/**
 * Determine if this product is valid.
 *
 * @return {boolean}
 */
Product.prototype.isValid = function isValid() {
    return (this.get('item_name') && this.amount() > 0);
};


/**
 * Destroys this product. Fires a "destroy" event.
 */
Product.prototype.destroy = function destroy() {
    this._data = [];
    this.fire('destroy', this);
};




module.exports = Product;
