# minicart.js

The minicart is a great way to improve your PayPal shopping cart integration. One simple change and your users will be able to manage their shopping cart directly from your website. Additional APIs provide you the power to customize the behavior to your needs.

[![Build Status](https://travis-ci.org/jeffharrell/minicart.png?branch=master,3.0-alpha)](https://travis-ci.org/jeffharrell/minicart)


1. [Setup](#interested-lets-get-you-setup)
2. [Customization](#customization)
3. [Event callback examples](#event-callback-examples)
4. [Localization](#localization)
5. [JavaScript API](#javascript-api)
6. [FAQ](#faq)
7. [Questions or comments](#questions-or-comments)



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
Renders the minicart to the page. Possible values include:

 * `parent` - HTMLElement the minicart should render to. Default `document.body`.
 * `target` - HTML target property for the checkout form. Default `null`.
 * `action` - PayPal URL (if you are accessing sandbox or another version of the PayPal website). Default `'https://www.paypal.com/cgi-bin/webscr'`.
 * `template` - HTML template for rendering.
 * `styles` - CSS styles for rendering.
 * `strings` - An object of text strings: `button`, `buttonalt`, `subtotal` and `discount`. 



`paypal.minicart.reset()`  
Resets the minicart back to it's default state.


### View

`paypal.minicart.show()`  
Shows the cart.

`paypal.minicart.hide()`  
Hides the cart.

`paypal.minicart.toggle()`  
Toggles the visibility of the cart.

`paypal.minicart.view.bind(form)`  
Binds a form DOM element's submit event to the minicart. This is useful for forms which may have been added to the page after the initial load. 


### Cart

`paypal.minicart.cart.add(data)`  
Allows you to manually add a product to your cart, e.g. directly using JavaScript and not through a PayPal form. The parameter `data` is a key / value pair object of parameters and their value. For example: 

    {"business":"user@example.com","item_name":"Product","amount":"5.00","currency_code":"USD"}

`paypal.minicart.cart.remove(idx)`

`paypal.minicart.cart.items(idx)`

`paypal.minicart.cart.settings(key)`

`paypal.minicart.cart.discount(config)`

`paypal.minicart.cart.subtotal(config)`

`paypal.minicart.cart.total(config)`

`paypal.minicart.cart.destroy()`

`paypal.minicart.cart.on(event, fn)`

 - `add`
 - `remove`
 - `checkout`
 - `destroy`


### Products

`product.get(key)`

`product.set(key, value)`

`product.options()`

`product.discount(config)`

`product.amount(config)`

`product.total(config)`

`product.isEqual(product2)`

`product.destroy()`

`product.on(event, fn)`

 - `change`
 - `destroy`


## Event callback examples

Examples of how you can use the event callbacks:

* [Preventing checkout until terms are accepted](http://www.minicartjs.com/examples/terms.html)
* [Requiring a minimum quantity to checkout](http://www.minicartjs.com/examples/minquantity.html)
* [Only allowing a fixed quantity per item](http://www.minicartjs.com/examples/fixedquantity.html)
* [Ensuring an option is selected](http://www.minicartjs.com/examples/notempty.html)



## Localization

Localization is supported in the minicart using the `strings` object. For example, if you wanted the cart to appear in French:

    <script> 
        paypal.minicart.render({
            strings: {
                button: "Caisse",  
                subtotal: "Total:",
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

### I have special integration / translation needs. Are there advanced settings?
Yes, there’s a rich API which can be used to customize the minicart. See the [project page README](https://github.com/jeffharrell/MiniCart#readme) for more details.

### Help! I found a bug. I have an issue!
Please log the issue on the [minicart’s issue tracker](https://github.com/jeffharrell/MiniCart/issues) including a link or sample code that reproduces it.

### I made a change and want to integrate it back into the minicart.
Awesome! Thanks for helping out. Please fork the minicart code on Github. Once you're done with the change you can submit a pull request back to me. If everything looks good and the change is beneficial to all I will integrate it.

### I installed the minicart, but my website still redirects to PayPal when clicking on a button. Why?
The minicart doesn’t yet work with what PayPal’s call their “hosted” or “encrypted” buttons which is why this is most likely happening. To fix your buttons, you’ll need to log into paypal.com and do the following steps:

1. Create a button on PayPal’s website and uncheck the Save button at PayPal checkbox under Step 2: Track inventory, profit & loss.
2. Once you’ve created the button click Remove code protection before copying your button’s code.

### The minicart isn’t emptying after a transaction is completed. Why?
You'll want to set a `return` URL parameter for PayPal to redirect back to. On this page make sure to call `paypapl.minicart.reset();`.

### Is non-JavaScript supported?
Sort of. If JavaScript isn't enabled the minicart will not work and the page will fall back to using the standard PayPal HTML buttons. 

### My website uses frames / iframes for it’s products. How can I make the minicart work?
Frames are not officially supported, but you may be able to get some mileage with the `target` configuration setting.

### The minicart isn’t appearing the same as on this page. Why?
This can occur if your page is being rendered in the browser’s [Quirks mode](http://en.wikipedia.org/wiki/Quirks_mode). To check for this issue, validate and correct your HTML markup using the [W3C Markup Validator](http://validator.w3.org/).

### Are previous versions of the minicart available?
All previous versions are [tagged on Github](https://github.com/jeffharrell/MiniCart/tags).

## Questions or comments

If you have questions or suggestions, please use the [issue tracker](https://github.com/jeffharrell/MiniCart/issues) at Github.



