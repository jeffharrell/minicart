'use strict';


var config = require('./config'),
	events = require('./util/events'),
	template = require('./util/template'),
	forms = require('./util/forms'),
	css = require('./util/css'),
	viewevents = require('./viewevents'),
	constants = require('./constants');



function View(model) {
	var wrapper, forms, form, i, len;

	this.el = wrapper = document.createElement('div');
	this.model = model;
	this.isShowing = false;
	this.redraw();

	// HTML
	wrapper.id = config.name;
	config.parent.appendChild(wrapper);

	// CSS
	css.inject(document.getElementsByTagName('head')[0], config.styles);

	// JavaScript
	events.add(document, ('ontouchstart' in window) ? 'touchstart' : 'click', viewevents.click, this);
	events.add(document, 'keyup', viewevents.keyup, this);
	events.add(window, 'pageshow', viewevents.pageshow, this);

	// Bind to page's forms
	forms = document.getElementsByTagName('form');

	for (i = 0, len = forms.length; i < len; i++) {
		form = forms[i];

		if (form.cmd && constants.COMMANDS[form.cmd.value]) {
			this.bind(form);
		}
	}
}


View.prototype.redraw = function redraw() {
	this.el.innerHTML = template(config.template, this.model);
};


View.prototype.show = function show() {
	if (!this.isShowing) {
		css.add(document.body, constants.SHOWING_CLASS);
		this.isShowing = true;
	}
};


View.prototype.hide = function hide() {
	if (this.isShowing) {
		css.remove(document.body, constants.SHOWING_CLASS);
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

	var els = this.el.getElementsByClassName(constants.ITEM_CLASS);
	css.add(els[idx], constants.ITEM_CHANGED_CLASS);
};


View.prototype.changeItem = function changeItem(idx, data) {
	this.redraw();
	this.show();

	var els = this.el.getElementsByClassName(constants.ITEM_CLASS);
	css.add(els[idx], constants.ITEM_CHANGED_CLASS);
};


View.prototype.removeItem = function removeItem(idx) {
	this.redraw();
};




module.exports = View;
