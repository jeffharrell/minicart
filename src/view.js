'use strict';


var config = require('./config'),
	events = require('./util/events'),
	template = require('./util/template'),
	forms = require('./util/forms'),
	styles = require('./util/styles'),
	viewevents = require('./viewevents'),
	constants = require('./constants');




function addEvents(view) {
	var forms, form, i, len;

	events.add(document, 'click', viewevents.click, view);
	events.add(document, 'keyup', viewevents.keyup, view);
	events.add(window, 'pageshow', viewevents.pageshow, view);

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
