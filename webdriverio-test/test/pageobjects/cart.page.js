const page = require('./page');

class CartPage extends page {
    
    get cartTitle(){
        return $('//span[contains(text(), "Cart")]');
    }

    get cartItem(){
        return $$('.cart_item');
    }

    get checkoutButton(){
        return $('[data-test=checkout]');
    }

    get messageCartIsEmpty(){
        return $('//[contains(text(), "Cart is empty")]');
    }

    //Get item from Cart by title
    async getCartItemByTitle(title) {
        return $(`//div[@class="inventory_item_name" and text()="${title}"]`);
    }

    async createCheckout(){
        (await this.checkoutButton).click();
    }
    
    open () {
        return browser.url('cart.html') ;
    }
}

module.exports = new CartPage();