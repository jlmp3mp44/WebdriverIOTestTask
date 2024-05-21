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

    get inventoryItemsList(){
        return $$('.inventory_item');
    }

    get sortContainer() {
        return $('.product_sort_container');
    }
    
    get optionValuesSortContainer() {
        return `${this.sortContainer.selector} option`;
    }
    
    async specificOptionElement(value) {
        const sortContainerElement = await this.sortContainer;
        const sortContainerSelector = await sortContainerElement.getAttribute('class');
        const optionSelector = `.${sortContainerSelector} option[value="${value}"]`;
        console.log("SELECTOR", optionSelector);
        return $(optionSelector); // Locate and return the element
    }
    
    async isFieldTitlePresent(){
        (await this.fieldTitle).waitForDisplayed;
        return (await this.fieldTitle).isDisplayed;
    }

    async gettitleProductsText() {
        return await this.titleProducts.getText();
    }

    async getProductItemTitle(index) {
        const inventoryItems = await $$(this.inventoryItemsList); // Locate all product items
        if (index >= inventoryItems.length) {
            throw new Error('Index out of bounds'); // Handle out-of-bounds index
        }
        const inventoryItem = inventoryItems[index]; // Get the specific item by index
        const itemNameElement = await inventoryItem.$('div.inventory_item_name'); // Locate the title element within the product item
        return await itemNameElement.getText(); // Retrieve and return the text of the title element
    }

    async compareProductItemTitlesInOrder() {
        const inventoryItemsCount = await this.inventoryItemsList.length;
        for (let i = 0; i < inventoryItemsCount - 1; i++) {
            const title1 = await this.getProductItemTitle(i); // Get the title of the current item
            const title2 = await this.getProductItemTitle(i + 1); // Get the title of the next item
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