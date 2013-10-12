/*global EJS:true */

'use strict';


module.exports = function template(str, data) {
    return new EJS({text: str}).render(data);
};