'use strict';


var Cart = require('./cart'),
    config = require('./config'),
    util = require('./util'),
    minicart = {},
    cartModel, isShowing;



function redraw() {
    minicart.el.innerHTML = util.template(config.template, minicart);
}


function addItem(idx, data) {
    redraw();
    minicart.show();
    console.log('add item');
}


function changeItem(idx, data) {
    redraw();
    minicart.show();
    console.log('change item');
}


function removeItem(idx) {
    redraw();
    minicart.show();
    console.log('remove item');
}



minicart.render = function render(userConfig) {
    var wrapper, head, style;

    minicart.config = config.load(userConfig);

    cartModel = minicart.cart = new Cart();
    cartModel.on('add', addItem);
    cartModel.on('change', changeItem);
    cartModel.on('remove', removeItem);

    wrapper = minicart.el = document.createElement('div');
    wrapper.id = config.name;

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

    redraw();

    document.addEventListener('click', function (e) {
        if (isShowing) {
            var target = e.target;

            if (!(/input|button|select|option/i.test(target.tagName))) {
                while (target.nodeType === 1) {
                    if (target === config.parent) {
                        return;
                    }

                    target = target.parentNode;
                }

                minicart.hide();
            }
        }
    }, false);

    config.parent.appendChild(wrapper);
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

    redraw();
};




// Export for either the browser or node
(function (win) {
    if (!win.paypal) {
        win.paypal = {};
    }

    win.paypal.minicart = minicart;
})(window || module.exports);



