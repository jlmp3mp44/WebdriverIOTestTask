const page = require("./page");

class InventoryPage extends page {
  get titleProducts() {
    return $('[data-test="title"]');
  }

  get inventoryItemsList() {
    return $$(".inventory_item");
  }

  get sortContainer() {
    return $(".product_sort_container");
  }

  get removeButtons() {
    return $$(`(//*[contains(@data-test, 'remove')])`);
  }
  //use selector with index [1] because when we click on "remove" the next one "remove" will have index [1]
  async clickRemoveButton() {
    const button = $(`(//*[contains(@data-test, 'remove')])[1]`);
    if (await button.isDisplayed()) {
      await button.click();
    }
  }
  // get button "add to cart" for specific item
  async addToCart(index) {
    const button = $(
      `(//button[contains(@data-test, 'add-to-cart')])[${index}]`
    );
    if (await button.isDisplayed()) {
      await button.click();
    } else {
      console.log(`Add to cart button at index: ${index} is not displayed`);
    }
  }
  // get title of specific item
  async getItemTitle(index) {
    return $(`(//*[@data-test="inventory-item-name"])[${index}]`);
  }
  // get price of specific item
  async getItemPrice(index) {
    return $(`(//*[@data-test="inventory-item-price"])[${index}]`);
  }
  //get titles of all items
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
      console.error("Error retrieving item titles:", error);
      throw error;
    }
  }
  //get prices of all items
  async getItemPrices() {
    try {
      const elements = await $$('[data-test="inventory-item-price"]');
      const prices = [];
      for (const element of elements) {
        const text = await element.getText();
        const price = parseFloat(text.replace("$", "").trim());
        prices.push(price);
      }
      return prices;
    } catch (error) {
      console.error("Error retrieving item prices:", error);
      throw error;
    }
  }

  //get specific sort option
  async selectSortOption(value) {
    await this.sortContainer.click();
    const optionElement = await $(`.product_sort_container option[value="${value}"]`);
    await optionElement.click();
    await browser.pause(500);
  }

  open() {
    return browser.url("inventory.html");
  }
}

module.exports = new InventoryPage();
