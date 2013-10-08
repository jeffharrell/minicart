'use strict';


var config = module.exports = {

    name: 'PPMiniCart',

    parent: document.body,

    template: '<form method="post" action="https://www.paypal.com/cgi-bin/webscr">' +
        '<input type="hidden" name="cmd" value="_cart">' +
        '<input type="hidden" name="upload" value="1">' +
        '<input type="hidden" name="bn" value="MiniCart_AddToCart_WPS_US">' +
        '<ul>' +
        '<li>' +
        '<a href="http://minicartjs.com/">Product 2<span>12345<br><input type="hidden" name="discount_amount_1" value="0"></span></a>' +
        '<input name="quantity_1" class="quantity" autocomplete="off">' +
        '<input type="button" class="remove">' +
        '<span class="price">$2.00</span>' +
        '<input type="hidden" name="cmd_1" value="_cart">' +
        '<input type="hidden" name="add_1" value="1">' +
        '<input type="hidden" name="item_name_1" value="Product 2">' +
        '<input type="hidden" name="item_number_1" value="12345">' +
        '<input type="hidden" name="amount_1" value="2.00">' +
        '<input type="hidden" name="submit_1" value="Add to cart">' +
        '<input type="hidden" name="href_1" value="http://minicartjs.com/">' +
        '<input type="hidden" name="offset_1" value="0">' +
        '</li>' +
        '</ul>' +
        '<p>' +
        '<input type="submit" value="Checkout">' +
        '<span>Subtotal: <span>$2.00</span></span>' +
        '<span class="shipping">does not include shipping &amp; tax</span>' +
        '</p>' +
        '<input type="hidden" name="business" value="example@minicartjs.com">' +
        '<input type="hidden" name="currency_code" value="USD">' +
        '<input type="hidden" name="return" value="http://www.minicartjs.com/?success#PPMiniCart=reset">' +
        '<input type="hidden" name="cancel_return" value="http://www.minicartjs.com/?cancel">' +
        '</form>',

    styles: '',

    strings: {
        button: 'Checkout',
        subtotal: 'Subtotal: ',
        discount: 'Discount: ',
        shipping: 'Does not include shipping & tax',
        processing: 'Processing...'
    }

};


module.exports.load = function load(userConfig) {
    // TODO: This should recursively merge the config values
    for (var key in userConfig) {
        config[key] = userConfig[key];
    }
};