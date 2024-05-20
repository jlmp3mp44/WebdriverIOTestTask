const { $ } = require('@wdio/globals')
const Page = require('./page');
const HeaderSection = require('../sections/headerSection');



class CartPage extends Page {

    get cartItem(){
        return $$('[class=cart_item]')
    }
    
    open () {
        return browser.url('cart.html') ;
    }
}

module.exports = new CartPage();