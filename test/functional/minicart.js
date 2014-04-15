/*global assert:true */


'use strict';


describe('Minicart', function () {

    it('should add a paypal object to the window', function () {
        assert(window && window.paypal);
    });


    it('show have a render method', function () {
        assert(typeof window.paypal.minicart.render === 'function');
    });


    it('show have a reset method', function () {
        assert(typeof window.paypal.minicart.reset === 'function');
    });

});
