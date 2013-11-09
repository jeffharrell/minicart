'use strict';


(function (window, document) {

	var Storage = module.exports = function Storage(name, duration) {
		this._name = name;
		this._duration = duration || 30;
	};


	var proto = Storage.prototype;


	// HTML5
	if (window && window.localStorage) {
		proto.load = function () {
			var data = localStorage.getItem(this._name),
				today,
				expires;

			if (data) {
				data = JSON.parse(decodeURIComponent(data));
			}

			if (data && data.expires) {
				today = new Date();
				expires = new Date(data.expires);

				if (today > expires) {
					this.remove();
					return;
				}
			}

			return data && data.value;
		};

		proto.save = function (data) {
			var expires = new Date(),
				wrapped;

			expires.setTime(expires.getTime() + this._duration * 24 * 60 * 60 * 1000);

			wrapped = {
				value: data,
				expires: expires.toGMTString()
			};

			localStorage.setItem(this._name, encodeURIComponent(JSON.stringify(wrapped)));
		};

		proto.destroy = function () {
			localStorage.removeItem(this._name);
		};

	// Non-HTML5 compatible
	} else {
		proto.load = function () {};
		proto.save = function () {};
		proto.destroy = function () {};

	}

})(typeof window === 'undefined' ? null : window, typeof document === 'undefined' ? null : document);

