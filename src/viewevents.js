'use strict';


var constants = require('./constants');



module.exports = {

	click: function (e) {
		var target = e.target;

		if (target.className === 'minicart-remove') {
			this.model.cart.remove(target.getAttribute('data-minicart-idx'));
			e.stopPropagation();
			e.preventDefault();
		} else if (target.className === 'minicart-closer') {
			this.hide();
			e.stopPropagation();
			e.preventDefault();
		} else if (this.isShowing) {
			if (!(/input|button|select|option/i.test(target.tagName))) {
				while (target.nodeType === 1) {
					if (target === this.el) {
						return;
					}

					target = target.parentNode;
				}

				this.hide();
				e.stopPropagation();
				e.preventDefault();
			}
		}
	},


	keyup: function (e) {
		var that = this,
			target = e.target, timer;

		if (target.className === 'minicart-quantity') {
			timer = setTimeout(function () {
				var product = that.model.cart.items(parseInt(target.getAttribute('data-minicart-idx'), 10));

				if (product) {
					product.set('quantity', target.value);
				}
			}, constants.KEYUP_TIMEOUT);
		}
	},


	pageshow: function (e) {
		if (e.persisted) {
			this.redraw();
			this.hide();
		}
	}

};
