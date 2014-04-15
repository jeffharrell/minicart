'use strict';


function Pubsub() {
    this._eventCache = {};
}


Pubsub.prototype.on = function on(name, fn, scope) {
    var cache = this._eventCache[name];

    if (!cache) {
        cache = this._eventCache[name] = [];
    }

    cache.push([fn, scope]);
};


Pubsub.prototype.off = function off(name, fn) {
    var cache = this._eventCache[name],
        i, len;

    if (cache) {
        for (i = 0, len = cache.length; i < len; i++) {
            if (cache[i] === fn) {
                cache = cache.splice(i, 1);
            }
        }
    }
};


Pubsub.prototype.fire = function on(name) {
    var cache = this._eventCache[name], i, len, fn, scope;

    if (cache) {
        for (i = 0, len = cache.length; i < len; i++) {
            fn = cache[i][0];
            scope = cache[i][1] || this;

            if (typeof fn === 'function') {
                fn.apply(scope, Array.prototype.slice.call(arguments, 1));
            }
        }
    }
};


module.exports = Pubsub;
