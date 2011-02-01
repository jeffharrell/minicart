/** 
 * The PayPal Mini Cart 
 * Visit https://minicart.paypal-labs.com/ for details
 * Use subject to license agreement as set forth at the link below
 * 
 * @author Jeff Harrell
 * @version 
 * @license https://minicart.paypal-labs.com/LICENSE eBay Open Source License Agreement
 */
if (typeof PAYPAL == 'undefined' || !PAYPAL) {
	var PAYPAL = {};
}

PAYPAL.apps = PAYPAL.apps || {};


(function () {

	/**
	 * Default configuration
	 */
	var config = {			
		/**
		 * The parent element the cart should "pin" to
		 */
		parent: document.body,
		
		/**
		 * Edge of the window to pin the cart to
		 */
		displayEdge: 'right',
		
		/**
		 * Distance from the edge of the window
		 */
		edgeDistance: '50px',
		
		/**
		 * The base path of your website to set the cookie to
		 */		
		cookiePath: '/',
		
		/**
		 * Strings used for display text
		 */		
		strings: {
			button: '',
			subtotal: '',
			discount: '',
			shipping: ''
		},
		
		/**
		 * Unique ID used on the wrapper element 
		 */		
		name: 'PPMiniCart',
		
		/**
		 * Boolean to determine if the cart should "peek" when it's hidden with items
		 */
		peekEnabled: true,

		/**
		 * The URL of the paypal website
		 */
		paypalURL: 'https://www.paypal.com/cgi-bin/webscr',		
		
		/**
		 * The base URL to the visual assets
		 */		
		assetURL: 'https://minicart.paypal-labs.com/build/',
		
		events: {
			/**
			 * Custom event fired before the cart is rendered
			 */
			onRender: null, 
					
			/**
			 * Custom event fired after the cart is rendered
			 */
			afterRender: null,
			
			/**
			 * Custom event fired before the cart is hidden
			 *
			 * @param e {event} The triggering event
			 */
			onHide: null,
			
			/**
			 * Custom event fired after the cart is hidden
			 *
			 * @param e {event} The triggering event			 
			 */
			afterHide: null,
			
			/**
			 * Custom event fired before the cart is shown
			 *
			 * @param e {event} The triggering event
			 */
			onShow: null,
			
			/**
			 * Custom event fired after the cart is shown
			 *
			 * @param e {event} The triggering event			 
			 */
			afterShow: null,
			
			/**
			 * Custom event fired before a product is added to the cart
			 *
			 * @param data {object} Product object. See _dataFilter for format
			 */
			onAddToCart: null,
			
			/**
			 * Custom event fired after a product is added to the cart
			 *
			 * @param data {object} Product object. See _dataFilter for format
			 */
			afterAddToCart: null,
			
			/**
			 * Custom event fired before a product is removed from the cart
			 *
			 * @param data {object} Product object. See _dataFilter for format
			 */
			onRemoveFromCart: null,
			
			/**
			 * Custom event fired after a product is removed from the cart
			 *
			 * @param data {object} Product object. See _dataFilter for format
			 */
			afterRemoveFromCart: null,
			
			/**
			 * Custom event fired before the checkout action takes place
			 *
			 * @param e {event} The triggering event
			 */
			onCheckout: null,
			
			/**
			 * Custom event fired before the cart is reset
			 */
			onReset: null,
			
			/**
			 * Custom event fired after the cart is reset
			 */
			afterReset: null
		}
	};



	/**
	 * Mini Cart application 
	 */
	PAYPAL.apps.MiniCart = (function () {
		
		var self = arguments.callee;
		
		/**
		 * Array of ProductBuilders
		 */
		self.products = [];
		
		/**
		 * Container for UI elements
		 */
		self.UI = {};
		
		/**
		 * Flag to determine if the cart is currently showing
		 */
		self.isShowing = false;
		
		
		
		/** PRIVATE METHODS **/
		
		/**
		 * Initializs the config, renders the cart and loads the data 
		 *
		 * @param userConfig {object} User settings which override the default configuration
		 */
		var _init = function (userConfig) {
			var hash,
				cmd,
				key,
				i;
				
			// Overwrite default configuration with user settings
			for (key in userConfig) {
				if (config[key]) {
					config[key] = userConfig[key];
				}
			}

			// Render the cart UI
			_render();
		
			// Process any stored data 
			_parseStorage();
						
			// Check if a transaction was completed
			hash = location.hash.substring(1);
			
			if (hash.indexOf(config.name + '=') === 0) {
				cmd = hash.split('=')[1];
				
				if (cmd == 'reset') {
					self.reset();
					location.hash = '';
				}
			}
					
			// Update the UI
			if (self.isShowing) {
				setTimeout(function () {
					self.hide(null);
				}, 500);
			} else {
				$.storage.remove();
			}

			self.updateSubtotal();
		};
		
		
		/**
		 * Renders the cart to the page and sets up it's events 
		 */
		var _render = function () {
			if (typeof config.events.onRender == 'function') {
				config.events.onRender.call(self);
			}
			
			_addCSS();
			_buildDOM();
			_bindEvents();
			
			if (typeof config.events.afterRender == 'function') {
				config.events.afterRender.call(self);
			}
		};
		
		
		/**
		 * Adds the cart's CSS to the page
		 */
		var _addCSS = function () {
			var head, style, css, name = config.name;
						
			css	 = '#' + name + ' form { position:fixed; float:none; top:-250px; ' + config.displayEdge + ':' + config.edgeDistance + '; width:265px; margin:0; padding:50px 10px 0; min-height:170px; background:#fff url(' + config.assetURL + 'images/minicart_sprite.png) no-repeat -125px -60px; border:1px solid #999; border-top:0; font:13px/normal arial, helvetica; color:#333; -moz-border-radius:0 0 8px 8px; -webkit-border-radius:0 0 8px 8px; border-radius:0 0 8px 8px; -moz-box-shadow:1px 1px 1px rgba(0, 0, 0, 0.1); -webkit-box-shadow:1px 1px 1px rgba(0, 0, 0, 0.1); box-shadow:1px 1px 1px rgba(0, 0, 0, 0.1); } ';
			css += '#' + name + ' ul { position:relative; overflow-x:hidden; overflow-y:auto; height:130px; margin:0 0 7px; padding:0; list-style-type:none; border-top:1px solid #ccc; border-bottom:1px solid #ccc; } ';
			css += '#' + name + ' li { position:relative; margin:-1px 0 0; padding:6px 5px 6px 0; border-top:1px solid #f2f2f2; } ';
			css += '#' + name + ' li a { color:#333; text-decoration:none; } ';
			css += '#' + name + ' li a span { color:#999; font-size:10px; } ';
			css += '#' + name + ' li .quantity { position:absolute; top:.5em; right:78px; width:22px; padding:1px; border:1px solid #83a8cc; text-align:right; } ';
			css += '#' + name + ' li .price { position:absolute; top:.5em; right:4px; } ';
			css += '#' + name + ' li .remove { position:absolute; top:9px; right:60px; width:14px; height:14px; background:url(' + config.assetURL + 'images/minicart_sprite.png) no-repeat -134px -4px; border:0; cursor:pointer; } ';
			css += '#' + name + ' p { margin:0; padding:0 0 0 20px; background:url(' + config.assetURL + 'images/minicart_sprite.png) no-repeat; font-size:13px; font-weight:bold; } ';
			css += '#' + name + ' p:hover { cursor:pointer; } ';
			css += '#' + name + ' p input { float:right; margin:4px 0 0; padding:1px 4px; text-decoration:none; font-weight:normal; color:#333; background:#ffa822 url(' + config.assetURL + 'images/minicart_sprite.png) repeat-x left center; border:1px solid #d5bd98; border-right-color:#935e0d; border-bottom-color:#935e0d; -moz-border-radius:2px; -webkit-border-radius:2px; border-radius:2px; } ';
			css += '#' + name + ' p .shipping { display:block; font-size:10px; font-weight:normal; color:#999; } ';

			style = document.createElement('style');
			style.type = 'text/css';
			
			if (style.styleSheet) {
				style.styleSheet.cssText = css;
			} else {
				style.appendChild(document.createTextNode(css));
			}

			head = document.getElementsByTagName('head')[0];
			head.appendChild(style);
		};
		
		
		/**
		 * Builds the DOM elements required by the cart 
		 */
		var _buildDOM = function () {
			var cmd, type, bn;
			
			self.UI.wrapper = document.createElement('div');
			self.UI.wrapper.id	= config.name;
			
			cmd = document.createElement('input');
			cmd.type = 'hidden';
			cmd.name = 'cmd';
			cmd.value = '_cart';
			
			type = cmd.cloneNode(false);
			type.name = 'upload';
			type.value = '1';
			
			bn = cmd.cloneNode(false);
			bn.name = 'bn';
			bn.value = 'MiniCart_AddToCart_WPS_US';
			
			self.UI.cart = document.createElement('form');
			self.UI.cart.method = 'post';
			self.UI.cart.action = config.paypalURL;
			self.UI.cart.appendChild(cmd);
			self.UI.cart.appendChild(type);
			self.UI.cart.appendChild(bn);
			self.UI.wrapper.appendChild(self.UI.cart);
			
			self.UI.itemList = document.createElement('ul');
			self.UI.cart.appendChild(self.UI.itemList);
			
			self.UI.summary = document.createElement('p');
			self.UI.cart.appendChild(self.UI.summary);
			
			self.UI.button = document.createElement('input');
			self.UI.button.type = 'submit';
			self.UI.button.value = config.strings.button || 'Checkout';
			self.UI.summary.appendChild(self.UI.button);
			
			self.UI.subtotal = document.createElement('span');
			self.UI.subtotal.innerHTML = config.strings.subtotal || 'Subtotal: ';
	
			self.UI.subtotalAmount = document.createElement('span');
			self.UI.subtotalAmount.innerHTML = '0.00';
			
			self.UI.subtotal.appendChild(self.UI.subtotalAmount);
			self.UI.summary.appendChild(self.UI.subtotal);
			
			self.UI.shipping = document.createElement('span');
			self.UI.shipping.className = 'shipping';
			self.UI.shipping.innerHTML = config.strings.shipping || 'does not include shipping & tax';
			self.UI.summary.appendChild(self.UI.shipping);
			
			// Workaround: IE 6 and IE 7/8 in quirks mode do not support position:fixed in CSS
			if (window.attachEvent && !window.opera) {
				var version = navigator.userAgent.match(/MSIE\s([^;]*)/);
				
				if (version) {
					version = parseFloat(version[1]);
				
					if (version < 7 || (version >= 7 && document.compatMode === 'BackCompat')) {
						self.UI.cart.style.position = 'absolute';
						self.UI.wrapper.style[config.displayEdge] = '0';
						self.UI.wrapper.style.setExpression('top', 'x = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop');
					}
				}
			}
			
			var parent = (typeof config.parent === 'string') ? document.getElementById(config.parent) : config.parent;		
			parent.appendChild(self.UI.wrapper);
		};
		
		
		/**
		 * Attaches the cart events to it's DOM elements 
		 */
		var _bindEvents =function () {
			var forms,
				form,
				i;
			
			// Look for all "Cart" and "Buy Now" forms on the page and attach events
			forms = document.getElementsByTagName('form');

			for (i = 0; i < forms.length; i++) {
				form = forms[i];
				
				if (form.cmd && (form.cmd.value === '_cart' || form.cmd.value === '_xclick')) {
					if (form.add) {
						$.event.add(form, 'submit', function (e) {
							e.preventDefault(e);
							self.addToCart(e.target.elements);
						});
					} else if (form.display) {
						$.event.add(form, 'submit', function (e) {
							e.preventDefault();
							self.show(e);
						});
					}
				}
			}
			
			// Hide the Mini Cart for all non-cart related clicks 
			$.event.add(document, 'click', function (e) {
				if (self.isShowing) {
					var target = e.target;

					if (!(/input|button|select|option/i.test(target.tagName))) {
						while (target.nodeType === 1) {
							if (target === self.UI.cart) {
								return;
							}

							target = target.parentNode;
						}
						
						self.hide(null);
					}
				}
			});
			
			// Run the checkout code when submitting the form
			$.event.add(self.UI.cart, 'submit', function (e) {
				_checkout(e);
			});
			
			// Show the cart when clicking on the summary 
			$.event.add(self.UI.summary, 'click', function (e) {
				var target = e.target;
				
				if (target !== self.UI.button) {
					self.toggle(e);
				}
			}); 

			// Update other windows when HTML5 localStorage is updated
			function redrawCartItems() {
				console.log('redraw');
				self.products = [];
				self.UI.itemList.innerHTML = '';
				self.UI.subtotalAmount.innerHTML = '';
		
				_parseStorage();
				self.updateSubtotal();
			}
			
			if (window.attachEvent && !window.opera) {
				$.event.add(document, 'storage', function (e) {
					// IE needs a delay in order to properly see the change
					setTimeout(redrawCartItems, 100);
				});			
			} else {
				$.event.add(window, 'storage', function (e) {
					// Safari, Chrome, and Opera can filter on updated storage key	
					// Firefox can't so it uses a brute force approach
					if ((e.key && e.key == config.name) || !e.key) {
						redrawCartItems();
					}
				});
			}
		};


		/**
		 * Loads the stored data and builds the cart
		 */
		var _parseStorage = function () {
			var data, length;
			
			if ((data = $.storage.load())) {
				length = data.length;
			
				for (i = 0; i < length; i++) {
					if (_renderProduct(data[i])) {
						self.isShowing = true;
					}
				}
			}
		};

		
		/**
		 * Default data filter used for WPS xclick style forms
		 * 
		 * @param raw {object} An object of raw data to add to the cart 
		 * @return {object} 
		 */
		var _dataFilter = function (raw) {
			var data = {}, 
				settings = {},
				productFilter = /^(?:item_number|item_name|amount|quantity|on|os|option_|tax|weight|handling|shipping|discount)/,
				settingFilter = /^(?:business|currency_code|lc|paymentaction|no_shipping|cn|no_note|invoice|handling_cart|weight_cart|weight_unit|tax_cart|page_style|image_url|cpp_|cs|cbt|return|cancel_return|notify_url|rm|custom|charset)/,
				length = raw.length,
				pair,
				value,
				existing,
				option_index, 
				i;
			
			for (i = 0; i < length; i++) {
				pair = raw[i];
				
				if (productFilter.test(pair.name)) {
					value = $.util.getInputValue(pair);
					
					if (value) {
						data[pair.name] = value;
					}
				} else if (settingFilter.test(pair.name)) {
					value = $.util.getInputValue(pair);
					
					if (value) {
						settings[pair.name] = value;
					}
				}
			}			 
			
			// Check the products to see if this variation already exists; if it does update it's offset
			for (i = 0, length = self.products.length; i < length; i++) {
				existing = self.products[i].details;
				
				if ((!data.item_name || data.item_name === existing.item_name) &&
					(!data.item_number || data.item_number === existing.item_number) && 
					(!data.os0 || data.os0 === existing.os0) &&
					(!data.os1 || data.os1 === existing.os1)) {
						data.offset = existing.offset;
						break;
				}
			}
				  
			// Normalize the values	 
			data.href = data.href || window.location.href;
			data.quantity = data.quantity || 1;
			data.amount = data.amount || 0;
			
			// Add Mini Cart specific settings
			if (settings['return'] && settings['return'].indexOf('#') == -1) {
				settings['return'] += '#' + config.name + '=reset';
			}
			
			// Add option amounts to the total amount
			option_index = (data.option_index) ? data.option_index : 0;

			while (raw['os' + option_index]) {
				i = 0;
				
				while (typeof data['option_select' + i] != 'undefined') {
					if (data['option_select' + i] == data['os' + option_index]) {
						
						data.amount = data.amount + parseFloat(data['option_amount' + i]);
						break;
					}
					
					i++;
				}
				
				option_index++;
			}
			
			return {
				details: data,
				settings: settings
			};
		};
		
		
		/**
		 * Renders the product in the cart
		 *
		 * @param data {object} The data for the product
		 */
		var _renderProduct = function (data) {
			var keyupTimer,
				product = new ProductBuilder(data, self.UI.itemList.children.length + 1),
				offset = data.details.offset;
				
			self.products[offset] = product;
			
			// Add hidden settings data to parent form
			for (key in data.settings) {
				if (self.UI.cart.elements[key]) {
					if (self.UI.cart.elements[key].value) {
						self.UI.cart.elements[key].value = data.settings[key];
					} else {
						self.UI.cart.elements[key] = data.settings[key];
					}
				} else {
					hiddenInput = document.createElement('input');
					hiddenInput.type = 'hidden';
					hiddenInput.name = key;
					hiddenInput.value = data.settings[key];
			
					self.UI.cart.appendChild(hiddenInput);
				}
			}
			
			// if the product has no name or number then don't add it
			if (product.isPlaceholder) {
				return false;
			// otherwise, setup the new element
			} else {
				// Click event for "x" 
				$.event.add(product.removeNode, 'click', function () {
					_removeProduct(product, offset);
				});
			
				// Event for changing quantities
				$.event.add(product.quantityNode, 'keyup', function () {
					var value = parseInt(this.value, 10);
					
					if (!isNaN(value)) {
						keyupTimer = setTimeout(function () {
							product.setQuantity(value);

							// Delete the product
							if (!product.getQuantity()) {
								_removeProduct(product, offset);
							}

							self.updateSubtotal();
							$.storage.save(self.products);
						}, 250);
					}
				});
			
				// Add the item and fade it in
				self.UI.itemList.appendChild(product.liNode);
				$.util.animate(product.liNode, 'opacity', { from: 0, to: 1 });
				
				return true;	
			}
		};
		
		
		var _removeProduct = function (product, offset) {
			if (typeof config.events.onRemoveFromCart == 'function') {
				config.events.onRemoveFromCart.call(self, product);
			}
			
			product.setQuantity(0);
			product.quantityNode.style.display = 'none';
		
			$.util.animate(product.liNode, 'opacity', { from: 1, to: 0 }, function () {
				$.util.animate(product.liNode, 'height', { from: 18, to: 0 }, function () {
					try {
						product.liNode.parentNode.removeChild(product.liNode);
					} catch (e) {
						// fail
					}
					
					// regenerate the form element indexes
					var products = self.UI.cart.getElementsByTagName('li'),
						products_len = products.length,
						inputs,
						inputs_len,
						input,
						matches,
						i, j, k = 1;
					
					for (i = 0 ; i < products_len; i++) {
						inputs = products[i].getElementsByTagName('input');
						inputs_len = inputs.length;
						
						for (j = 0; j < inputs_len; j++) {
							input = inputs[j];
							matches = /(.+)_[0-9]+$/.exec(input.name);
							
							if (matches && matches[1]) {
								input.name = matches[1] + '_' + k;
							}
						}
						
						k++;
					}
					
					if (typeof config.events.afterRemoveFromCart == 'function') {
						config.events.afterRemoveFromCart.call(self, product);
					}
				});
			});
		
			self.products[offset].details.item_name = '';
			self.products[offset].details.item_number = '';
		
			self.updateSubtotal();
			$.storage.save(self.products);
		};
		
		
		/**
		 * Event when the cart form is submitted 
		 *
		 * @param e {event} The form submission event
		 */
		var _checkout = function (e) {
			if (typeof config.events.onCheckout == 'function') {
				config.events.onCheckout.call(self, e);
			}
		};
		
		
		/** "PROTECTED" METHODS -- Can be used in callbacks **/
		
		/**
		 * Iterates over each product and calculates the subtotal
		 *
		 * @return {number} The subtotal
		 */
		self.calculateSubtotal = function () {
			var i,
				length,
				product,
				price,
				discount,
				amount = 0;
				
			for (i = 0, length = self.products.length; i < length; i++) {
				if ((product = self.products[i].details)) {
					if (product.amount) {
						price = product.amount;
						discount = (product.discount_amount) ? product.discount_amount : 0;
						
						amount += parseFloat((price - discount) * product.quantity);
					}
				}
			}
			
			return amount.toFixed(2);
		};
		
		
		/**
		 * Updates the UI with the current subtotal and currency code
		 */
		self.updateSubtotal = function () {
			var currency_code,
				currency_symbol,
				subtotal = self.calculateSubtotal(),
				level = 1,
				hex,
				len,
				i;

			// Get the currency
			currency_code = '';
			currency_symbol = '';

			if (self.UI.cart.elements.currency_code) {
				currency_code = self.UI.cart.elements.currency_code.value || self.UI.cart.elements.currency_code;
				currency_symbol = currencies[currency_code];
			} else {			
				for (i = 0, len = self.UI.cart.elements.length; i < len; i++) {
					if (self.UI.cart.elements[i].name == 'currency_code') {
						currency_code = self.UI.cart.elements[i].value || self.UI.cart.elements[i];
						currency_symbol = currencies[currency_code];
						break;
					}
				}
			}
		   
			// Update the UI
			self.UI.subtotalAmount.innerHTML = currency_symbol + subtotal + ' ' + currency_code; 
		
			// Yellow fade on update
			(function () {
				hex = level.toString(16);
				level++;
				
				self.UI.subtotalAmount.style.backgroundColor = '#ff' + hex;

				if (level >= 15) {
					self.UI.subtotalAmount.style.backgroundColor = 'transparent';
					
					// hide the cart if there's no total
					if (subtotal == '0.00') {
						self.hide(null, true);
					}
					
					return;
				}

				setTimeout(arguments.callee, 30);
			}());
		};
		
		
		/**
		 * Adds a product to the cart 
		 *
		 * @param data {object} Product object. See _dataFilter for format
		 * @return {boolean} True if the product was added, false otherwise
		 */
		self.addToCart = function (data) {
			var success = false,
				offset;
			
			if (typeof config.events.onAddToCart === 'function') {
				if (config.events.onAddToCart.call(self, data) === false) {
					return;
				}
			}
			
			data = _dataFilter(data);
			offset = data.details.offset;
			
			// Check if the product has already been added; update if so
			if (typeof offset != 'undefined' && self.products[offset]) {
				self.products[offset].details.quantity += parseInt(data.details.quantity || 1, 10);
				
				self.products[offset].setPrice(data.details.amount * self.products[offset].details.quantity);
				self.products[offset].setQuantity(self.products[offset].details.quantity);
				
				success = true;
			// Add a new DOM element for the product
			} else {	
				data.details.offset = self.products.length; 
				success = _renderProduct(data); 
			}	
				
			self.updateSubtotal();
			self.show(null);
			
			$.storage.save(self.products);
		
			if (typeof config.events.afterAddToCart === 'function') {
				config.events.afterAddToCart.call(self, data);
			}
			
			return success;
		};
		
		
		/**
		 * Shows the cart
		 *
		 * @param e {event} The triggering event
		 */
		self.show = function (e) {
			var from = parseInt(self.UI.cart.offsetTop, 10),
				to = 0;
				
			if (e && e.preventDefault) { e.preventDefault(); }
			
			if (typeof config.events.onShow == 'function') {
				config.events.onShow.call(self, e);
			}
					
			$.util.animate(self.UI.cart, 'top', { from: from, to: to }, function () {
				if (typeof config.events.afterShow == 'function') {
					config.events.afterShow.call(self, e);
				}
			});
			
			self.UI.summary.style.backgroundPosition = '-195px 2px';
			self.isShowing = true;
		};
		
		
		/**
		 * Hides the cart off the screen
		 *
		 * @param e {event} The triggering event
		 * @param fully {boolean} Should the cart be fully hidden? Optional. Defaults to false.
		 */
		self.hide = function (e, fully) {
			var cartHeight = (self.UI.cart.offsetHeight) ? self.UI.cart.offsetHeight : document.defaultView.getComputedStyle(self.UI.cart, '').getPropertyValue('height'),
				summaryHeight = (self.UI.summary.offsetHeight) ? self.UI.summary.offsetHeight : document.defaultView.getComputedStyle(self.UI.summary, '').getPropertyValue('height'),
				from = parseInt(self.UI.cart.offsetTop, 10),
				to;

			// make the cart fully hidden
			if (fully || !config.peekEnabled) {
				to = cartHeight * -1;
			// otherwise only show a little teaser portion of it
			} else {
				to = (cartHeight - summaryHeight - 8) * -1;
			}

			if (e && e.preventDefault) { e.preventDefault(); }
			
			if (typeof config.events.onHide == 'function') {
				config.events.onHide.call(self, e);
			}
			
			$.util.animate(self.UI.cart, 'top', { from: from, to: to }, function () {
				if (typeof config.events.afterHide == 'function') {
					config.events.afterHide.call(self, e);
				}	
			});
			
			self.UI.summary.style.backgroundPosition = '-195px -32px';
			self.isShowing = false;
		};
		
 
		/**
		 * Toggles the display of the cart
		 *
		 * @param e {event} The triggering event
		 */		  
		self.toggle = function (e) {
			if (self.isShowing) {
				self.hide(e);
			} else {
				self.show(e);
			}
		};
				
	
		/**
		 * Resets the cart to it's intial state
		 */
		self.reset = function () {			  
			if (typeof config.events.onReset === 'function') {
				config.events.onReset.call(self);
			}
			
			self.products = [];

			if (self.isShowing) {
				self.UI.itemList.innerHTML = '';
				self.UI.subtotalAmount.innerHTML = '';
				self.hide(null, true);
			}
	
			$.storage.remove();
		
			if (typeof config.events.afterReset === 'function') {
				config.events.afterReset.call(self);
			}
		};
		
		
		
		/** PUBLIC METHODS **/
		return {
			
			/**
			 * Init method called when the cart should be rendered to the DOM 
			 *
			 * @param userConfig {object} Customized configuration settings
			 */
			render: function (userConfig) {
				_init(userConfig);
			},
			
			
			/**
			 * Adds a product to the cart 
			 *
			 * @param data {object} Product object. See _dataFilter for format
			 */
			addToCart: function (data) {
				self.addToCart(data);
			},
			
			
			/**
			 * Shows the cart 
			 *
			 * @param e {event} Optional
			 */
			show: function (e) {
				self.show(e);
			},
			
			
			/**
			 * Hides the cart 
			 *
			 * @param e {event} Optional
			 * @param fully {boolean) Optional. If true, the cart will completely hide
			 */
			hide: function (e, fully) {
				self.hide(e, fully);
			},
			
			
			/**
			 * Toggles the visibility of the cart 
			 *
			 * @param e {event} Optional
			 */
			toggle: function (e) {
				self.toggle();
			}, 
			
			
			/**
			 * Resets the cart, emptying and hiding it
			 */
			 reset: function () {
			   self.reset();
			 }
		};
	}());

	
	
	/**
	 * An HTMLElement which displays each product
	 *
	 * @param data {object} The data for the product
	 * @param position {number} The product number
	 */
	var ProductBuilder = function (data, position) {
		this.details = null;
		this.settings = null;
		this.liNode = null;
		this.nameNode = null;
		this.metaNode = null;
		this.priceNode = null;
		this.quantityNode = null;
		this.removeNode = null;
		this.isPlaceholder = false;
		
		this._init(data, position);
	};
	
	
	ProductBuilder.prototype = {		
		/**
		 * Creates the DOM nodes and adds the product content
		 *
		 * @param data {object} The data for the product
		 * @param position {number} The product number
		 */
		_init: function (data, position) {
			var shortName, fullName, price, hiddenInput, key, i;

			this.details = data.details;
			this.settings = data.settings;
			
			this.liNode = document.createElement('li');
			this.nameNode = document.createElement('a');
			this.metaNode = document.createElement('span');
			this.priceNode = document.createElement('span');
			this.quantityNode = document.createElement('input');
			this.removeNode = document.createElement('input');
			
				
			// Don't add blank products
			if (!this.details.item_name && !this.details.item_number) { 
				this.isPlaceholder = true;
				return;
			}

			// Name
			if (this.details.item_name) { 
				fullName = this.details.item_name; 
				shortName = (fullName.length > 20) ? fullName.substr(0, 20) + '...' : fullName;
			}
			
			this.nameNode.innerHTML = shortName;
			this.nameNode.title = fullName;
			this.nameNode.href = this.details.href;
			this.nameNode.appendChild(this.metaNode);	
			
			// Meta info
			if (this.details.item_number) { 
				this.metaNode.innerHTML = '<br>#' + this.details.item_number;
			}
	
			// Options
			i = 0;
			
			while (typeof this.details['on' + i] !== 'undefined') {
				this.metaNode.innerHTML += '<br>' + this.details['on' + i] + ': ' + this.details['os' + i];	  
				i++;
			}

			// Discount
			if (this.details.discount_amount) { 
				this.metaNode.innerHTML += '<br>';
				this.metaNode.innerHTML += config.strings.discount || 'Discount: ';
				this.metaNode.innerHTML += currencies[this.settings.currency_code];
				this.metaNode.innerHTML += this.details.discount_amount;
			}

			// Quantity
			this.details.quantity = parseInt(this.details.quantity, 10);
			
			this.quantityNode.name = 'quantity_' + position;
			this.quantityNode.value = this.details.quantity ? this.details.quantity : 1;
			this.quantityNode.className = 'quantity';

			// Remove button
			this.removeNode.type = 'button';
			this.removeNode.className = 'remove';
			
			// Price
			price = parseFloat(this.details.amount, 10);
			
			if (this.details.discount_amount) {
				price -= this.details.discount_amount;
			}
			
			this.priceNode.innerHTML = currencies[this.settings.currency_code] + (price * parseFloat(this.details.quantity, 10)).toFixed(2);
			this.priceNode.className = 'price';
			
			// Build out the DOM
			this.liNode.appendChild(this.nameNode);			
			this.liNode.appendChild(this.quantityNode); 
			this.liNode.appendChild(this.removeNode);
			this.liNode.appendChild(this.priceNode);	
			
			// Add in hidden product data
			for (key in this.details) {
				if (key !== 'quantity') {
					hiddenInput = document.createElement('input');
					hiddenInput.type = 'hidden';
					hiddenInput.name = key + '_' + position;
					hiddenInput.value = this.details[key];
				
					this.liNode.appendChild(hiddenInput);
				}
			}
		},
		
		
		/**
		 * Utility function to set the quantity of this product 
		 *
		 * @param value {number} The new value
		 */
		setQuantity: function (value) {
			value = parseInt(value, 10);
			
			this.details.quantity = this.quantityNode.value = value;	
			this.setPrice(this.details.amount * value);
		},
		
		
		/**
		 * Utility function to get the quantity of this product
		 *
		 * @return {number}
		 */
		getQuantity: function () {
			return (parseFloat(this.quantityNode.value, 10) || 1);
		},
		
		
		/**
		 * Utility function to set the price of this product 
		 *
		 * @param value {number} The new value
		 */
		setPrice: function (value) {
			value = parseFloat(value, 10);
			
			this.priceNode.innerHTML = currencies[this.settings.currency_code] + parseFloat(value, 10).toFixed(2);
		},
		
		
		/**
		 * Utility function to get the price of this product
		 *
		 * @return {number} 
		 */
		getPrice: function () {
			return (this.details.amount * this.getQuantity());
		}
	};
	

	/**
	 * Map of currency codes and their symbols 
	 */ 
	var currencies = {
		USD: '$',
		ARS: '$',
		AUD: '$',
		CAD: '$',
		BRL: 'R$',
		CZK: 'Kc',
		DKK: 'kr',
		EUR: '\u20AC',
		HKD: '$',
		HUF: 'Ft',
		MYR: 'RM',
		NZD: '$',
		NOK: 'kr',
		PHP: 'Php',
		GBP: '\u00A3',
		PLN: 'z',
		SGD: '$',
		SEK: 'kr',
		CHF: '',
		TWD: 'NT$',
		THB: '\u0E3F',
		JPY: '\u00A5'
	};
	
	
	/** UTILITY METHODS **/
	
	var $ = {};
	
	$.storage = (function () {
		var name = config.name;
		
		// Use HTML5 client side storage
		if (window.localStorage) {
			return {	  
						  
				/**
				 * Loads the saved data
				 * 
				 * @return {object}
				 */
				load: function () {
					var data = localStorage.getItem(name); 
					
					if (data) {
						data = JSON.parse(unescape(data));
					}
					
					return data;
				},
				
				
				/**
				 * Saves the data
				 *
				 * @param products {object} The list of products to save
				 */
				save: function (products) {
					var data = [],
						product,
						len,
						i;
					
					if (products) {
						for (i = 0, len = products.length; i < len; i++) {
							product = products[i];
							data.push({
								details: product.details,
								settings: product.settings
							});
						}
			
						data = escape(JSON.stringify(data));
						localStorage.setItem(name, data);
					}
				},
				
				
				/**
				 * Removes the saved data
				 */
				remove: function () {
					localStorage.removeItem(name);	
				}
			};
			
		// Otherwise use cookie based storage
		} else {
			return {
				
				/**
				 * Loads the saved data
				 * 
				 * @return {object}
				 */
				load: function () {
					var data, 
						cookies, 
						cookie, 
						key = name + '=', 
						value, 
						i;

					try {
						cookies = document.cookie.split(';');

						for (i = 0; i < cookies.length; i++) {
							cookie = cookies[i];

							while (cookie.charAt(0) === ' ') { 
								cookie = cookie.substring(1, cookie.length);
							}

							if (cookie.indexOf(key) === 0) {
								value = cookie.substring(key.length, cookie.length);
								data = JSON.parse(unescape(value));
							}
						}					
					} catch(e) {}

					return data;	
				},
				
				
				/**
				 * Saves the data
				 *
				 * @param products {object} The list of products to save
				 */
				save: function (products, duration) {
					var date = new Date(),
						data = [],
						product,
						len,
						i;

					if (products) {
						for (i = 0, len = products.length; i < len; i++) {
							product = products[i];
							data.push({
								details: product.details,
								settings: product.settings
							});
						}
					
						duration = duration || 30;
						date.setTime(date.getTime() + duration * 24 * 60 * 60 * 1000);

						document.cookie = config.name + '=' + escape(JSON.stringify(data)) + '; expires=' + date.toGMTString() + '; path=' + config.cookiePath;
					}
				},


				/**
				 * Removes the saved data
				 */
				remove: function () {
					this.save(null, -1);
				}
			};
		}
	}());
	
	
	$.event = {
		/**
		 * Events are added here for easy reference
		 */
		cache: [],
		
		
		/**
		 * Cross browser way to add an event to an object and optionally adjust it's scope
		 *
		 * @param obj {HTMLElement} The object to attach the event to
		 * @param type {string} The type of event excluding "on"
		 * @param fn {function} The function
		 * @param scope {object} Object to adjust the scope to (optional)
		 */
		add: function (obj, type, fn, scope) {
			scope = scope || obj; 

			var wrappedFn;

			if (obj.addEventListener) {
				wrappedFn = function (e) { fn.call(scope, e); };
				obj.addEventListener(type, wrappedFn, false);
			} else if (obj.attachEvent) {
				wrappedFn = function () {
					var e = window.event;
					e.target = e.target || e.srcElement;

					e.preventDefault = function () {
						e.returnValue = false;
					};

					fn.call(scope, e);
				};

				obj.attachEvent('on' + type, wrappedFn);
			}

			this.cache.push([obj, type, fn, wrappedFn]);
		},
		
		
		/**
		 * Cross browser way to remove an event from an object
		 *
		 * @param obj {HTMLElement} The object to remove the event from
		 * @param type {string} The type of event excluding "on"
		 * @param fn {function} The function
		 */
		remove: function (obj, type, fn) {
			var wrappedFn, item, len, i;

			for (i = 0; i < this.cache.length; i++) {
				item = this.cache[i];

				if (item[0] == obj && item[1] == type && item[2] == fn) {
					wrappedFn = item[3];

					if (wrappedFn) {
						if (obj.removeEventListener) {
							obj.removeEventListener(type, wrappedFn, false);
						} else if (obj.detachEvent) {
							obj.detachEvent('on' + type, wrappedFn);
						}
						
						delete this.cache[i];
					}
				}
			}
		}
	};
	
	
	$.util = {
		/**
		 * Animation method for elements
		 *
		 * @param el {HTMLElement} The element to animate
		 * @param prop {string} Name of the property to change
		 * @param config {object} Properties of the animation
		 * @param callback {function} Callback function after the animation is complete
		 */
		animate: function (el, prop, config, callback) {
			config = config || {};
			config.from = config.from || 0;
			config.to = config.to || 0;
			config.duration = config.duration || 10;
			config.unit = (/top|bottom|left|right|width|height/.test(prop)) ? 'px' : '';

			var step = (config.to - config.from) / 20;
			var current = config.from;

			(function () {
				el.style[prop] = current + config.unit;
				current += step;

				if ((step > 0 && current > config.to) || (step < 0 && current < config.to) || step === 0) {
					el.style[prop] = config.to + config.unit;

					if (typeof callback === 'function') {
						callback();
					}

					return;
				}

				setTimeout(arguments.callee, config.duration);
			})();
		},
		
		
		/**
		 * Convenience method to return the value of any type of form input
		 *
		 * @param input {HTMLElement} The element who's value is returned
		 */
		getInputValue: function (input) {
			var tag = input.tagName.toLowerCase();

			if (tag == 'select') {
				return input.options[input.selectedIndex].value;
			} else if (tag == 'textarea') {
				return input.innerHTML;
			} else {
				if (input.type == 'radio') {
					return (input.checked) ? input.value : null;
				} else	if (input.type == 'checkbox') {
						return (input.checked) ? input.value : null;
				} else {
					return input.value;
				}
			}
		}
	};
	
	
	/**
	 * JSON Parser - See http://www.json.org/js.html
	 */ 
	if(!this.JSON){JSON={};}(function(){function f(n){return n<10?"0"+n:n;}if(typeof Date.prototype.toJSON!=="function"){Date.prototype.toJSON=function(key){return this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z";};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==="string"?c:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==="object"&&typeof value.toJSON==="function"){value=value.toJSON(key);}if(typeof rep==="function"){value=rep.call(holder,key,value);}switch(typeof value){case"string":return quote(value);case"number":return isFinite(value)?String(value):"null";case"boolean":case"null":return String(value);case"object":if(!value){return"null";}gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==="[object Array]"){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||"null";}v=partial.length===0?"[]":gap?"[\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"]":"["+partial.join(",")+"]";gap=mind;return v;}if(rep&&typeof rep==="object"){length=rep.length;for(i=0;i<length;i+=1){k=rep[i];if(typeof k==="string"){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v);}}}}else{for(k in value){if(Object.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?": ":":")+v);}}}}v=partial.length===0?"{}":gap?"{\n"+gap+partial.join(",\n"+gap)+"\n"+mind+"}":"{"+partial.join(",")+"}";gap=mind;return v;}}if(typeof JSON.stringify!=="function"){JSON.stringify=function(value,replacer,space){var i;gap="";indent="";if(typeof space==="number"){for(i=0;i<space;i+=1){indent+=" ";}}else{if(typeof space==="string"){indent=space;}}rep=replacer;if(replacer&&typeof replacer!=="function"&&(typeof replacer!=="object"||typeof replacer.length!=="number")){throw new Error("JSON.stringify");}return str("",{"":value});};}if(typeof JSON.parse!=="function"){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==="object"){for(k in value){if(Object.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}return reviver.call(holder,key,value);}cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4);});}if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,""))){j=eval("("+text+")");return typeof reviver==="function"?walk({"":j},""):j;}throw new SyntaxError("JSON.parse");};}}());
   
}());
