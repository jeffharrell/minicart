'use strict';

// TODO: code comments!
// - cross browser support
// - Update examples


var Cart = require('./cart'),
	View = require('./view'),
    config = require('./config'),
    minicart = {},
	cartModel,
	confModel,
	viewModel;


minicart.render = function (userConfig) {
	confModel = minicart.config = config.load(userConfig);
	cartModel = minicart.cart = new Cart(confModel.name, confModel.duration);
	viewModel = minicart.view = new View({
		config: confModel,
		cart: cartModel
	});

	cartModel.on('add', viewModel.addItem, viewModel);
	cartModel.on('change', viewModel.changeItem, viewModel);
	cartModel.on('remove', viewModel.removeItem, viewModel);
	cartModel.on('destroy', viewModel.hide, viewModel);
};


minicart.reset = function () {
    cartModel.destroy();

	viewModel.hide();
	viewModel.redraw();
};




// Export for either the browser or node
if (typeof window === 'undefined') {
	module.exports = minicart;
} else {
	if (!window.paypal) {
		window.paypal = {};
	}

	window.paypal.minicart = minicart;
}
