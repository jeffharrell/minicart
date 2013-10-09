'use strict';


var config = module.exports = {

    name: 'PPMiniCart',

    parent: document.body,

    action: 'https://www.paypal.com/cgi-bin/webscr',

    target: '',

    duration: 30,

    cookiePath: '/',

    bn: 'MiniCart_AddToCart_WPS_US',

    resetOnSuccess: true,

    template: '<form method="post" action="<%= config.action %>" target="<%= config.target %>">' +
        '<input type="hidden" name="cmd" value="_cart">' +
        '<input type="hidden" name="upload" value="1">' +
        '<input type="hidden" name="bn" value="<%= config.bn %>">' +
        '<ul>' +
        '<% for (var items = cart.getAll(), i= 0, len = items.length; i < len; i++) { %>' +
        '<li class="minicart-item">' +
        '<a class="minicart-name" href="<%= items[i].link %>"><%= items[i].item_name %></a>' +
        '<span class="minicart-number"><%= items[i].item_number %></span>' +
        '<input class="minicart-quantity" name="quantity_<%= i %>" autocomplete="off">' +
        '<input type="button">' +
        '<span class="minicart-price"><%= items[i].amount.toFixed(2) %></span>' +
        '<input type="hidden" name="item_name_<%= i %>" value="<%= items[i].item_name %>">' +
        '<input type="hidden" name="item_number_<%= i %>" value="<%= items[i].item_number %>">' +
        '<input type="hidden" name="amount_<%= i %>" value="<%= items[i].amount %>">' +
        '</li>' +
        '<% } %>' +
        '</ul>' +
        '<p>' +
        '<input class="minicart-submit" type="submit" value="<%= config.strings.button %>" data-test-processing="<%= config.strings.processing %>">' +
        '<span class="minicart-subtotal"><%= config.strings.subtotal %> <span class="minicart-subtotal-amount"><%= cart.total() %></span></span>' +
        '<span class="minicart-shipping"><%= config.strings.shipping %></span>' +
        '</p>' +
        //'<input type="hidden" name="business" value="example@minicartjs.com">' +
        //'<input type="hidden" name="currency_code" value="USD">' +
        //'<input type="hidden" name="return" value="http://www.minicartjs.com/?success#PPMiniCart=reset">' +
        //'<input type="hidden" name="cancel_return" value="http://www.minicartjs.com/?cancel">' +
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

    return config;
};