/*global assert:true */

'use strict';




describe('View', function () {

	var minicart = window.paypal.minicart,
		config = minicart.config;


	it('should write styles to the page', function () {
		var head = document.getElementsByTagName('head')[0],
			styles = head.getElementsByTagName('style'),
			css = styles[styles.length - 1].textContent;

		assert(css === config.styles);
	});


	it('should render into the parent element', function () {
		var el = document.getElementById(config.name);

		assert(el && el.parentNode === config.parent);
	});


	it('should add a class on the body on show()', function () {
		assert(document.body.className === '');
		minicart.show();
		assert(document.body.className === 'minicart-showing');
	});


	it('should remove the class on the body hide()', function () {
		assert(document.body.className === 'minicart-showing');
		minicart.hide();
		assert(document.body.className === '');
	});


	it('should show/hide correctly on toggle()', function () {
		assert(document.body.className === '');
		minicart.toggle();
		assert(document.body.className === 'minicart-showing');
		minicart.toggle();
		assert(document.body.className === '');
	});


	it.skip('should remain visible if the cart is selected', function () {});


	it.skip('should hide anything but the cart is selected', function () {});


	it.skip('should bind itself to cart buttons', function () {});


	it.skip('should bind itself to buy now buttons', function () {});


	it.skip('should bind itself to donate buttons', function () {});


	it.skip('should bind itself to view buttons', function () {});


	it.skip('should bind() to forms', function () {});


	it.skip('should update when a new product is added', function () {});


	it.skip('should should when a new product is added', function () {});


	it.skip('should update when a product is changed', function () {});


	it.skip('should update when a product is removed', function () {});


	it.skip('should hide when the last product is removed', function () {});


	it.skip('should display item names', function () {});


	it.skip('should display item numbers', function () {});


	it.skip('should display item amounts', function () {});


	it.skip('should display discounts', function () {});


	it.skip('should display options', function () {});


	it.skip('should display a subtotal', function () {});
});
