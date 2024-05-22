const { $ } = require('@wdio/globals')
const Page = require('./page');
const HeaderSection = require('../sections/headerSection');


class InventoryPage extends Page {
    
    get titleProducts () {
        return  $('[data-test="title"]');
    }

    get inventoryItemsList(){
        return $$('.inventory_item');
    }

    get sortContainer() {
        return $('.product_sort_container');
    }
    
    get optionValuesSortContainer() {
        return `${this.sortContainer.selector} option`;
    }

    async buttonAddToCart(index){
        return $(`(//button[contains(@data-test, 'add-to-cart')])[4]`);
    }

    async getItemTitle(index){
        return $(`(//*[@data-test="inventory-item-name"])[${index + 1}]`);
    }
    
    async specificOptionElement(value) {
        const sortContainerElement = await this.sortContainer;
        const sortContainerSelector = await sortContainerElement.getAttribute('class');
        const optionSelector = `.${sortContainerSelector} option[value="${value}"]`;
        return $(optionSelector); // Locate and return the element
    }
    
    async isFieldTitlePresent(){
        (await this.fieldTitle).waitForDisplayed;
        return (await this.fieldTitle).isDisplayed;
    }

    async gettitleProductsText() {
        return await this.titleProducts.getText();
    }

    
    async compareProductItemTitlesInOrder() {
        const inventoryItemsCount = await this.inventoryItemsList.length;
        for (let i = 0; i < inventoryItemsCount - 1; i++) {
            const title1Element = await this.getItemTitle(i);
            const title1 = await title1Element.getText(); // Get text of the current item
    
            const title2Element = await this.getItemTitle(i + 1);
            const title2 = await title2Element.getText(); // Get text of the next item
    
            const comparisonResult = title1.localeCompare(title2); // Compare the titles
            if (comparisonResult > 0) {
                return false; // Titles are not in the correct order
            }
        }
        return true; // All titles are in the correct order
    }
    

    
    open () {
        return browser.url('inventory.html') ;
    }
}

module.exports = new InventoryPage();