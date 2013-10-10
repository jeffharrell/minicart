'use strict';


var config = module.exports = {

    name: 'PPMiniCart',

    parent: (typeof document !== 'undefined') ? document.body : null,

    action: 'https://www.paypal.com/cgi-bin/webscr',

    target: '',

    duration: 30,

    cookiePath: '/',

    bn: 'MiniCart_AddToCart_WPS_US',

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
        '<div>' +
        '<div class="minicart-subtotal"><%= config.strings.subtotal %> <span class="minicart-subtotal-amount"><%= cart.total() %></span></div>' +
        '<div class="minicart-shipping"><%= config.strings.shipping %></div>' +
        '<input class="minicart-submit" type="submit" value="<%= config.strings.button %>" data-test-processing="<%= config.strings.processing %>">' +
        '</div>' +
        //'<input type="hidden" name="business" value="example@minicartjs.com">' +
        //'<input type="hidden" name="currency_code" value="USD">' +
        //'<input type="hidden" name="return" value="http://www.minicartjs.com/?success#PPMiniCart=reset">' +
        //'<input type="hidden" name="cancel_return" value="http://www.minicartjs.com/?cancel">' +
        '</form>',

    styles: '' +
        '#PPMiniCart form { position: absolute; top: 50%; left: 50%; width: 300px; max-height: 400px; margin-left: -150px; margin-top: -200px; padding: 10px; background: #fff url(http://www.minicartjs.com/build/images/minicart_sprite.png) no-repeat -125px -60px; border: 1px solid #999; border-radius: 5px; box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.2); font: 13px/normal arial, helvetica; color: #333; }' +
        '#PPMiniCart ul { margin: 45px 0 0; border-bottom: 1px solid #ccc; }' +
        '#PPMiniCart .minicart-submit { padding: 1px 4px; background: #ffa822 url(http://www.minicartjs.com/build/images/minicart_sprite.png) repeat-x left center; border: 1px solid #d5bd98; border-right-color: #935e0d; border-bottom-color: #935e0d; border-radius: 2px; }',

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