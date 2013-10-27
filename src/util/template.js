'use strict';


var ejs = require('ejs');


module.exports = function template(str, data) {
    return ejs.render(str, data);
};
