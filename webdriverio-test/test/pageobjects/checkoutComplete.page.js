const { $ } = require('@wdio/globals')
const Page = require('./page');
const InventoryPage = require('../pageobjects/inventory.page');


class CheckoutCompletePage extends Page {

    get checkoutCompleteTitle(){
        return $('//span[contains(text(), "Complete")]');
    }

    get thankOrderMessage(){
        return $('//h2[contains(text(), "Thank you for your order")]');
    }

    get backHomeButton(){
        return $('[data-test=back-to-products]');
    }
    
    open () {
        return browser.url('checkout-complete.html')
    }
}

module.exports = new CheckoutCompletePage();