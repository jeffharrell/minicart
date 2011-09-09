CHANGELOG
=========

Version 2.0.6
-------------
 - Added support for a new `bindForm` API method
 - Added support for handling_cart
 - Fix for an incorrect cart total when multiple products had discounts
 - Fix for non-aligned text in the cart on some websites
 - Some code cleanup


Version 2.0.5
-------------
 - Adding support for pages served as application/xhtml+xml (thank you willearp!)
 - Fixing currency logic to correctly return "after" content for currencies (thank you mraygoza!)
 - Fixing addToCart external method so you can dynamically add products to the cart
 - README updated with more examples, corrections and links
 - Master Github repository moved to https://github.com/jeffharrell/MiniCart


Version 2.0.4
-------------
 - Enhancement to redraw the contents of the cart in all browser windows whenever the products are modified in one (IE 8 and Firefox)
 - Adding configuration property for adding the Mini Cart as a child of an element other than document.body
 - Adding configuration property to have the cart hide instead of "peek" when it contains products 
 - Added 'charset' to the list of global form settings which get parsed 
 - Adding support for 40 currency symbols
 - Fix for unknown currency codes
 - Fix to prevent item quantity box from updating when keyboard navigation is used


Version 2.0.3
-------------
 - Resolved an issue where the image assets wouldn't load correctly


Version 2.0.2
-------------
 - Enhancement to redraw the contents of the cart in all browser windows whenever the products are modified in one (supported in Chrome, Safari, and Opera)
 - Combined Mini Cart visual assets into a single image
 - Moved onReset execution earlier in the process; created an afterReset method
 - Fixed an issue where customizing a single value in the strings property caused the others to appear as undefined
 - Added a paypalURL property which can be used to point the Mini Cart to PayPal's sandbox URL
 - Fixed an issue where hardcoded quantities would not be added up correctly
 - Fixed incorrect test case in Internet Explorer
 


Version 2.0.1
-------------
 - Fix to correct link behavior when the Mini Cart is displayed
 - Fix to subtotal calculation


Version 2.0
-----------
 - Content can now be localized and / or modified using the Mini Cart configuration
 - Added support to automatically detect the currency symbol from currency code
 - Exposed API for manually adding products to cart through another application, e.g. Flash or custom JavaScript
 - Added support for custom callback events during all important lifecycle events
 - Added additional functionality to automatically empty the cart once the user's checkout is complete; see FAQ
 - Added support for Buy Now buttons
 - Added support for HTML5 localStorage when available to remove the cookie size limitation
 - Updated the cart's change quantity interaction from blur to keyup
 - Changed integration so that Mini Cart can be created before the browser window is completely loaded
 - Fix to support discounts being passed as parameters
 - Added support for radio and textarea inputs
 - Fixed an issue where the product name would link to the current page rather than the product page


Version 1.5
-----------
 - Enhancements for animation in Internet Explorer
 - Removed cart opacity


Version 1.4
-----------
 - Updated the interaction so that the Mini Cart disappears on page load if there are no active products
 - Fix to prevent an issue where the cart will change pages when the Checkout button is clicked
 - Updated display of multiple item options to appear stacked
 - Fix to prevent Opera from dropping the cookie


Version 1.3
-----------
 - Update to JavaScript so that the cart renders correctly under Quirks mode in IE 7/8
 - Modification to MiniCart.onCheckout() to allow a return value of false to stop the checkout action
 - Addition of a MiniCart.onAddToCart() method which allows a custom function before a product is added
 - Inclusion of a minified version of the JavaScript file


Version 1.22
------------
 - Resolved an issue where item options with prices would not be reflected in the totals
 - Resolved an issue where a deleted item takes up space in the cart after a reload in Internet Explorer
 - Updated the item removal animation so that it fades out and then up, rather than simultaneously
 - Interface changes to place the item names and numbers on a line after the product name
 - Interface changes making the height of the cart a minimum height rather than fixed


Version 1.21
------------
 - Minor bug fixes


Version 1.2
-----------
 - Support for user callback functions when a product is added and on checkout
 - Support for stickiness when scrolling in Internet Explorer 6
 - Support for display of difference currencies
 - Support for product level and cart level shipping, handling, and tax
 - Updates to the documentation page
 - Plus, rewriting of some of the code to make it smaller


Version 1.1
-----------
 - Fixed issue in JavaScript where `button` elements weren't registering clicks
 - Fixed issue in JavaScript where not all button parameters were carried through
 - Fixed issue in JavaScript where updating and removing multiple items would cause it to get out of sync
 - Included usage and a URL information in the JavaScript file
 - Updated the minicart's logo
 - Updating transaction amounts and merchant
 - Including a notice that the demo page's transactions are live
 - Including a notice and workaround instructions for hosted and encrypted buttons
 - Setup page tracking for the demo page


Version 1.0
-----------
Initial public release
