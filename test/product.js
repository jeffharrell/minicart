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

        assert.equal(item.get('name'), 'Bar');
        assert.equal(item.get('desc'), 'Where is the bar?');
        assert.equal(item.get('amount'), 4.56);
    });


    it('set() fires an event', function (done) {
        item.on('change', function (name, value) {
            assert.equal(name, 'name');
            assert.equal(value, 'Baz');
            done();
        });

        item.set('name', 'Baz');
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