'use strict';


var assert = require('assert'),
    Storage = require('../../src/util/storage');



describe('Storage', function () {

    var store;


    before(function () {
        var items = {};

        // Mock localStorage in the global scope
        var window = global.window = {};

        window.localStorage = {
            getItem: function (key) {
                return items[key];
            },
            setItem: function (key, value) {
                items[key] = value;
            },
            removeItem: function (key) {
                delete items[key];
            }
        };
    });


    after(function () {
        // Remove localStorage mock
        delete global.window;
    });


    beforeEach(function () {
        store = new Storage('test');
    });


    afterEach(function () {
        if (store) {
            store.destroy();
        }
    });



    it('should initially load a false value', function () {
        assert(!store.load());
    });


    it('should be able to save an item and load it back', function () {
        var data;

        store.save({ foo: 'bar' });

        data = store.load();

        assert(data.foo === 'bar');
    });


    it('should be able to save data and then destroy it', function () {
        var data;

        store.save({ foo: 'bar' });

        data = store.load();

        assert(data.foo === 'bar');

        store.destroy();

        assert(!store.load());
    });


    it('should expire old data', function (done) {
        var data;

        store = new Storage('test', 1000 / 24 / 60 / 60 / 1000);
        store.save({ foo: 'bar' });

        // Make sure the value is initially there
        data = store.load();
        assert(data.foo === 'bar');

        // Try it again after the expires time
        setTimeout(function () {
            assert(!store.load());
            done();
        }, 1500);
    });


});
