/*global assert:true */

'use strict';


var minicart = window.paypal.minicart;
var config = minicart.config;
var cartData = [
    { item_name: 'Test item 1', amount: 1.00 },
    { item_name: 'Test item 2', amount: 2.00, quantity: 2 },
    { item_name: 'Test item 3', amount: 3, item_number: '123ABC' },
    { item_name: 'Test item 4', amount: 100.00, discount_amount: 99.00 },
    { item_name: 'Test item 5', amount: 0.00, on0: 'Size', os0: 'Large', option_select0: 'Large', option_amount0: 50.00 },
    { item_name: 'Test item 6', amount: 1.00, discount_amount: 0.50, currency_code: 'EUR' },
    { item_name: 'Test item 7', amount: 3.00, quantity: 2, shipping: 1, shipping2: 2 }
];


function fakeEvent(el, type) {
    var event;

    if (type === 'click') {
        type = ('ontouchstart' in window) ? 'touchstart' : 'click';
    }

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
    var li, attrsList, attrsData = [], i, len;

    if ((li = document.querySelectorAll('.minicart-item')[idx])) {

        attrsList = li.querySelectorAll('.minicart-attributes')[0];
        attrsList = attrsList && attrsList.getElementsByTagName('li');

        if (attrsList) {
            for (i = 0, len = attrsList.length; i < len; i++) {
                attrsData.push(attrsList[i].textContent.replace(/^\s+|\s+$/g, ''));
            }
        }

        return {
            name: li.getElementsByTagName('a')[0].textContent.replace(/^\s+|\s+$/g, ''),
            quantity: li.querySelectorAll('.minicart-quantity')[0].value,
            amount: li.querySelectorAll('.minicart-price')[0].textContent.replace(/^\s+|\s+$/g, ''),
            options: attrsData
        };
    } else {
        return false;
    }
}



