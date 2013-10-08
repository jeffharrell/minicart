;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';


var Product = require('./product');


function Cart(data) {
    var i, len;

    this._eventCache = {};
    this._products = [];

    for (i = 0, len = data.length; i < len; i++) {
        this.add(data[i]);
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
        idx = (this._products.push(data) - 1);

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


Cart.prototype.total = function total() {
    var products = this.getAll(),
        result = 0,
        i, len;

    for (i = 0, len = products.length; i < len; i++) {
        result += parseFloat(products[i].amount, 2);
    }

    return result.toFixed(2);
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
},{"./product":4}],2:[function(require,module,exports){
'use strict';


var config = module.exports = {

    parent: document && document.body,

    template: '<form method="post" action="https://www.paypal.com/cgi-bin/webscr">' +
        '<input type="hidden" name="cmd" value="_cart">' +
        '<input type="hidden" name="upload" value="1">' +
        '<input type="hidden" name="bn" value="MiniCart_AddToCart_WPS_US">' +
        '<ul>' +
        '<li>' +
        '<a href="http://minicartjs.com/">Product 2<span>12345<br><input type="hidden" name="discount_amount_1" value="0"></span></a>' +
        '<input name="quantity_1" class="quantity" autocomplete="off">' +
        '<input type="button" class="remove">' +
        '<span class="price">$2.00</span>' +
        '<input type="hidden" name="cmd_1" value="_cart">' +
        '<input type="hidden" name="add_1" value="1">' +
        '<input type="hidden" name="item_name_1" value="Product 2">' +
        '<input type="hidden" name="item_number_1" value="12345">' +
        '<input type="hidden" name="amount_1" value="2.00">' +
        '<input type="hidden" name="submit_1" value="Add to cart">' +
        '<input type="hidden" name="href_1" value="http://minicartjs.com/">' +
        '<input type="hidden" name="offset_1" value="0">' +
        '</li>' +
        '</ul>' +
        '<p>' +
        '<input type="submit" value="Checkout">' +
        '<span>Subtotal: <span>$2.00</span></span>' +
        '<span class="shipping">does not include shipping &amp; tax</span>' +
        '</p>' +
        '<input type="hidden" name="business" value="example@minicartjs.com">' +
        '<input type="hidden" name="currency_code" value="USD">' +
        '<input type="hidden" name="return" value="http://www.minicartjs.com/?success#PPMiniCart=reset">' +
        '<input type="hidden" name="cancel_return" value="http://www.minicartjs.com/?cancel">' +
        '</form>',

    styles: '',

    strings: {
        button: 'Checkout',
        subtotal: 'Subtotal: ',
        discount: 'Discount: ',
        shipping: 'Does not include shipping & tax',
        processing: 'Processing...'
    },

    name: 'PPMiniCart'

};


module.exports.load = function load(userConfig) {
    // TODO: This should recursively merge the config values
    for (var key in userConfig) {
        config[key] = userConfig[key];
    }
};
},{}],3:[function(require,module,exports){
'use strict';


var Product = require('./product'),
    Cart = require('./cart'),
    config = require('./config'),
    minicart = {},
    isShowing = false,
    cartModel;


function addItem(idx, data) {
    minicart.show();
}

function changeItem(idx, data) {
    minicart.show();
}


function removeItem(idx) {
    minicart.show();
}



minicart.render = function render(userConfig) {
    var wrapper;

    config.load(userConfig);

    wrapper = document.createElement('div');
    wrapper.id = config.name;
    wrapper.innerHTML = config.template;

    config.parent.appendChild(wrapper);

//    cartModel = minicart.data = new Cart();
//    cartModel.on('add', addItem);
//    cartModel.on('change', changeItem);
//    cartModel.on('remove', removeItem);
};

//
//minicart.bind = function bind(form) {
//
//};
//
//
//minicart.show = function show() {
//    if (!isShowing) {
//        config.parent.addClass('showing');
//        isShowing = true;
//    }
//};
//
//
//minicart.hide = function hide() {
//    if (isShowing) {
//        config.parent.removeClass('showing');
//        isShowing = false;
//    }
//};
//
//
//minicart.toggle = function toggle() {
//    minicart[isShowing ? 'hide' : 'show']();
//};
//
//
//minicart.reset = function reset() {
//    minicart.hide();
//    cartModel.destroy();
//};




// Export
(function (win) {
    if (!win.paypal) {
        win.paypal = {};
    }

    win.paypal.minicart = minicart;
})(window || module.exports);




},{"./cart":1,"./config":2,"./product":4}],4:[function(require,module,exports){
'use strict';


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
    var item = this._data[key] = value,
        data = {};

    data[key] = value;

    this.fire('change', data);
};


Product.prototype.destroy = function destroy() {
    this._data = [];
    this.fire('destroy', this);
};




module.exports = Product;
},{}]},{},[1,2,3,4])
;