'use strict';


var assert = require('assert'),
    Product = require('../../src/product');


describe('Product Model', function () {

    var item;


    beforeEach(function () {
        item = new Product({
            name: 'Foo',
            desc: 'This is an item, foo',
            amount: 1.23
        });
    });


    afterEach(function () {
        item = null;
    });


    it('get() returns valid data', function () {
        assert.strictEqual(item.get('name'), 'Foo');
        assert.strictEqual(item.get('desc'), 'This is an item, foo');
        assert.strictEqual(item.get('amount'), 1.23);
    });


    it('set() writes data', function () {
        item.set('name', 'Bar');
        item.set('desc', 'Where is the bar?');
        item.set('amount', 4.56);
        item.set('something', 'random');

        assert.strictEqual(item.get('name'), 'Bar');
        assert.strictEqual(item.get('desc'), 'Where is the bar?');
        assert.strictEqual(item.get('amount'), 4.56);
        assert.strictEqual(item.get('something'), 'random');
    });


    it('set() fires an event', function (done) {
        item.on('change', function (key) {
            assert.equal(key, 'name');
            done();
        });

        item.set('name', 'Baz');
    });


    it('get() returns the correct quantity', function () {
        item.set('quantity', 1234);
        assert.strictEqual(item.get('quantity'), 1234);
    });


    it('get() returns 1 for null quantities', function () {
        assert.strictEqual(item.get('quantity'), 1);
    });


    it('options() returns an array of options', function () {
        var options;

        item.set('on0', 'color');
        item.set('os0', 'blue');
        item.set('on1', 'size');
        item.set('os1', 'large');

        options = item.options();

        assert.strictEqual(options.length, 2);
        assert.deepEqual(options[0], { key: 'color', value: 'blue', amount: 0});
        assert.deepEqual(options[1], { key: 'size', value: 'large', amount: 0});
    });


    it('options() values have an amount', function () {
        var options;

        item.set('on0', 'color');
        item.set('os0', 'blue');
        item.set('on1', 'size');
        item.set('os1', 'large');
        item.set('option_select0', 'blue');
        item.set('option_amount0', 123.00);

        options = item.options();

        assert.deepEqual(options[0].amount, 123.00);
        assert.strictEqual(options[1].amount, 0);
    });


    it('discount() calculates flat rate discounts', function () {
        item.set('discount_amount', 1.00);
        item.set('discount_amount2', 0.50);
        item.set('quantity', 3);

        assert.strictEqual(item.discount(), 2.00);
    });


    it('discount() calculates percentage discounts', function () {
        item.set('discount_rate', 25);
        item.set('discount_rate2', 50);
        item.set('quantity', 3);

        assert.strictEqual(item.discount(), 1.5375);
    });


    it('discount() returns a formatted discount', function () {
        item.set('discount_amount', 1.00);
        item.set('discount_amount2', 0.50);
        item.set('quantity', 3);

        assert.strictEqual(item.discount({ format: true }), '$2.00');
    });


    it('discount() should honor currency code', function () {
        item.set('discount_amount', 1.00);
        item.set('discount_amount2', 0.50);
        item.set('quantity', 3);

        assert.strictEqual(item.discount({ format: true, currency: 'EUR' }), '€2.00');
    });


    it('flat rate discounts apply when the first is zero', function () {
        item.set('discount_amount', 0);
        item.set('discount_amount2', 1.00);
        item.set('quantity', 3);

        assert.strictEqual(item.discount(), 2.00);
    });


    it('percentage discounts apply when the first is zero', function () {
        item.set('discount_rate', 0);
        item.set('discount_rate2', 50);
        item.set('quantity', 4);

        assert.strictEqual(item.discount(), 1.845);
    });


    it('amount() returns an individual product amount', function () {
        assert.strictEqual(item.amount(), 1.23);

        item.set('quantity', 2);
        assert.strictEqual(item.amount(), 1.23);

        item.set('on0', 'color');
        item.set('os0', 'blue');
        item.set('option_select0', 'blue');
        item.set('option_amount0', 123.00);

        assert.strictEqual(item.amount(), 124.23);
    });


    it('amount() should honor currency codes', function () {
        assert.strictEqual(item.amount({ format: true, currency: 'EUR'}), '€1.23');
    });


    it('total() returns the product total', function () {
        assert.strictEqual(item.total(), 1.23);

        item.set('quantity', 2);
        assert.strictEqual(item.total(), 2.46);
    });


    it('total() takes into account option amounts', function () {
        item.set('on0', 'color');
        item.set('os0', 'blue');
        item.set('option_select0', 'blue');
        item.set('option_amount0', 123.00);

        assert.strictEqual(item.total(), 124.23);

        item.set('quantity', 2);
        assert.strictEqual(item.total(), 248.46);
    });


    it('total() takes into account discounts', function () {
        item.set('discount_amount', 0.23);

        assert.strictEqual(item.total(), 1.00);
    });


    it('total() returns the formatted product total', function () {
        var item1 = new Product({
            name: 'Foo',
            desc: 'This is an item, foo',
            amount: 1.23
        });

        assert.strictEqual(item1.total({ format: true }), '$1.23');
    });


    it('total() should honor currency codes', function () {
        assert.strictEqual(item.total({ format: true, currency: 'EUR' }), '€1.23');
    });


    it('isEqual() correctly identifies similar products', function () {
        var item1 = new Product({
            item_name: 'Foo',
            item_number: 'This is an item, foo',
            amount: 1.23,
            os0: true,
            os1: true
        });

        var item2 = new Product({
            item_name: 'Foo',
            item_number: 'This is an item, foo',
            amount: 1.23,
            os0: true,
            os1: true
        });

        var item3 = new Product({
            item_name: 'Foo',
            item_number: 'This is an item, foo',
            amount: 1.23,
            os0: true,
            os1: false
        });

        var item4 = new Product({
            item_name: 'Bar',
            item_number: 'This is not the same as item1',
            amount: 4.56
        });

        assert(item1.isEqual(item2));
        assert(!item1.isEqual(item3));
        assert(!item1.isEqual(item4));
    });


    it('isValid() validates correctly', function () {
        var item1 = new Product({
            item_name: 'Foo',
            amount: 1.23
        });

        var item2 = new Product({});

        assert(item1.isValid());
        assert(!item2.isValid());
    });


    it('destroy() empties data', function () {
        item.destroy();

        assert.strictEqual(item.get('name'), undefined);
        assert.strictEqual(item.get('desc'), undefined);
        assert.strictEqual(item.get('amount'), undefined);
    });


    it('destroy() fires an event', function (done) {
        item.on('destroy', function (item2) {
            assert.equal(item, item2);
            done();
        });

        item.destroy();
    });
});