describe('View', function () {

    var mockData;


    after(function () {
        minicart.reset();
    });


    beforeEach(function () {
        minicart.reset();
        mockData = JSON.parse(JSON.stringify(cartData));
    });


    it('should clear the contents on reset()', function () {
        minicart.cart.add(mockData[0]);
        minicart.cart.add(mockData[1]);

        assert(getItem(0) !== false);
        assert(getItem(1) !== false);

        minicart.reset();

        assert(getItem(0) === false);
        assert(getItem(1) === false);
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
        minicart.view.show();
        assert(isCartShowing());
    });


    it('should remove the class on the body hide()', function () {
        minicart.view.show();
        assert(isCartShowing());
        minicart.view.hide();
        assert(!isCartShowing());
    });


    it('should show/hide correctly on toggle()', function () {
        assert(!isCartShowing());
        minicart.view.toggle();
        assert(isCartShowing());
        minicart.view.toggle();
        assert(!isCartShowing());
    });


    it('should remain visible if the cart is selected', function () {
        minicart.view.show();
        fakeEvent(document.getElementById(config.name), 'click');
        assert(isCartShowing());
    });


    it('should hide if anything but the cart is selected', function () {
        minicart.view.show();
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


    it('should bind() to forms', function () {
        var form, input;

        form = document.createElement('form');
        form.action = 'https://www.paypal.com/cgi-bin/webscr';
        form.method = 'post';

        input = document.createElement('input');
        input.name = 'business';
        input.value = 'business@minicartjs.com';
        form.appendChild(input);

        input = document.createElement('input');
        input.name = 'cmd';
        input.value = '_cart';
        form.appendChild(input);

        input = document.createElement('input');
        input.name = 'display';
        input.value = '1';
        form.appendChild(input);

        document.body.appendChild(form);
        minicart.view.bind(form);

        fakeEvent(form, 'submit');
        assert(isCartShowing());

        document.body.removeChild(form);
    });


    it('should not re-bind() forms', function () {
        var form, input;

        form = document.createElement('form');
        form.action = 'https://www.paypal.com/cgi-bin/webscr';
        form.method = 'post';

        input = document.createElement('input');
        input.name = 'business';
        input.value = 'business@minicartjs.com';
        form.appendChild(input);

        input = document.createElement('input');
        input.name = 'cmd';
        input.value = '_cart';
        form.appendChild(input);

        document.body.appendChild(form);

        assert(minicart.view.bind(form) === true);
        assert(minicart.view.bind(form) === false);

        document.body.removeChild(form);
    });


    it('should add items via the API', function () {
        minicart.cart.add(mockData[0]);
        assert(getItem(0).name === 'Test item 1');
    });


    it('should update items via the API', function () {
        minicart.cart.add(mockData[0]);

        var item = minicart.cart.items(0);
        item.set('quantity', 2);

        assert(getItem(0).quantity === '2');
        assert(getItem(0).amount === '$2.00');
    });


    it('should remove items via the API', function () {
        minicart.cart.add(mockData[0]);
        assert(typeof getItem(0) === 'object');

        minicart.cart.remove(0);
        assert(getItem(0) === false);
    });


    it('should update products via the UI', function (done) {
        var input;

        minicart.cart.add(mockData[0]);

        input = document.querySelectorAll('.minicart-quantity')[0];
        input.value = 3;
        fakeEvent(input, 'keyup');

        setTimeout(function () {
            assert(getItem(0).amount === '$3.00');
            done();
        }, 600);
    });


    it('should not update empty quantities via the UI', function (done) {
        var input;

        minicart.cart.add(mockData[0]);

        input = document.querySelectorAll('.minicart-quantity')[0];
        input.value = '';
        fakeEvent(input, 'keyup');

        setTimeout(function () {
            assert(getItem(0).amount === '$1.00');
            done();
        }, 600);
    });


    it('should not update non-numeric quantities via the UI', function (done) {
        var input;

        minicart.cart.add(mockData[0]);

        input = document.querySelectorAll('.minicart-quantity')[0];
        input.value = 'asdf';
        fakeEvent(input, 'keyup');

        setTimeout(function () {
            assert(getItem(0).amount === '$1.00');
            done();
        }, 600);
    });


    it('should update when a product is removed', function () {
        minicart.cart.add(mockData[0]);
        assert(typeof getItem(0) === 'object');

        fakeEvent(document.querySelectorAll('.minicart-remove')[0], 'click');
        assert(getItem(0) === false);
    });


    it('should hide when the last product is removed', function () {
        minicart.cart.add(mockData[0]);
        minicart.cart.add(mockData[1]);

        minicart.cart.remove(0);
        assert(isCartShowing());
        minicart.cart.remove(0);
        assert(!isCartShowing());
    });


    it('should not have inputs for undefined values', function () {
        var cart, form;

        minicart.cart.add(mockData[0]);

        cart = document.getElementById(config.name);
        form = cart.getElementsByTagName('form')[0];

        assert(typeof form.elements.item_number_1 === 'undefined');
        assert(typeof form.elements.on0_1 === 'undefined');
        assert(typeof form.elements.os0_1 === 'undefined');
    });


    it('should display item names', function () {
        minicart.cart.add(mockData[0]);
        assert(getItem(0).name === 'Test item 1');
    });


    it('should have item name data', function () {
        var cart, form;

        minicart.cart.add(mockData[0]);

        cart = document.getElementById(config.name);
        form = cart.getElementsByTagName('form')[0];

        assert(form.elements.item_name_1.value === 'Test item 1');
    });


    it('should display item numbers', function () {
        minicart.cart.add(mockData[2]);
        assert(getItem(0).options[0] === '123ABC');
    });


    it('should have item number data', function () {
        var cart, form;

        minicart.cart.add(mockData[2]);

        cart = document.getElementById(config.name);
        form = cart.getElementsByTagName('form')[0];


        assert(form.elements.item_number_1.value === '123ABC');
    });


    it('should display item amounts', function () {
        minicart.cart.add(mockData[1]);
        assert(getItem(0).amount === '$4.00');
    });


    it('should display item amounts with the correct currency', function () {
        minicart.cart.add(mockData[5]);
        assert(getItem(0).amount === '€0.50');
    });


    it('should have item amount data', function () {
        var cart, form;

        minicart.cart.add(mockData[1]);

        cart = document.getElementById(config.name);
        form = cart.getElementsByTagName('form')[0];

        assert(form.elements.amount_1.value === '2');
    });


    it('should display discounts', function () {
        minicart.cart.add(mockData[3]);
        assert(getItem(0).options[0] === 'Discount: $99.00');
    });


    it('should display discounts with correct currency', function () {
        minicart.cart.add(mockData[5]);
        assert(getItem(0).options[0] === 'Discount: €0.50');
    });


    it('should have discount data', function () {
        var cart, form;

        minicart.cart.add(mockData[3]);

        cart = document.getElementById(config.name);
        form = cart.getElementsByTagName('form')[0];

        assert(form.elements.discount_amount_1.value === '99');
    });


    it('should display options', function () {
        minicart.cart.add(mockData[4]);
        assert(getItem(0).amount === '$50.00');
        assert(getItem(0).options[0] === 'Size: Large');
    });


    it('should have option data', function () {
        var cart, form;

        minicart.cart.add(mockData[4]);

        cart = document.getElementById(config.name);
        form = cart.getElementsByTagName('form')[0];

        assert(form.elements.on0_1.value === 'Size');
        assert(form.elements.os0_1.value === 'Large');
    });


    it('should display a subtotal', function () {
        minicart.cart.add(mockData[0]);
        minicart.cart.add(mockData[1]);

        assert(document.querySelectorAll('.minicart-subtotal')[0].textContent.replace(/^\s+|\s+$/g, '') === 'Subtotal: $5.00 USD');
    });


    it('should display a subtotal with correct currency', function () {
        minicart.cart.add(mockData[5]);

        assert(document.querySelectorAll('.minicart-subtotal')[0].textContent.replace(/^\s+|\s+$/g, '') === 'Subtotal: €0.50');
    });


    it('should have shipping data', function () {
        var cart, form;

        minicart.cart.add(mockData[6]);

        cart = document.getElementById(config.name);
        form = cart.getElementsByTagName('form')[0];

        assert(form.elements.shipping_1.value === '1');
        assert(form.elements.shipping2_1.value === '2');
    });


    it('should have a checkout button with items', function () {
        var cart, button;

        minicart.cart.add(mockData[0]);

        cart = document.getElementById(config.name);
        button = cart.querySelectorAll('.minicart-submit')[0];

        assert(!!button);
    });


    it('should not have a checkout button without items', function () {
        var cart, button;

        minicart.view.show();

        cart = document.getElementById(config.name);
        button = cart.querySelectorAll('.minicart-submit')[0];

        assert(!button);
    });


    it('should have a valid data store', function () {
        var data;

        assert(!localStorage[config.name]);

        minicart.cart.add(mockData[0]);

        data = JSON.parse(decodeURIComponent(localStorage[config.name]));

        assert(typeof data === 'object');
        assert(data.expires);
        assert(data.value);
        assert(data.value.items);
        assert(data.value.settings);
    });


});
