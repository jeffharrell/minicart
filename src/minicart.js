'use strict';

// TODO:
// - UI tests
// - View tests
// - cross browser support
// - Update examples


var Cart = require('./cart'),
	View = require('./view'),
    config = require('./config'),
    minicart = {},
	cartModel,
	confModel,
	viewModel;


minicart.render = function render(userConfig) {
	confModel = config.load(userConfig);
	cartModel = minicart.cart = new Cart(confModel.name, confModel.duration);

	viewModel = new View({
		config: confModel,
		cart: cartModel
	});

	cartModel.on('add', viewModel.addItem, viewModel);
	cartModel.on('change', viewModel.changeItem, viewModel);
	cartModel.on('remove', viewModel.removeItem, viewModel);
};


minicart.show = function () {
	viewModel && viewModel.show();
};


minicart.hide = function () {
	viewModel && viewModel.hide();
};


minicart.toggle = function () {
	viewModel && viewModel.toggle();
};


minicart.reset = function reset() {
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
