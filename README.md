The Mini Cart
=============

The Mini Cart is a great way to improve your PayPal integration by creating an overlay which appears as a user adds products to their cart. It’s a simple change that creates a wonderful new experience for your website!



Interested? Let’s get you setup
-------------------------------

1. Start with a PayPal [Add to Cart Button](https://www.paypal.com/cgi-bin/webscr?cmd=p/xcl/web-accept-to-sc-button-outside)
2. Download the latest [minicart.js](https://raw.github.com/jeffharrell/MiniCart/master/minicart.js) – You can also browse the [tagged versions](https://github.com/jeffharrell/MiniCart/tags)
3. Next, include the following snippet of JavaScript code into your HTML file before the closing &lt;/body&gt; tag

Make sure to update the path to point to your downloaded copy of minicart.js!

    <script src="/path/to/minicart.js"></script>
    <script>
        PAYPAL.apps.MiniCart.render();
    </script>

It’s as simple as that! Now the Mini Cart will appear when a user adds a product to, views, or has an item in their cart.



Customization
-------------

You can customize the script to make it work for your site by passing a JavaScript object as an argument, setting any of the following optional properties:

`parent`  
The HTMLElement the Mini Cart should render as a child of. Default document.body.

`formTarget`  
The HTML target property for the checkout form.

`displayEdge`  
The edge of the page the cart should pin to. Set to left or right. Default right.

`edgeDistance`  
Distance from the edge the cart should appear. Default 50px.

`cookiePath`  
The base path of your website to set the cookie to (useful for shared website hosting)

`peekEnabled`  
Boolean to determine if the cart should "peek" when it's hidden with items. Default true.

`paypalURL`  
The PayPal URL to use if you are accessing sandbox or another version of the PayPal website. Defaults to https://www.paypal.com/cgi-bin/webscr.

`strings`  
An object of localizable text strings used:  

* `button` - The checkout button text
* `subtotal` - The subtotal text  
* `discount` - The discount text  
* `shipping` - The shipping text  

`events`  
An object of customizable callbacks:  

* `onRender` - Event before the cart is rendered  
* `afterRender` - Event after the cart is rendered  
* `onHide` - Event before the cart is hidden  
* `afterHide` - Event after the cart is hidden  
* `onShow` - Event before the cart is shown  
* `afterShow` - Event after the cart is shown  
* `onAddToCart` - Event before a product is added to the cart  
* `afterAddToCart` - Event after a product is added to the cart  
* `onRemoveFromCart` - Event before a product is removed from the cart  
* `afterRemoveFromCart` - Event after a product is removed from the cart
* `onCheckout` - Event before the checkout action takes place  
* `onReset` - Event before the cart is emptied (typically when a transaction is completed)  
* `afterReset` - Event after the cart is emptied (typically when a transaction is completed)  

The scope of all events is adjusted to the Mini Cart to allow access to the products, UI, and certain functions. See below for an example of a custom configuration:

    <script>
        PAYPAL.apps.MiniCart.render({
            displayEdge: "right",
            edgeDistance: "50px",
			events: {
				afterAddToCart: function () {
					var msg = "There's now " + this.products.length + " unique product(s).";
					msg += " That's a total of " + this.calculateSubtotal() + "!";
					
					alert(msg);
				}
			}
        });
    </script> 



Localization
------------

Localization and adaption are supported in the Mini Cart using the configuration strings object. For example, if we wanted the cart to appear in French we would need to pass our configuration like this:

    <script> 
        PAYPAL.apps.MiniCart.render({
            strings: {
                button: "Caisse",  
                subtotal: "Total ",
                shipping: "ne comprend pas les frais de port et d'impôt" 	
            }
        });
    </script>

The currency symbol will be automatically adjusted based on the currency_code setting of your button.



JavaScript API
--------------

The Mini Cart has a rich JavaScript API which allows you to control it using the following methods:

`PAYPAL.apps.MiniCart.render()`  
Renders the cart element to the page. This method is required to see the Mini Cart.

`PAYPAL.apps.MiniCart.bindForm(form)`  
Binds a form DOM element's submit event to the Mini Cart. This is useful for forms which may have been added to the page after the initial load. 

`PAYPAL.apps.MiniCart.addToCart(data)`  
Allows you to manually add a product to your cart, e.g. directly using JavaScript and not through a PayPal form. The parameter `data` is a key / value pair object of parameters and their value. For example: 

    {"business":"user@example.com","item_name":"Product","amount":"5.00","currency_code":"USD"}

`PAYPAL.apps.MiniCart.reset()`  
Resets the cart, emptying and hiding it.

`PAYPAL.apps.MiniCart.hide(null, fully)`  
Hides the cart. If the cart contains products then it will "peek" from the top of the window. Set the parameter `fully` to true to override this and have it fully hidden.

`PAYPAL.apps.MiniCart.show()`  
Shows the cart.

`PAYPAL.apps.MiniCart.toggle()`  
Toggles the visibility of the cart.



FAQ
---

### Is the Mini Cart free? How is it licensed?
Yes, it’s free and licensed using an [eBay Open Source License Agreement](https://github.com/jeffharrell/MiniCart/raw/master/LICENSE).

### What browsers does the Mini Cart support?
The Mini Cart is functionally supported by Chrome, Safari, Firefox, Opera, and Internet Explorer 6+. Older versions of IE use cookies for their data store while all other browsers use localStorage.

### I have special integration / translation needs. Are there advanced settings?
Yes, there’s a rich API which can be used to customize the Mini Cart. See the [project page README](https://github.com/jeffharrell/MiniCart#readme) for more details.

### I found a bug / I have an issue!
Please log the issue on the [Mini Cart’s issue tracker](https://github.com/jeffharrell/MiniCart/issues), including a link or sample code that reproduces it if possible.

### I made a change and want to integrate it back into the Mini Cart!
Awesome! Thanks for helping out. Please fork the Mini Cart code on Github. Once you're done with the change you can submit a pull request back to me. If everything looks good and the change is beneficial all I will integrate it.

### I installed the Mini Cart, but my website still redirects to PayPal when clicking on a button. Why?
There's two causes for this. The first is quite easy and it's that you have inserted the Mini Cart JavaScript in the document head or at the top of your page. It needs to be inserted before the closing body element so that it can "see" the PayPal forms.

The other cause is that the Mini Cart doesn’t yet work with what PayPal’s call their “hosted” or “encrypted” buttons which is why this is most likely happening. To fix your buttons, you’ll need to log into paypal.com and do the following steps:

1. Create a button on PayPal’s website and uncheck the Save button at PayPal checkbox under Step 2: Track inventory, profit & loss.
2. Once you’ve created the button click Remove code protection before copying your button’s code.

### The Mini Cart isn’t emptying after a transaction is completed. Why?
The Mini Cart appends a fragment to your button’s return URL which sends a command to it when the user successfully returns from a transaction. If this is not working properly you should make sure that your are setting the value correctly and that it does not already contain a fragment.

### Is non-JavaScript supported?
If your users do not have a JavaScript-capable browser, they will still be able to see your cart buttons and make purchases, but the user interface will gracefully degrade to the standard PayPal Cart.

### My website uses frames / iframes for it’s products. How can I make the Mini Cart work?
Depending upon how your site is setup the Mini Cart isn’t always compatible with websites containing frames. To ensure that it works you need to have the product buttons on the same frame as the main window.

### The Mini Cart isn’t appearing the same as on this page. Why?
This can occur if your page is being rendered in the browser’s [Quirks mode](http://en.wikipedia.org/wiki/Quirks_mode). Example issues include appearing in the bottom left of the browser, not scrolling properly, or having rendering issues. To check for this issue, validate and correct your HTML markup using the [W3C Markup Validator](http://validator.w3.org/).

### The Mini Cart is appearing behind objects on my page!
This happens when you have the position and z-index CSS properties set on an element. If you need to use z-index then you will need to add the following code to your CSS styles:

    #PPMiniCart { position: relative; z-index: 100; }

and set the value to correspond with your code.

### I don't like the way the Mini Cart looks / How can I customize the Mini Cart more?
The Mini Cart CSS is delivered as part of the code and shouldn't be changed. There are some values which can be changed via the config, e.g. the offset or position, but otherwise you'll need to override the Mini Cart's CSS in your own CSS using a higher CSS specificity. 

Here's an example of changing the Mini Cart height so that it grows as products are added:

	#myPage #PPMiniCart ul { height: auto; min-height: 130px; max-height: 500px; }

Note that using an additional id of #myPage in your CSS causes the rule to be more specific than the Mini Cart's and the bowser renders that instead.



Questions or comments
---------------------

We're working to create a perfect experience with the PayPal Mini Cart. If you have questions or suggestions, please use the [issue tracker](https://github.com/jeffharrell/MiniCart/issues) at Github.



