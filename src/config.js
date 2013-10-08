'use strict';


var config = module.exports = {

    template: '',

    parent: document && document.body

};


module.exports.load = function load(userConfig) {
    // TODO: This should recursively merge the config values
    for (var key in userConfig) {
        config[key] = userConfig[key];
    }
};