'use strict';


var config = require('./config'),
	events = require('./util/events'),
	template = require('./util/template'),
	forms = require('./util/forms'),
	constants = require('./constants');



function addStyles() {
	var head, style;

	if (config.styles) {
		style = document.createElement('style');
		style.type = 'text/css';

		if (style.styleSheet) {
			style.styleSheet.cssText = config.styles;
		} else {
			style.appendChild(document.createTextNode(config.styles));
		}

		head = document.getElementsByTagName('head')[0];
		head.appendChild(style);
	}
}


function addEvents(view) {
	var forms, form, i, len, keyupTimer;


	events.add(document, 'click', function (e) {
		var target = e.target;

		if (target.className === 'minicart-remove') {
			view._model.cart.remove(target.getAttribute('data-minicart-idx'));
		} else if (view._isShowing) {
			if (!(/input|button|select|option/i.test(target.tagName))) {
				while (target.nodeType === 1) {
					if (target === view._el) {
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
				var product = view._model.cart.items(target.getAttribute('data-minicart-idx'));
				product.set('quantity', target.value);
			}, 250);
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

	config.parent.appendChild(wrapper);

	this._el = wrapper;
	this._model = model;
	this._isShowing = false;
	this.redraw();

	addStyles();
	addEvents(this);
}


View.prototype.redraw = function redraw() {
	this._el.innerHTML = template(config.template, this._model);
};


View.prototype.show = function show() {
	if (!this._isShowing) {
		document.body.classList.add(constants.SHOWING);
		this._isShowing = true;
	}
};


View.prototype.hide = function hide() {
	if (this._isShowing) {
		document.body.classList.remove(constants.SHOWING);
		this._isShowing = false;
	}
};


View.prototype.toggle = function toggle() {
	this[this._isShowing ? 'hide' : 'show']();
};


View.prototype.bind = function bind(form) {
	var that = this;

	if (form.add) {
		events.add(form, 'submit', function (e) {
			e.preventDefault(e);
			that._model.cart.add(forms.parse(form));
		});
	} else if (form.display) {
		events.add(form, 'submit', function (e) {
			e.preventDefault();
			that.show();
		});
	} else {
		return false;
	}

	return true;
};


View.prototype.addItem = function addItem(idx, data) {
	this.redraw();
	this.show();

	var els = this._el.getElementsByClassName('minicart-item');
	els[idx].classList.add('minicart-item-new');
};


View.prototype.changeItem = function changeItem(idx, data) {
	this.redraw();
	this.show();

	var els = this._el.getElementsByClassName('minicart-item');
	els[idx].classList.add('minicart-item-new');
};


View.prototype.removeItem = function removeItem(idx) {
	this.redraw();

	if (this._model.cart.items().length === 0) {
		this.hide();
	} else {
		this.show();
	}
};




module.exports = View;
