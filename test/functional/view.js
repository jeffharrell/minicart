/*global assert:true */

'use strict';


var minicart = window.paypal.minicart,
	config = minicart.config;


function fakeEvent(el, type) {
	var event;

	if (document.createEvent) {
		event = document.createEvent('HTMLEvents');
		event.initEvent(type, true, true);
	} else {
		event = document.createEventObject();
		event.eventType = 'on' + type;
	}

	if (document.createEvent) {
		el.dispatchEvent(event);
	} else {
		el.fireEvent(event.eventType, event);
	}
}


function isCartShowing() {
	return document.body.className === 'minicart-showing';
}


function getItem(idx) {
	var li = document.getElementsByClassName('minicart-item')[idx];

	return {
		name: li.getElementsByTagName('a')[0].textContent
	};
}




describe('View', function () {


	beforeEach(function () {
		minicart.reset();
	});


	it('should write styles to the page', function () {
		var styles = document.head.getElementsByTagName('style'),
			css = styles[styles.length - 1].textContent;

		assert(css === config.styles);
	});


	it('should render into the parent element', function () {
		var el = document.getElementById(config.name);
		assert(el && el.parentNode === config.parent);
	});


	it('should add a class on the body on show()', function () {
		assert(!isCartShowing());
		minicart.show();
		assert(isCartShowing());
	});


	it('should remove the class on the body hide()', function () {
		minicart.show();
		assert(isCartShowing());
		minicart.hide();
		assert(!isCartShowing());
	});


	it('should show/hide correctly on toggle()', function () {
		assert(!isCartShowing());
		minicart.toggle();
		assert(isCartShowing());
		minicart.toggle();
		assert(!isCartShowing());
	});


	it('should remain visible if the cart is selected', function () {
		minicart.show();
		fakeEvent(document.getElementById(config.name), 'click');
		assert(isCartShowing());
	});


	it('should hide if anything but the cart is selected', function () {
		minicart.show();
		fakeEvent(document.body, 'click');
		assert(!isCartShowing());
	});


	it('should bind itself to cart buttons', function () {
		fakeEvent(document.getElementById('cartButton'), 'submit');

		assert(isCartShowing());
		assert(getItem(0).name === 'Unicorn');
	});


	it('should bind itself to buy now buttons', function () {
		fakeEvent(document.getElementById('buyNowButton'), 'submit');

		assert(isCartShowing());
		assert(getItem(0).name === 'Rainbow');
	});


	it('should bind itself to donate buttons', function () {
		fakeEvent(document.getElementById('donateButton'), 'submit');

		assert(isCartShowing());
		assert(getItem(0).name === 'Pony');
	});


	it('should bind itself to view buttons', function () {
		fakeEvent(document.getElementById('viewButton'), 'submit');
		assert(isCartShowing());
	});


	it.skip('should bind() to forms', function () {});


	it.skip('should add items using the API', function () {});


	it.skip('should remove items using the API', function () {});


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


	it.skip('should clear the contents on reset()', function () {

	});
});
