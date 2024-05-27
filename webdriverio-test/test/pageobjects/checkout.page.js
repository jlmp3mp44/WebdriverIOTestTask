const Page = require('./page');

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
    //Set values to the inputs
    async setFirstName(firstName){
        await this.firstNameInput.setValue(firstName);
    }

    async setLastName(lastName){
        await this.lastNameInput.setValue(lastName);
    }

    async setPostalCode(postalCode){
        await this.postalCodeInput.setValue(postalCode);
    }

    async countinue(){
        (await this.continueButton).click();
    }
    
    
    open () {
        return browser.url('checkout-step-one.html')
    }
}

module.exports = new CheckoutPage();