const { $ } = require('@wdio/globals')
const Page = require('./page');
const InventoryPage = require('../pageobjects/inventory.page');


class OverviewPage extends Page {

    get overviewTitle(){
        return $('//span[contains(text(), "Overview")]');
    }

    get cartItem(){
        return $$('.cart_item');
    }

    async totalPrice(){
        const priceElement = $('[data-test*="subtotal"]');
        const priceText = await priceElement.getText();

        const priceMatch = priceText.match(/\$([0-9]+\.[0-9]{2})/);
        const price = priceMatch ? parseFloat(priceMatch[1]) : null;
        console.log("PRICEPRICEPRICEPRICE" + price)
        return price;
        }

    async getItemByTitle(title) {
        return $(`//div[@class="inventory_item_name" and text()="${title}"]`);
    }

    open () {
        return browser.url('checkout-step-two.html')
    }
}

module.exports = new OverviewPage();