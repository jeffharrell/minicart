'use strict';


var forms = module.exports = {

    parse: function parse(form) {
        var raw = form.elements,
            data = {},
            pair, value, i, len;

        for (i = 0, len = raw.length; i < len; i++) {
            pair = raw[i];

            if ((value = forms.getInputValue(pair))) {
                data[pair.name] = value;
            }
        }

        return data;
    },


    getInputValue: function getInputValue(input) {
        var tag = input.tagName.toLowerCase();

        if (tag === 'select') {
            return input.options[input.selectedIndex].value;
        } else if (tag === 'textarea') {
            return input.innerText;
        } else {
            if (input.type === 'radio') {
                return (input.checked) ? input.value : null;
            } else if (input.type === 'checkbox') {
                return (input.checked) ? input.value : null;
            } else {
                return input.value;
            }
        }
    }

};