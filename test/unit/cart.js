'use strict';

var assert = require('assert'),
    Cart = require('../../src/cart'),
    cartData = require('./fixtures/cartData');


describe('Cart Model', function () {

    var cart;

    beforeEach(function () {
        var data, items, settings, i, len;

        cart = new Cart();

        if ((data = JSON.parse(JSON.stringify(cartData)))) {
            items = data.items;
            settings = data.settings;

            if (items) {
                for (i = 0, len = items.length; i < len; i++) {
                    cart.add(items[i]);
                }
            }
        }

    });


    afterEach(function () {
        cart = null;
    });


    it('items(idx) returns a valid product', function () {
        assert.strictEqual(cart.items(0).get('item_name'), 'Item 1');
        assert.strictEqual(cart.items(0).get('amount'), 1.00);
        assert.strictEqual(cart.items(1).get('item_name'), 'Item 2');
        assert.strictEqual(cart.items(1).get('amount'),  2.34);
    });


    it('items() returns all products', function () {
        var products = cart.items();

        assert.strictEqual(products.length, 2);
        assert.strictEqual(products[0].get('item_name'), cartData.items[0].item_name);
        assert.strictEqual(products[0].get('amount'), cartData.items[0].amount);
        assert.strictEqual(products[1].get('item_name'), cartData.items[1].item_name);
        assert.strictEqual(products[1].get('amount'), cartData.items[1].amount);
    });


    it('add() adds a product', function () {
        var product = { item_name: 'Item 3', amount: 3.00 },
            idx = cart.add(product);

        assert.strictEqual(cart.items(idx).get('item_name'), product.item_name);
        assert.strictEqual(cart.items(idx).get('amount'), product.amount);
    });


    it('add() does not add invalid products', function () {
        var idx = cart.add({});

        assert.strictEqual(idx, false);
    });


    it('add() for the same product only increments the quantity', function () {
        var product = { item_name: 'Item 3', amount: 3.00, quantity: 1 },
            idx = cart.add(product);

        assert.strictEqual(cart.items().length, 3);
        assert.strictEqual(cart.items(idx).get('quantity'), 1);
        cart.add(product);
        assert.strictEqual(cart.items().length, 3);
        assert.strictEqual(cart.items(idx).get('quantity'), 2);

    });


    it('add() fires an event', function (done) {
        var data = { item_name: 'Item 3', amount: 3.00 },
            len = cart.items().length;

        cart.on('add', function (idx, product) {
            assert.equal(len, idx);
            assert.equal(product._data, data);
            done();
        });

        cart.add(data);
    });


    it('settings() returns the value for a named setting', function () {
        assert.strictEqual(cart.settings('currency_code'), 'USD');
        assert.strictEqual(cart.settings('custom'), 'foo');
    });


    it('settings() returns all when no args are passed', function () {
        assert.deepEqual(cart.settings(), { bn: 'MiniCart_AddToCart_WPS_US', currency_code: 'USD', custom: 'foo' });
    });


    it('subtotal() returns the cart subtotal', function () {
        assert.strictEqual(cart.subtotal(), 3.34);
    });


    it('subtotal() should not apply discounts', function () {
        cart._settings.discount_amount_cart = 1.00;
        assert.strictEqual(cart.subtotal(), 3.34);
    });


    it('subtotal() returns the formatted amount', function () {
        assert.strictEqual(cart.subtotal({ format: true }), '$3.34');
    });


    it('total() returns the cart product total', function () {
        assert.strictEqual(cart.total(), 3.34);
        cart.remove(1);
        assert.strictEqual(cart.total(), 1);
    });


    it('total() uses flat discounts', function () {
        cart._settings.discount_amount_cart = 1.00;
        assert.strictEqual(cart.total(), 2.34);
    });


    it('total() uses percentage discounts', function () {
        cart._settings.discount_rate_cart = 50;
        assert.strictEqual(cart.total(), 1.67);
    });


    it('total() returns the formatted cart product total', function () {
        assert.strictEqual(cart.total({ format: true }), '$3.34');
        assert.strictEqual(cart.total({ format: true, showCode: true }), '$3.34 USD');
    });


    it('remove() removes a product', function () {
        var len = cart.items().length;

        cart.remove(0);

        assert.deepEqual(len - 1, cart.items().length);
        assert.notDeepEqual(cart.items(0), cartData[0]);
    });


    it('remove() returns true on valid indices', function () {
        var result = cart.remove(0);

        assert.strictEqual(result, true);
    });


    it('remove() returns false on invalid indices', function () {
        var result = cart.remove(1234);

        assert.strictEqual(result, false);
    });


    it('remove() calls destroy() on the last product', function (done) {
        cart.on('destroy', function () {
            assert(true);
            done();
        });

        cart.remove(1);
        cart.remove(0);
    });


    it('remove() fires an event', function (done) {
        var prodArr = cart.items().slice(0),
            product = prodArr[0],
            len = 0;

        cart.on('remove', function (idx, data) {
            assert.equal(len, idx);
            assert.equal(data, product);
            done();
        });

        cart.remove(len);
    });


    it('has a bn code', function () {
        assert(!!cart.settings().bn);
    });


    it('destroy() empties the cart', function () {
        cart.destroy();
        assert.strictEqual(cart.items().length, 0);
    });


    it('destroy() clears the cart settings', function () {
        cart.destroy();
        assert.deepEqual(cart.settings(), { bn: 'MiniCart_AddToCart_WPS_US' });
    });


    it('destroy() fires an event', function (done) {
        cart.on('destroy', function () {
            assert.strictEqual(cart.items().length, 0);
            done();
        });

        cart.destroy();
    });


    it('checkout() fires an event', function (done) {
        cart.on('checkout', function () {
            assert(true);
            done();
        });

        cart.checkout();
    });
});
