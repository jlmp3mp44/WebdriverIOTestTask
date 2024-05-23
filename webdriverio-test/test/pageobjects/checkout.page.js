const { $ } = require('@wdio/globals')
const Page = require('./page');
const InventoryPage = require('../pageobjects/inventory.page');


class CheckoutPage extends Page {

    get chekoutForm(){
        return $('//div[@class="checkout_info"]');
    }

    get firstNameInput(){
        return $('[data-test=firstName]');
    }

    get lastNameInput(){
        return $('[data-test=lastName]');
    }

    get postalCodeInput(){
        return $('[data-test=postalCode]');
    }

    get continueButton(){
        return $('[data-test=continue]');
    }

    async setFirstName(firstName){
        await this.firstNameInput.setValue(firstName);
    }

    async setLastName(lastName){
        await this.lastNameInput.setValue(lastName);
    }

    async setPostalCode(postalCode){
        await this.postalCodeInput.setValue(postalCode);
    }
    
    
    open () {
        return browser.url('checkout-step-one.html')
    }
}

module.exports = new CheckoutPage();