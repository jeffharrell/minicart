'use strict';


require('JSON');


(function (window, document) {

	var proto;


	var Storage = module.exports = function Storage(name, duration) {
		this._name = name;
		this._duration = duration || 30;
	};


	proto = Storage.prototype;


	// Node
	if (!window) {

		proto.load = function () {};
		proto.save = function (items) {};
		proto.destroy = function () {};

	// HTML5
	} else if (window.localStorage) {

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
				wrapped = {};

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

	// Legacy
	} else {
		proto.load = function () {
			var key = this._name + '=',
				data, cookies, cookie, value, i;

			try {
				cookies = document.cookie.split(';');

				for (i = 0; i < cookies.length; i++) {
					cookie = cookies[i];

					while (cookie.charAt(0) === ' ') {
						cookie = cookie.substring(1, cookie.length);
					}

					if (cookie.indexOf(key) === 0) {
						value = cookie.substring(key.length, cookie.length);
						data = JSON.parse(decodeURIComponent(value));
					}
				}
			} catch (e) {}

			return data;
		};

		proto.save = function (data, expiry) {
			var expires = new Date();

			expires.setTime(expires.getTime() + (expiry || this._duration) * 24 * 60 * 60 * 1000);
			document.cookie = this._.name + '=' + encodeURIComponent(JSON.stringify(data)) + '; expires=' + expires.toGMTString() + '; path=/';
		};

		proto.destroy = function () {
			this.save(null, -1);
		};
	}

})(typeof window === 'undefined' ? null : window, typeof document === 'undefined' ? null : document);

