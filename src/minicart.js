'use strict';


var Cart = require('./cart'),
    config = require('./config'),
    util = require('./util'),
    minicart = {},
    cartModel, isShowing;



function redraw() {
    minicart.el.innerHTML = util.template(config.template, minicart);
    minicart.show();
}


minicart.render = function render(userConfig) {
    var wrapper;

    minicart.config = config.load(userConfig);

    cartModel = minicart.cart = new Cart();
    cartModel.on('add', redraw);
    cartModel.on('change', redraw);
    cartModel.on('remove', redraw);

    wrapper = minicart.el = document.createElement('div');
    wrapper.id = config.name;

    redraw();

    config.parent.appendChild(wrapper);
};


minicart.show = function show() {
    if (!isShowing) {
        config.parent.classList.add('showing');
        isShowing = true;
    }
};


minicart.hide = function hide() {
    if (isShowing) {
        config.parent.classList.remove('showing');
        isShowing = false;
    }
};


minicart.toggle = function toggle() {
    minicart[isShowing ? 'hide' : 'show']();
};


minicart.reset = function reset() {
    minicart.hide();
    cartModel.destroy();

    redraw();
};




// Export for either the browser or node
(function (win) {
    if (!win.paypal) {
        win.paypal = {};
    }

    win.paypal.minicart = minicart;
})(window || module.exports);



