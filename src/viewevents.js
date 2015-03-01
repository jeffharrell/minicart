'use strict';


var constants = require('./constants'),
    events = require('./util/events'),
    viewevents;


module.exports = viewevents = {

    click: function (evt) {
        var target = evt.target,
            className = target.className;

        if (this.isShowing) {
            // Cart close button
            if (className === constants.CLOSER_CLASS) {
                this.hide();
            // Product remove button
            } else if (className === constants.REMOVE_CLASS) {
                this.model.cart.remove(target.getAttribute(constants.DATA_IDX));
            // Product quantity input
            } else if (className === constants.QUANTITY_CLASS) {
                target[target.setSelectionRange ? 'setSelectionRange' : 'select'](0, 999);
            // Outside the cart
            } else if (!(/input|button|select|option/i.test(target.tagName))) {
                while (target.nodeType === 1) {
                    if (target === this.el) {
                        return;
                    }

                    target = target.parentNode;
                }

                this.hide();
            }
        }
    },


    keyup: function (evt) {
        var that = this,
            target = evt.target,
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


    readystatechange: function () {
        if (/interactive|complete/.test(document.readyState)) {
            var forms, form, i, len;

            // Bind to page's forms
            forms = document.getElementsByTagName('form');

            for (i = 0, len = forms.length; i < len; i++) {
                form = forms[i];

                if (form.cmd && constants.COMMANDS[form.cmd.value]) {
                    this.bind(form);
                }
            }

            // Do the initial render when the buttons are ready
            this.redraw();

            // Only run this once
            events.remove(document, 'readystatechange', viewevents.readystatechange);
        }
    },


    pageshow: function (evt) {
        if (evt.persisted) {
            this.redraw();
            this.hide();
        }
    }

};
