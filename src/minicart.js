'use strict';

// TODO:
// - storage
// - UI tests


var Cart = require('./cart'),
    config = require('./config'),
    template = require('./util/template'),
    events = require('./util/events'),
    forms = require('./util/forms'),
    constants = require('./constants'),
    minicart = {},
    cartModel,
    isShowing;


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


function addEvents() {
    var forms, form, i, len, keyupTimer;


    events.add(document, 'click', function (e) {
        var target = e.target;

        if (target.className === 'minicart-remove') {
            minicart.cart.remove(target.getAttribute('data-minicart-idx'));
        } else if (isShowing && !(/input|button|select|option/i.test(target.tagName))) {
			while (target.nodeType === 1) {
				if (target === minicart.el) {
					return;
				}

				target = target.parentNode;
			}

			minicart.hide();
        }
    });


    events.add(document, 'keyup', function (e) {
        var target = e.target;

        if (target.className === 'minicart-quantity') {
			keyupTimer = setTimeout(function () {
				var product = minicart.cart.get(target.getAttribute('data-minicart-idx'));
				product.set('quantity', target.value);
			}, 250);
        }
    });


    events.add(window, 'pageshow', function (e) {
        if (e.persisted) {
            redrawCart();
            minicart.hide();
        }
    });


    forms = document.getElementsByTagName('form');

    for (i = 0, len = forms.length; i < len; i++) {
        form = forms[i];

        if (form.cmd && constants.CMDS[form.cmd.value]) {
            minicart.bind(form);
        }
    }
}


function redrawCart() {
    minicart.el.innerHTML = template(config.template, minicart);
}


function addItem(idx, data) {
    redrawCart();
    minicart.show();
}


function changeItem(idx, data) {
    redrawCart();
    minicart.show();
}


function removeItem(idx) {
    redrawCart();

    if (minicart.cart.getAll().length === 0) {
        minicart.hide();
    } else {
        minicart.show();
    }
}



minicart.render = function render(userConfig) {
    var wrapper;

    minicart.config = config.load(userConfig);

    cartModel = minicart.cart = new Cart();
    cartModel.on('add', addItem);
    cartModel.on('change', changeItem);
    cartModel.on('remove', removeItem);

    wrapper = minicart.el = document.createElement('div');
    wrapper.id = config.name;

    addStyles();
    addEvents();
    redrawCart();

    config.parent.appendChild(wrapper);
};


minicart.bind = function bind(form) {
    if (form.add) {
        events.add(form, 'submit', function (e) {
            e.preventDefault(e);
            minicart.cart.add(forms.parse(form));
        });
    } else if (form.display) {
        events.add(form, 'submit', function (e) {
            e.preventDefault();
            minicart.show();
        });
    } else {
        return false;
    }

    return true;
};


minicart.show = function show() {
    if (!isShowing) {
        document.body.classList.add('minicart-showing');
        isShowing = true;
    }
};


minicart.hide = function hide() {
    if (isShowing) {
        document.body.classList.remove('minicart-showing');
        isShowing = false;
    }
};


minicart.toggle = function toggle() {
    minicart[isShowing ? 'hide' : 'show']();
};


minicart.reset = function reset() {
    minicart.hide();
    cartModel.destroy();

    redrawCart();
};




// Export for either the browser or node
(function (win) {
    if (!win.paypal) {
        win.paypal = {};
    }

    win.paypal.minicart = minicart;
})(window || module.exports);
