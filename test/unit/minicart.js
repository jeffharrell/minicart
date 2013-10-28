'use strict';


var assert = require('assert'),
	minicart = require('../../src/minicart');


describe('Minicart', function () {

	it('show have a render method', function () {
		assert(typeof minicart.render === 'function');
	});


	it('show have a show method', function () {
		assert(typeof minicart.show === 'function');
	});


	it('show have a hide method', function () {
		assert(typeof minicart.hide === 'function');
	});


	it('show have a toggle method', function () {
		assert(typeof minicart.toggle === 'function');
	});


	it('show have a reset method', function () {
		assert(typeof minicart.reset === 'function');
	});

});
