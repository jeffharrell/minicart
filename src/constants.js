'use strict';


module.exports = {

    COMMANDS: { _cart: true, _xclick: true, _donations: true },

    SETTINGS: /^(?:business|currency_code|lc|paymentaction|no_shipping|cn|no_note|invoice|handling_cart|weight_cart|weight_unit|tax_cart|discount_amount_cart|discount_rate_cart|page_style|image_url|cpp_|cs|cbt|return|cancel_return|notify_url|rm|custom|charset)/,

    BN: 'MiniCart_AddToCart_WPS_US',

    KEYUP_TIMEOUT: 500,

    SHOWING_CLASS: 'minicart-showing',

    REMOVE_CLASS: 'minicart-remove',

    CLOSER_CLASS: 'minicart-closer',

    QUANTITY_CLASS: 'minicart-quantity',

    ITEM_CLASS: 'minicart-item',

    ITEM_CHANGED_CLASS: 'minicart-item-changed',

    SUBMIT_CLASS: 'minicart-submit',

    DATA_IDX: 'data-minicart-idx'

};
