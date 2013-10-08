'use strict';


var Product = require('./product'),
    Cart = require('./cart'),
    config = require('./config'),
    minicart = {},
    isShowing = false,
    cartModel;


function addItem(idx, data) {
    minicart.show();
}

function changeItem(idx, data) {
    minicart.show();
}


function removeItem(idx) {
    minicart.show();
}



minicart.render = function render(userConfig) {
    var wrapper;

    config.load(userConfig);

    wrapper = document.createElement('div');
    wrapper.id = config.name;
    wrapper.innerHTML = config.template;

    config.parent.appendChild(wrapper);

//    cartModel = minicart.data = new Cart();
//    cartModel.on('add', addItem);
//    cartModel.on('change', changeItem);
//    cartModel.on('remove', removeItem);
};

//
//minicart.bind = function bind(form) {
//
//};
//
//
//minicart.show = function show() {
//    if (!isShowing) {
//        config.parent.addClass('showing');
//        isShowing = true;
//    }
//};
//
//
//minicart.hide = function hide() {
//    if (isShowing) {
//        config.parent.removeClass('showing');
//        isShowing = false;
//    }
//};
//
//
//minicart.toggle = function toggle() {
//    minicart[isShowing ? 'hide' : 'show']();
//};
//
//
//minicart.reset = function reset() {
//    minicart.hide();
//    cartModel.destroy();
//};




// Export
(function (win) {
    if (!win.paypal) {
        win.paypal = {};
    }

    win.paypal.minicart = minicart;
})(window || module.exports);



