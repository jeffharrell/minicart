'use strict';


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
				todayDate,
				expiresDate;

			if (data) {
				data = JSON.parse(decodeURIComponent(data));
			}

			if (data && data.expires) {
				todayDate = new Date();
				expiresDate = new Date(data.expires);

				if (todayDate > expiresDate) {
					this.remove();
					return;
				}
			}

			return data && data.value;
		};

		proto.save = function (items) {
			var date = new Date(),
				data = [],
				wrappedData,
				item,
				len,
				i;

			if (items) {
				for (i = 0, len = items.length; i < len; i++) {
					item = items[i];
					data.push({
						product: item.product,
						settings: item.settings
					});
				}

				date.setTime(date.getTime() + this._duration * 24 * 60 * 60 * 1000);
				wrappedData = {
					value: data,
					expires: date.toGMTString()
				};

				localStorage.setItem(this._name, encodeURIComponent(JSON.stringify(wrappedData)));
			}
		};

		proto.destroy = function () {
			localStorage.removeItem(this._name);
		};

	// Legacy
	} else {
		proto.load = function () {};
		proto.save = function (items) {};
		proto.destroy = function () {};
	}




//		} else {
//			return {
//
//				/**
//				 * Loads the saved data
//				 *
//				 * @return {object}
//				 */
//				load: function () {
//					var key = name + '=',
//						data, cookies, cookie, value, i;
//
//					try {
//						cookies = document.cookie.split(';');
//
//						for (i = 0; i < cookies.length; i++) {
//							cookie = cookies[i];
//
//							while (cookie.charAt(0) === ' ') {
//								cookie = cookie.substring(1, cookie.length);
//							}
//
//							if (cookie.indexOf(key) === 0) {
//								value = cookie.substring(key.length, cookie.length);
//								data = JSON.parse(decodeURIComponent(value));
//							}
//						}
//					} catch (e) {}
//
//					return data;
//				},
//
//
//				/**
//				 * Saves the data
//				 *
//				 * @param items {object} The list of items to save
//				 * @param duration {Number} The number of days to keep the data
//				 */
//				save: function (items, duration) {
//					var date = new Date(),
//						data = [],
//						item, len, i;
//
//					if (items) {
//						for (i = 0, len = items.length; i < len; i++) {
//							item = items[i];
//							data.push({
//								product: item.product,
//								settings: item.settings
//							});
//						}
//
//						date.setTime(date.getTime() + duration * 24 * 60 * 60 * 1000);
//						document.cookie = config.name + '=' + encodeURIComponent(JSON.stringify(data)) + '; expires=' + date.toGMTString() + '; path=' + config.cookiePath;
//					}
//				},
//
//
//				/**
//				 * Removes the saved data
//				 */
//				remove: function () {
//					this.save(null, -1);
//				}
//			};
//		}

})(typeof window === 'undefined' ? null : window, typeof document === 'undefined' ? null : document);

