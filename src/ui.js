'use strict';


var Product = require('./product'),
    Cart = require('./cart'),
    config = require('./config'),
    isShowing = false,
    ui = {},
    cartModel;


function addItem(idx, data) {
    ui.show();
}

function changeItem(idx, data) {
    ui.show();
}


function removeItem(idx) {
    ui.show();
}


function bindForm(form) {

}


ui.render = function render(userConfig) {
    config.load(userConfig);

    // TODO: load stored data

    cartModel = new Cart();
    cartModel.on('add', addItem);
    cartModel.on('change', changeItem);
    cartModel.on('remove', removeItem);
};


ui.show = function show() {
    if (!isShowing) {
        config.parent.addClass('show');
        isShowing = true;
    }
};


ui.hide = function hide() {
    if (isShowing) {
        config.parent.removeClass('show');
        isShowing = false;
    }
};


ui.toggle = function toggle() {
    ui[isShowing ? 'hide' : 'show']();
};


ui.reset = function reset() {
    ui.hide();
    cartModel.destroy();
};




module.exports = ui;