const { $ } = require('@wdio/globals')
const Page = require('./page');
const HeaderSection = require('../sections/headerSection');



class InventoryPage extends Page {
    
    get titleProducts () {
        return  $('[data-test="title"]');
    }

    get buttonAddToCart(){
        return $('[data-test*="add-to-cart"]')
    }

    get inventoryItem(){
        return $('[class=inventory_item]');
    }

    async isFieldTitlePresent(){
        (await this.fieldTitle).waitForDisplayed;
        return (await this.fieldTitle).isDisplayed;
    }

    async gettitleProductsText() {
        return await this.titleProducts.getText();
    }

    async getLogoutButton() {
        const menuItems = await HeaderSection.menuItems;
        
        for (const item of menuItems) {
            const text = await item.getText();
            if (text === 'Logout') {
                return item;
            }
        }
    
        return null; 
    }
    
    open () {
        return browser.url('inventory.html') ;
    }
}

module.exports = new InventoryPage();