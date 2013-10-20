'use strict';

var assert = require('assert'),
    Cart = require('../src/cart'),
    cartData = require('./fixtures/cartData');


describe('Cart Model', function () {

    var cart;

    beforeEach(function () {
		var myCartData = JSON.parse(JSON.stringify(cartData));
        cart = new Cart(myCartData);
    });


    afterEach(function () {
        cart = null;
    });


    it('items(idx) returns a valid product', function () {
        assert.equal(cart.items(0).get('item_name'), 'Item 1');
        assert.equal(cart.items(0).get('amount'), 1.00);
        assert.equal(cart.items(1).get('item_name'), 'Item 2');
        assert.equal(cart.items(1).get('amount'),  2.34);
    });


    it('items() returns all products', function () {
        var products = cart.items();

        assert.equal(products.length, 2);
        assert.equal(products[0].get('item_name'), cartData.items[0].item_name);
        assert.equal(products[0].get('amount'), cartData.items[0].amount);
        assert.equal(products[1].get('item_name'), cartData.items[1].item_name);
        assert.equal(products[1].get('amount'), cartData.items[1].amount);
    });


    it('add() adds a product', function () {
        var product = { item_name: 'Item 3', amount: 3.00 },
            idx = cart.add(product);

        assert.equal(cart.items(idx).get('item_name'), product.item_name);
        assert.equal(cart.items(idx).get('amount'), product.amount);
    });


	it('add() for the same product only increments the quantity', function () {
		var product = { item_name: 'Item 3', amount: 3.00, quantity: 1 },
			idx = cart.add(product);

		assert.equal(cart.items().length, 3);
		assert.equal(cart.items(idx).get('quantity'), 1);
		cart.add(product);
		assert.equal(cart.items().length, 3);
		assert.equal(cart.items(idx).get('quantity'), 2);

	});


    it('add() fires an event', function (done) {
        var product = { item_name: 'Item 3', amount: 3.00 },
            len = cart.items().length;

        cart.on('add', function (idx, data) {
            assert.equal(len, idx);
            assert.equal(data, product);
            done();
        });

        cart.add(product);
    });


	it('settings() returns the value for a named setting', function () {
		assert.equal(cart.settings('currency_code'), 'USD');
		assert.equal(cart.settings('custom'), 'foo');
	});


	it('settings() returns all when no args are passed', function () {
		assert.deepEqual(cart.settings(), { currency_code: 'USD', custom: 'foo' });
	});


	it('total() returns the cart product total', function () {
		assert.equal(cart.total(), 3.34);
		cart.remove(1);
		assert.equal(cart.total(), 1);
	});


    it('total() returns the formatted cart product total', function () {
        assert.equal(cart.total({ format: true }), '$3.34');
		assert.equal(cart.total({ format: true, currencyCode: true }), '$3.34 USD');
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


    it('destroy() empties the cart', function () {
        cart.destroy();
        assert.equal(cart.items().length, 0);
    });


    it('destroy() fires an event', function (done) {
        cart.on('destroy', function () {
            assert.equal(cart.items().length, 0);
            done();
        });

        cart.destroy();
    });
});
