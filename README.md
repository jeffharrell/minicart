# minicart.js

The minicart is a great way to improve your PayPal shopping cart integration. One simple change and your users will be able to manage their shopping cart directly from your website. Additional APIs provide you the power to customize the behavior to your needs.

[![Build Status](https://travis-ci.org/jeffharrell/minicart.png?branch=master,3.0-alpha)](https://travis-ci.org/jeffharrell/minicart)



1. [Setup](#interested-lets-get-you-setup)
2. [Advanced API](#advanced-api)
3. [API Examples](#api-examples)
4. [Localization](#localization)
5. [FAQ](#faq)



## Interested? Let's get you setup

1. Start with a PayPal [Add to Cart Button](https://www.paypal.com/cgi-bin/webscr?cmd=p/xcl/web-accept-to-sc-button-outside)
2. Download the latest [minicart.js](https://raw.github.com/jeffharrell/MiniCart/master/dist/minicart.min.js)
3. Next, include the following snippet of JavaScript code into your HTML file, ideally before the closing &lt;/body&gt; tag:

Make sure to update the path to point to your downloaded copy of minicart.js!

    <script src="/path/to/minicart.js"></script>
    <script>
        paypal.minicart.render();
    </script>

It’s that simple! Now the minicart will appear when a user views or adds a product to their cart.



## Advanced API

The minicart has an advanced JavaScript API which provides you the power to customize the behavior to your needs.


### General

`paypal.minicart.render(config)`  
Renders the minicart to the page. Config is optional and can have the following properties:

 * `parent` - HTMLElement the minicart should render to.
 * `target` - HTML target property for the checkout form. 
 * `action` - PayPal URL (if you are accessing sandbox or another version of the PayPal website).
 * `template` - HTML template for rendering. See [customization](#customization) for details.
 * `styles` - CSS styles for rendering. See [customization](#customization) for details.
 * `strings` - An object of text strings: `button`, `buttonAlt`, `subtotal` and `discount`. 

`paypal.minicart.reset()`  
Resets the minicart back to it's default state.


### View

`paypal.minicart.show()`  
Triggers the minicart to show by adding a "minicart-showing" CSS class to the page.

`paypal.minicart.hide()`  
Triggers the minicart to hide by removing the "minicart-showing" CSS class on the page.

`paypal.minicart.toggle()`  
Toggles the visibility of the minicart.

`paypal.minicart.view.bind(form)`  
Binds a HTMLFormElement's submit event to the minicart. Useful for forms which may have been added to the page after the initial load. 


### Cart

`paypal.minicart.cart.add(data)`  
Adds an item to the cart. Fires the `add` event. Example: 

    { "business": "user@example.com", "item_name": "Product", "amount": 5.00, "currency_code": "USD" }

`paypal.minicart.cart.remove(idx)`  
Removes an item from the cart by index. Fires the `remove` event.

`paypal.minicart.cart.items(idx)`  
Returns an array of items from the cart. If an index is passed then only that item is returned.

`paypal.minicart.cart.settings(key)`  
Returns an object of global cart settings. If a key is passed then only that value is returned.

`paypal.minicart.cart.discount(config)`  
Calculates the cart discount amount. `config` can be used for formatting.

`paypal.minicart.cart.subtotal(config)`  
Calculates the cart total minus discounts. `config` can be used for formatting.

`paypal.minicart.cart.total(config)`  
Calculates the cart total. `config` can be used for formatting.

`paypal.minicart.cart.destroy()`  
Destroys the cart data and resets it back to it's default state. Fires the `destroy` event.

`paypal.minicart.cart.on(event, fn, scope)`  
Subscribe to cart events. Events include:  
 * `add` - Fired when an item is added. `function (idx, product, isExisting)`  
 * `remove` - Fired when an item is removed. `function (idx, product)`  
 * `checkout` - Fired on checkout. `function (evt)`  
 * `destroy` - Fired when the cart is destroyed. `function ()`  

`paypal.minicart.cart.off(event, fn)`  
Unsubscribe from cart events.


### Products

`product.get(key)`  
Returns an object of data for the product. If a key is passed then only that value is returned.

`product.set(key, value)`  
Sets a value for the product. Fires a `change` event.

`product.options()`  
Returns the options.

`product.discount(config)`  
Calculates the product discount. `config` can be used for formatting.

`product.amount(config)`  
Calculates the product amount discounts. `config` can be used for formatting.

`product.total(config)`  
Calculates the product total. `config` can be used for formatting.

`product.isEqual(product2)`  
Determines if the current product is the same as another.

`product.destroy()`  
Destroys the product. Fires the `destroy` event.

`product.on(event, fn, scope)`  
Subscribe to cart events. Events include:  
 * `change` - Fired when a value is changed. `function (key)`  
 * `destroy` - Fired when the product is destroyed. `function ()`  

`product.off(event, fn)`  
Unsubscribe from product events.


## API Examples

Examples of how you can use the advanced API:

* [Preventing checkout until terms are accepted](https://github.com/jeffharrell/minicart/blob/master/examples/terms.html)
* [Requiring a minimum quantity to checkout](https://github.com/jeffharrell/minicart/blob/master/examples/minquantity.html)
* [Only allowing a fixed quantity per item](https://github.com/jeffharrell/minicart/blob/master/examples/fixedquantity.html)
* [Ensuring an option is selected](https://github.com/jeffharrell/minicart/blob/master/examples/notempty.html)



## Localization

Localization is supported in the minicart using the `strings` configuration object. For example, if you wanted the cart to appear in French:

    <script> 
        paypal.minicart.render({
            strings: {
                button: "Caisse",  
                buttonAlt: "Total:",
                discount: "Réduction:"
                processing: "Traitement"
            }
        });
    </script>

The currency symbol will be automatically updated based on the `currency_code` setting of your button.



## FAQ

### Is the minicart free? How is it licensed?
Yes, it’s free and licensed under the [MIT License](https://github.com/jeffharrell/MiniCart/raw/master/LICENSE).

### What browsers does the minicart support?
The minicart supports Chrome, Safari, Firefox, and Internet Explorer 8+.

### I made a change and want to integrate it back. Do you accept pull requests?
Yes, absolutely. Please submit a pull request on Github.

### Help! I found a bug. I have an issue!
Please log the issue on the [minicart’s issue tracker](https://github.com/jeffharrell/MiniCart/issues) including a link or sample code that reproduces it.

### The minicart isn’t appearing the same as on this page. Why?
This can occur if your page is being rendered in the browser’s [Quirks mode](http://en.wikipedia.org/wiki/Quirks_mode). To check for this issue, validate and correct your HTML markup using the [W3C Markup Validator](http://validator.w3.org/).

### I installed the minicart, but my website still redirects to PayPal. Why?
The minicart doesn’t yet work with what PayPal’s call their “hosted” or “encrypted” buttons which is why this is most likely happening. To fix your buttons, you’ll need to log into paypal.com and do the following steps:

1. Create a button on PayPal’s website and uncheck the Save button at PayPal checkbox under Step 2: Track inventory, profit & loss.
2. Once you’ve created the button click Remove code protection before copying your button’s code.

### The minicart isn’t emptying after a transaction is completed. Why?
Your buttons need a `return` URL parameter for PayPal to redirect back to. On this page make sure to call `paypapl.minicart.reset();`.

### The minicart isn’t appearing the same as on this page. Why?
This can occur if your page is being rendered in the browser’s [Quirks mode](http://en.wikipedia.org/wiki/Quirks_mode). To check for this issue, validate and correct your HTML markup using the [W3C Markup Validator](http://validator.w3.org/).

### Does the minicart work with frames?
Frames are not officially supported, but you may be able to get some mileage with the `target` configuration setting.

### Is non-JavaScript supported?
Sort of. If JavaScript isn't enabled the minicart will not work and the page will fall back to using the standard PayPal HTML buttons. 

### Are previous versions of the minicart available?
All previous versions are [tagged on Github](https://github.com/jeffharrell/MiniCart/tags).
