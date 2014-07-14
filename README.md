# Minicart.js

[![Build Status](https://travis-ci.org/jeffharrell/minicart.png?branch=master)](https://travis-ci.org/jeffharrell/minicart)

The minicart is a great way to improve your PayPal shopping cart integration. One simple change and your users will be able to manage their shopping cart directly from your website. Additional APIs provide you the power to customize the behavior to your needs.


1. [Basic Setup](#basic-setup)
2. [Advanced API](#advanced-api)
3. [API Examples](#api-examples)
4. [Customization](#customization)
5. [Localization](#localization)
6. [FAQ](#faq)



## Basic Setup

1. Create a PayPal [Add to Cart Button](https://www.paypal.com/cgi-bin/webscr?cmd=p/xcl/web-accept-to-sc-button-outside)
2. Include the following snippet into your HTML before the closing &lt;/body&gt; tag:

    ```html
    <script src="//cdnjs.cloudflare.com/ajax/libs/minicart/3.0.5/minicart.min.js"></script>
    <script>
        paypal.minicart.render();
    </script>
    ```

3. On your return page include:

    ```html
    <script>
        paypal.minicart.reset();
    </script>
    ```

It's that simple! Now the minicart will appear when a user views or adds a product to their cart.



## Advanced API

The minicart has a JavaScript API for advanced users to customize the behavior.


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
Resets the minicart back to its default state.


### View

`paypal.minicart.view.show()`
Triggers the minicart to show by adding a "minicart-showing" CSS class to the document.

`paypal.minicart.view.hide()`
Triggers the minicart to hide by removing the "minicart-showing" CSS class on the document.

`paypal.minicart.view.toggle()`
Toggles the visibility of the minicart.

`paypal.minicart.view.bind(form)`
Binds an HTMLFormElement's submit event to the minicart. Useful for forms which may have been added to the page after the initial load.


### Cart

`paypal.minicart.cart.add(data)`
Adds an item to the cart. Fires the *add* event. Example data object:

    { "business": "user@example.com", "item_name": "Product", "amount": 5.00, "currency_code": "USD" }

`paypal.minicart.cart.remove(idx)`
Removes an item from the cart by index. Fires the *remove* event.

`paypal.minicart.cart.items(idx)`
Returns an array of items from the cart. If an index is passed then only that item is returned.

`paypal.minicart.cart.settings(key)`
Returns an object of global cart settings. If a key is passed then only that value is returned.

`paypal.minicart.cart.discount(config)`
Calculates the cart discount amount. *config* can be used for formatting.

`paypal.minicart.cart.subtotal(config)`
Calculates the cart total minus discounts. *config* can be used for formatting.

`paypal.minicart.cart.total(config)`
Calculates the cart total. *config* can be used for formatting.

`paypal.minicart.cart.destroy()`
Destroys the cart data and resets it back to the default state. Fires the *destroy* event.

`paypal.minicart.cart.on(event, fn, scope)`
Subscribe to cart events. Events include:
 * `add` - Fired when an item is added. *function (idx, product, isExisting)*
 * `remove` - Fired when an item is removed. *function (idx, product)*
 * `checkout` - Fired on checkout. *function (evt)*
 * `destroy` - Fired when the cart is destroyed. *function ()*

`paypal.minicart.cart.off(event, fn)`
Unsubscribe from cart events.


### Products

`product.get(key)`
Returns a properties object for the product. If a key is passed then only that value is returned.

`product.set(key, value)`
Sets a property for the product. Fires a *change* event.

`product.options()`
Returns the options.

`product.discount(config)`
Calculates the product discount. *config* can be used for formatting.

`product.amount(config)`
Calculates the product amount discounts. *config* can be used for formatting.

`product.total(config)`
Calculates the product total. *config* can be used for formatting.

`product.isEqual(product2)`
Determines if the current product is the same as another.

`product.destroy()`
Destroys the product. Fires the *destroy* event.

`product.on(event, fn, scope)`
Subscribe to cart events. Events include:
 * `change` - Fired when a value is changed. *function (key)*
 * `destroy` - Fired when the product is destroyed. *function ()*

`product.off(event, fn)`
Unsubscribe from product events.


## API Examples

Examples of how you can use the API:

* [Preventing checkout until terms are accepted](https://github.com/jeffharrell/minicart/blob/master/examples/terms.html)
* [Requiring a minimum quantity to checkout](https://github.com/jeffharrell/minicart/blob/master/examples/minquantity.html)
* [Only allowing a fixed quantity per item](https://github.com/jeffharrell/minicart/blob/master/examples/fixedquantity.html)
* [Ensuring an option is selected](https://github.com/jeffharrell/minicart/blob/master/examples/notempty.html)


## Customization

The minicart HTML template and CSS can be fully customized using two different approaches: configuration and custom themes. In both approaches, all functionality from the [API](#advanced-api) is available using [Embedded JavaScript Template](https://github.com/visionmedia/ejs) syntax.


### Configuration

The HTML template and CSS can be overridden using the *config* object.

```js
var myTemplate = "<div><%= config.strings.subtotal %> <%= cart.total({ format: true, showCode: true }) %></div>";

paypal.minicart.render({
    template: myTemplate
});
```

### Custom Themes

Custom themes can be created and bundled into your own custom version of the minicart.js file.

Before creating a custom theme you'll need to have [node.js](http://nodejs.org/) installed. Once install is complete, open a terminal window and run `npm install -g grunt-cli` to install Grunt.

To create a theme follow these steps:

1. [Fork and clone this repo](https://github.com/jeffharrell/minicart/fork) so you can make your own changes. If you're not sure what this means you can find out more on [Github's Help](https://help.github.com/articles/fork-a-repo).
2. In your new fork, create a  directory under `src/themes` with your theme name. For example, let's create `src/themes/myAwesomeTheme`.
3. Next add your HTML template into `src/themes/myAwesomeTheme/index.html`. The templates use [Embedded JavaScript Template](https://github.com/visionmedia/ejs) syntax for logic.
4. Finally add your CSS styles into `src/themes/myAwesomeTheme/styles.css`.
5. With all that behind you it's now time to generate your custom minicart JavaScript file. In a terminal window run `grunt build --theme=myAwesomeTheme`. This will output a bundled JavaScript file complete with the minicart and your new theme at `dist/minicart.myAwesomeTheme.js`.
6. Include this file into your HTML page instead of the normal JavaScript file and you'll see your new theme!

If you're new to the building a theme it's a good idea to copy the one at `src/themes/default` and start there.



## Localization

Localization is supported using the *strings* object.

```js
paypal.minicart.render({
    strings: {
        button: "Caisse",
        buttonAlt: "Total:",
        discount: "Reduction:"
    }
});
```

The currency symbol will be automatically updated based on the *currency_code* setting of your button.




## FAQ

### Is the minicart free? How is it licensed?
Yes, it's free and licensed under the [MIT License](https://github.com/jeffharrell/MiniCart/raw/master/LICENSE.md).

### Which browsers are supported?
The minicart supports Chrome, Safari, Firefox, and Internet Explorer 8+.

### I made a change and want to contribute it. Do you accept pull requests?
Yes, absolutely! Please submit a pull request on Github.

### Help, I found a bug!
Please submit the issue on the [issue tracker](https://github.com/jeffharrell/MiniCart/issues) including a link or sample code to reproduce it.

### The minicart isn't appearing the same as on this page. Why?
This can occur if your page is being rendered in [quirks mode](http://en.wikipedia.org/wiki/Quirks_mode). You can check for this issue, validate and correct your HTML using the [W3C Markup Validator](http://validator.w3.org/).

### I installed the minicart, but my website still redirects to PayPal. Why?
The minicart doesn't work with PayPal's hosted buttons. To fix your buttons go to paypal.com and:

1. Create a button on PayPal's website and uncheck the *Save button at PayPal* checkbox under *Step 2: Track inventory, profit & loss*.
2. Once you've created the button click *Remove code protection* before copying your button code.

If this isn't the case then you may have a JavaScript error on the page. Open the browser debugger console and see if there are any errors.

### The minicart isn't emptying after a transaction is completed. Why?
Your buttons need to contain a *return* parameter with a URL for PayPal to redirect back to on completion. On this page make sure to call `paypal.minicart.reset();`.

### Does the minicart work with frames?
Frames are not officially supported. You may be able to get some mileage with the *target* configuration setting.

### Are previous versions of the minicart available?
All previous versions are [tagged on Github](https://github.com/jeffharrell/MiniCart/tags).
