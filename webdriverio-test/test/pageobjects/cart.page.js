const { $ } = require('@wdio/globals')
const Page = require('./page');
const HeaderSection = require('../sections/headerSection');


class CartPage extends Page {

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

    async getCartItemByTitle(title) {
        return $(`//div[@class="inventory_item_name" and text()="${title}"]`);
    }
    
    open () {
        return browser.url('cart.html') ;
    }
}

module.exports = new CartPage();