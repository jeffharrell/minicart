'use strict';

var assert = require('assert'),
    config = require('../../src/config');


describe('Config', function () {

    it('has the required keys', function () {
        var keys = Object.keys(config);

        assert(~keys.indexOf('name'));
        assert(~keys.indexOf('parent'));
        assert(~keys.indexOf('target'));
        assert(~keys.indexOf('duration'));
        assert(~keys.indexOf('template'));
        assert(~keys.indexOf('styles'));
        assert(~keys.indexOf('strings'));
    });


    it('can be overridden by user settings', function () {
        config.load({
            name: 'Foo',
            duration: 1,
            strings: {
                button: 'Go'
            }
        });

        assert.equal(config.name, 'Foo');
        assert.equal(config.duration, 1);
        assert.equal(config.strings.button, 'Go');
    });


    it('recursively merges user settings', function () {
        assert.equal(config.strings.button, 'Go');
        assert.equal(config.strings.subtotal, 'Subtotal:');
        assert.equal(config.strings.discount, 'Discount:');
    });

});
