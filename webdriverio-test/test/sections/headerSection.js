class HeaderSection {
  get buttonMenu() {
    return $('[id*="menu-btn"]');
  }

  get menuItems() {
    return $$('[class*="menu-item"]');
  }

  get buttonShopCart() {
    return $('[class*= "shopping_cart_link"]');
  }

  get buttonBadge() {
    return $('[class="shopping_cart_badge"]');
  }

  get logoutButton() {
    return $('[data-test*="logout"]');
  }
  //get number of items in the cart on near to cart button
  async getBadgeCount() {
    const badgeElement = await this.buttonBadge;
    if (await badgeElement.isDisplayed()) {
      return parseInt(await badgeElement.getText(), 10); // Convert text to number
    }
    return 0;
  }

  async openMenu() {
    await this.buttonMenu.click();
  }

  async logout() {
    (await this.logoutButton).click();
    browser.pause(500);
  }

  async openCart() {
    (await this.buttonShopCart).click();
  }

  open() {
    return browser.url("inventory.html");
  }
}

module.exports = new HeaderSection();
