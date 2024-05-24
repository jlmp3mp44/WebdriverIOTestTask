const { $ } = require('@wdio/globals')
const Page = require('./page');

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

    get removeButton(){
        return $$('[data-test*=remove]');
    }
    

    async buttonAddToCart(index){
        return $(`(//button[contains(@data-test, 'add-to-cart')])[${index}]`);
    }

    async getItemTitle(index){
        return $(`(//*[@data-test="inventory-item-name"])[${index}]`);
    }

    async getItemPrice(index){
        return $(`(//*[@data-test="inventory-item-price"])[${index}]`)
    }

    async getItemTitles() {
        try {
            const elements = await $$('[data-test="inventory-item-name"]');
            const titles = [];
            for (const element of elements) {
                const title = await element.getText();
                titles.push(title);
            }
            return titles;
        } catch (error) {
            console.error('Error retrieving item titles:', error);
            throw error;
        }
    }
    
    async getItemPrices() {
        try {
            const elements = await $$('[data-test="inventory-item-price"]');
            const prices = [];
            for (const element of elements) {
                const text = await element.getText();
                const price = parseFloat(text.replace('$', '').trim());
                prices.push(price);
            }
            return prices;
        } catch (error) {
            console.error('Error retrieving item prices:', error);
            throw error;
        }
    }
    

    async selectSortOption(value) {
        await this.sortContainer.click();
        const optionElement = await $(`.product_sort_container option[value="${value}"]`);
        return optionElement;
    }

    open () {
        return browser.url('inventory.html') ;
    }
}

module.exports = new InventoryPage();