const Page = require('./page');

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

    async backHome(){
        (await this.backHomeButton).click();
    }
    
    open () {
        return browser.url('checkout-complete.html')
    }
}

module.exports = new CheckoutCompletePage();