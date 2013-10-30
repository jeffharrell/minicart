/*global assert:true */


'use strict';


describe('Minicart', function () {

	it('should add a paypal object to the window', function () {
		assert(window && window.paypal);
	});


	it('show have a render method', function () {
		assert(typeof window.paypal.minicart.render === 'function');
	});


	it('show have a show method', function () {
		assert(typeof window.paypal.minicart.show === 'function');
	});


	it('show have a hide method', function () {
		assert(typeof window.paypal.minicart.hide === 'function');
	});


	it('show have a toggle method', function () {
		assert(typeof window.paypal.minicart.toggle === 'function');
	});


	it('show have a reset method', function () {
		assert(typeof window.paypal.minicart.reset === 'function');
	});

});
