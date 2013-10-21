'use strict';

// TODO:
// - UI tests
// - cross browser support


var Cart = require('./cart'),
	View = require('./view'),
    config = require('./config'),
    minicart = {},
	cartModel,
	confModel,
	viewModel;



minicart.render = function render(userConfig) {
	confModel = config.load(userConfig);
	cartModel = new Cart(confModel.name, confModel.duration);

	viewModel = new View({
		config: confModel,
		cart: cartModel
	});

	minicart.show = viewModel.show();
	minicart.hide = viewModel.hide();
	minicart.toggle = viewModel.toggle();

	cartModel.on('add', viewModel.addItem, viewModel);
	cartModel.on('change', viewModel.changeItem, viewModel);
	cartModel.on('remove', viewModel.removeItem, viewModel);
};


minicart.show = function () {};


minicart.hide = function () {};


minicart.toggle = function () {};


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
