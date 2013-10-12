'use strict';


module.exports = {

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