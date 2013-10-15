'use strict';


var assert = require('assert'),
    Product = require('../src/product');


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
        assert.equal(item.get('name'), 'Foo');
        assert.equal(item.get('desc'), 'This is an item, foo');
        assert.equal(item.get('amount'), 1.23);
    });


    it('set() writes data', function () {
        item.set('name', 'Bar');
        item.set('desc', 'Where is the bar?');
        item.set('amount', 4.56);
        item.set('something', 'random');

        assert.equal(item.get('name'), 'Bar');
        assert.equal(item.get('desc'), 'Where is the bar?');
        assert.equal(item.get('amount'), 4.56);
        assert.equal(item.get('something'), 'random');
    });


    it('set() fires an event', function (done) {
        item.on('change', function (data) {
            assert.equal(data.name, 'Baz');
            done();
        });

        item.set('name', 'Baz');
    });


    it('qty() returns the quantity', function () {
        item.set('quantity', 1234);
        assert.equal(item.qty(), 1234);
    });


    it('qty() returns 1 for null quantities', function () {
        assert.equal(item.qty(item), 1);
    });


    it('total() returns the cart product total', function () {
        assert.equal(item.total(), '$1.23');

        item.set('quantity', 2);
        assert.equal(item.total(), '$2.46');

    });


    it('total() returns the unformatted cart product total', function () {
        assert.equal(item.total({ unformatted: true }), 1.23);

        item.set('quantity', 2);
        assert.equal(item.total({ unformatted: true }), 2.46);
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


    it('destroy() empties data', function () {
        item.destroy();

        assert.equal(item.get('name'), undefined);
        assert.equal(item.get('desc'), undefined);
        assert.equal(item.get('amount'), undefined);
    });


    it('destroy() fires an event', function (done) {
        item.on('destroy', function (item2) {
            assert.equal(item, item2);
            done();
        });

        item.destroy();
    });
});
