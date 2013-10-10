'use strict';

var assert = require('assert'),
    Cart = require('../src/cart'),
    cartData = require('./fixtures/cartData');


describe('Cart Model', function () {

    var cart;


    beforeEach(function () {
        cart = new Cart(cartData.slice(0));
    });


    afterEach(function () {
        cart = null;
    });


    it('get() returns a valid product', function () {
        assert.deepEqual(cart.get(0), { name: 'Item 1', amount: 1.00 });
        assert.deepEqual(cart.get(1), { name: 'Item 2', amount: 2.34 });
    });


    it('getAll() returns all products', function () {
        var products = cart.getAll();

        assert.equal(products.length, 2);
        assert.deepEqual(products[0], cartData[0]);
        assert.deepEqual(products[1], cartData[1]);
    });


    it('add() adds a product', function () {
        var product = { name: 'Item 3', amount: 3.00 },
            idx = cart.add(product);

        assert.deepEqual(cart.get(idx), product);
    });


    it('add() fires an event', function (done) {
        var product = { name: 'Item 3', amount: 3.00 },
            len = cart.getAll().length;

        cart.on('add', function (idx, data) {
            assert.equal(len, idx);
            assert.equal(data, product);
            done();
        });

        cart.add(product);
    });


    it('total() returns the cart product total', function () {
        assert.equal(cart.total(), '$3.34');
        cart.remove(1);
        assert.equal(cart.total(), '$1.00');

    });


    it('total() returns the unformatted cart product total', function () {
        assert.equal(cart.total({ unformatted: true }), 3.34);
        cart.remove(1);
        assert.equal(cart.total({ unformatted: true }), 1);

    });


    it('remove() removes a product', function () {
        var len = cart.getAll().length;

        cart.remove(0);

        assert.deepEqual(len - 1, cart.getAll().length);
        assert.notDeepEqual(cart.get(0), cartData[0]);
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
        var prodArr = cart.getAll().slice(0),
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
        assert.equal(cart.getAll().length, 0);
    });


    it('destroy() fires an event', function (done) {
        cart.on('destroy', function () {
            assert.equal(cart.getAll().length, 0);
            done();
        });

        cart.destroy();
    });
});