'use strict';


var config = require('./config'),
	events = require('./util/events'),
	template = require('./util/template'),
	forms = require('./util/forms'),
	styles = require('./util/styles'),
	constants = require('./constants');




function addEvents(view) {
	var forms, form, i, len, keyupTimer;


	events.add(document, 'click', function (e) {
		var target = e.target;

		if (target.className === 'minicart-remove') {
			view.model.cart.remove(target.getAttribute('data-minicart-idx'));
		} else if (target.className === 'minicart-closer') {
			view.hide();
		} else if (view.isShowing) {
			if (!(/input|button|select|option/i.test(target.tagName))) {
				while (target.nodeType === 1) {
					if (target === view.el) {
						return;
					}

					target = target.parentNode;
				}

				view.hide();
			}
		}
	});


	events.add(document, 'keyup', function (e) {
		var target = e.target;

		if (target.className === 'minicart-quantity') {
			keyupTimer = setTimeout(function () {
				var product = view.model.cart.items(parseInt(target.getAttribute('data-minicart-idx'), 10));

				if (product) {
					product.set('quantity', target.value);
				}
			}, constants.KEYUP_TIMEOUT);
		}
	});


	events.add(window, 'pageshow', function (e) {
		if (e.persisted) {
			view.redraw();
			view.hide();
		}
	});


	forms = document.getElementsByTagName('form');

	for (i = 0, len = forms.length; i < len; i++) {
		form = forms[i];

		if (form.cmd && constants.COMMANDS[form.cmd.value]) {
			view.bind(form);
		}
	}
}



function View(model) {
	var wrapper = document.createElement('div');
	wrapper.id = config.name;

	styles.inject(document.getElementsByTagName('head')[0], config.styles);
	config.parent.appendChild(wrapper);

	this.el = wrapper;
	this.model = model;
	this.isShowing = false;
	this.redraw();

	addEvents(this);
}


View.prototype.redraw = function redraw() {
	this.el.innerHTML = template(config.template, this.model);
};


View.prototype.show = function show() {
	if (!this.isShowing) {
		styles.add(document.body, constants.SHOWING_CLASS);
		this.isShowing = true;
	}
};


View.prototype.hide = function hide() {
	if (this.isShowing) {
		styles.remove(document.body, constants.SHOWING_CLASS);
		this.isShowing = false;
	}
};


View.prototype.toggle = function toggle() {
	this[this.isShowing ? 'hide' : 'show']();
};


View.prototype.bind = function bind(form) {
	var that = this;

	if (!constants.COMMANDS[form.cmd.value]) {
		return false;
	}

	if (form.display) {
		events.add(form, 'submit', function (e) {
			e.preventDefault();
			that.show();
		});
	} else {
		events.add(form, 'submit', function (e) {
			e.preventDefault(e);
			that.model.cart.add(forms.parse(form));
		});
	}

	return true;
};


View.prototype.addItem = function addItem(idx, data) {
	this.redraw();
	this.show();

	var els = this.el.getElementsByClassName('minicart-item');
	styles.add(els[idx], 'minicart-item-changed');
};


View.prototype.changeItem = function changeItem(idx, data) {
	this.redraw();
	this.show();

	var els = this.el.getElementsByClassName('minicart-item');
	styles.add(els[idx], 'minicart-item-changed');
};


View.prototype.removeItem = function removeItem(idx) {
	this.redraw();
};




module.exports = View;
