const { $ } = require('@wdio/globals')
const Page = require('./page');
const HeaderSection = require('../sections/headerSection');


class CartPage extends Page {

    get cartItem(){
        return $$('.cart_item')
    }

    async getCartItemByTitle(title) {
        return $(`//div[@class="inventory_item_name" and text()="${title}"]`);
    }
    
    open () {
        return browser.url('cart.html') ;
    }
}

module.exports = new CartPage();