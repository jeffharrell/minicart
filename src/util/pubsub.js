'use strict';


function Pubsub() {
	this._eventCache = {};
}


Pubsub.prototype.on = function on(name, fn) {
	var cache = this._eventCache[name];

	if (!cache) {
		cache = this._eventCache[name] = [];
	}

	cache.push(fn);
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
	var cache = this._eventCache[name], i, len, fn;

	if (cache) {
		for (i = 0, len = cache.length; i < len; i++) {
			fn = cache[i];

			if (typeof fn === 'function') {
				fn.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		}
	}
};


module.exports = Pubsub;
