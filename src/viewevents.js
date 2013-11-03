'use strict';


var constants = require('./constants');



module.exports = {

	click: function (e) {
		var target = e.target;

		if (this.isShowing) {
			if (target.className === constants.REMOVE_CLASS) {
				this.model.cart.remove(target.getAttribute(constants.DATA_IDX));

				e.stopPropagation();
				e.preventDefault();
			} else if (target.className === constants.CLOSER_CLASS) {
				this.hide();

				e.stopPropagation();
				e.preventDefault();
			} else if (target.className === constants.QUANTITY_CLASS) {
				if (target.setSelectionRange) {
					target.setSelectionRange(0, 999);
				} else {
					target.select();
				}

				e.stopPropagation();
				e.preventDefault();
			} else if (!(/input|button|select|option/i.test(target.tagName))) {
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
			target = e.target,
			timer;

		if (target.className === constants.QUANTITY_CLASS) {
			timer = setTimeout(function () {
				var idx = parseInt(target.getAttribute(constants.DATA_IDX), 10),
					cart = that.model.cart,
					product = cart.items(idx),
					quantity = parseInt(target.value, 10);

				if (product) {
					if (quantity > 0) {
						product.set('quantity', quantity);
					} else if (quantity === 0) {
						cart.remove(idx);
					}
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
