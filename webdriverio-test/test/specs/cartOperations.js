const { expect } = require("@wdio/globals");
const loginPage = require("../pageobjects/login.page");
const inventoryPage = require("../pageobjects/inventory.page");
const testData = require("../data/testData");
const headerSection = require("../sections/headerSection");
const cartPage = require("../pageobjects/cart.page");
const footerSection = require("../sections/footerSection");
const checkoutPage = require("../pageobjects/checkout.page");
const overviewPage = require("../pageobjects/overview.page");
const checkoutCompletePage = require("../pageobjects/checkoutComplete.page");
const {
  isAscending,
  isDescending,
  isAscendingPrice,
  isDescendingPrice,
  checkSocialMedia,
} = require("../utils/utils");

describe("E-commerce Cart Operations", () => {
  beforeEach(async () => {
    await loginPage.open();
    await loginPage.login(
      testData.validCredentials.username,
      testData.validCredentials.password
    );
  });

  afterEach(async () => {
    await inventoryPage.open();
    const lenght = await inventoryPage.removeButtons.length;
    for (let i = 0; i <= lenght; i++) {
      await inventoryPage.clickRemoveButton();
    }
  });

  it("Logout", async () => {
    await expect(inventoryPage.titleProducts).toBeDisplayed();

    await headerSection.openMenu();
    expect(headerSection.menuItems).toBeElementsArrayOfSize(4);

    await headerSection.logout();
    expect(loginPage.btnSubmit).toBeDisplayed();
    //check that input fields are empty
    expect(await loginPage.inputUsername).toHaveValue("");
    expect(await loginPage.inputPassword).toHaveValue("");
  });

  it("Saving the card after logout ", async () => {
    await expect(inventoryPage.titleProducts).toBeDisplayed();

    const indixesToAdd = [1, 2]; //specify idexes for items, that want to add to cart
    const itemsTitles = []; // array for storing titles of items
    const initialBadgeCount = await headerSection.getBadgeCount();
    //loop to add items to the cart
    for (const index of indixesToAdd) {
      await inventoryPage.addToCart(index);
      const itemTitle = await inventoryPage.getItemTitle(index);
      itemsTitles.push(await itemTitle.getText());
    }
    //get count of items near to "Cart" button
    const newBadgeCount = await headerSection.getBadgeCount();
    expect(newBadgeCount).toEqual(initialBadgeCount + indixesToAdd.length);

    await headerSection.openMenu();
    expect(headerSection.menuItems).toBeElementsArrayOfSize(4);

    headerSection.logout();
    expect(loginPage.btnSubmit).toBeDisplayed();
    //check that input fields are empty
    expect(await loginPage.inputUsername).toHaveValue("");
    expect(await loginPage.inputPassword).toHaveValue("");
    //again login
    await loginPage.login(
      testData.validCredentials.username,
      testData.validCredentials.password
    );
    expect(inventoryPage.inventoryItem).toBeDisplayed();
    expect(headerSection.buttonShopCart).toBeDisplayed();
    //check that all items that were added are saved on the Cart page
    await headerSection.openCart();
    expect(cartPage.cartItems).toBeElementsArrayOfSize(newBadgeCount);
    for (const title of itemsTitles) {
      expect(await cartPage.getCartItemByTitle(title)).toBeDisplayed();
    }
  });

  it("Sorting", async () => {
    await expect(inventoryPage.titleProducts).toBeDisplayed();
    //sort with 'a-z' filter
    await inventoryPage.selectSortOption(testData.filters.az);
    titles = await inventoryPage.getItemTitles();
    expect(isAscending(titles)).toBe(true);
    //sort with 'z-a' filter
    await inventoryPage.selectSortOption(testData.filters.za);
    titles = await inventoryPage.getItemTitles();
    expect(isDescending(titles)).toBe(true);
    //sort with 'li-ho' filter
    await inventoryPage.selectSortOption(testData.filters.lohi);
    prices = await inventoryPage.getItemPrices();
    expect(isAscendingPrice(prices)).toBe(true);
    //sort with 'hi-lo' filter
    await inventoryPage.selectSortOption(testData.filters.hilo);
    prices = await inventoryPage.getItemPrices();
    expect(isDescendingPrice(prices)).toBe(true);
  });

  it("Footer Links", async () => {
    await expect(inventoryPage.titleProducts).toBeDisplayed();
    //check that pages opened
    checkSocialMedia(
      footerSection.twitterButton,
      testData.socialMedias.twitter,
      '//span[contains(text(), "Sauce Labs")]'
    );
    checkSocialMedia(
      footerSection.facebookButton,
      testData.socialMedias.facebook,
      '//h1[contains(text(), "Sauce Labs")]'
    );
    checkSocialMedia(
      footerSection.linkedinButton,
      testData.socialMedias.linkedin,
      '//h1[contains(text(), "Sauce Labs")]'
    );
  });

  it("Valid Checkout", async () => {
    await expect(inventoryPage.titleProducts).toBeDisplayed();

    const indexesToAdd = [1]; //specify idexes for items, that want to add to cart
    const itemsTitles = []; //array to storing the items
    let totalPriceSum = 0; //tottal sum for all items, that are in the cart

    const initialBadgeCount = await headerSection.getBadgeCount();
    //loop for add items to cart and sum the price
    for (const index of indexesToAdd) {
      await inventoryPage.addToCart(index);
      const productTitle = await inventoryPage.getItemTitle(index);
      const titleText = await productTitle.getText();
      itemsTitles.push(titleText);
      const productPriceElement = await inventoryPage.getItemPrice(index);
      const productPriceText = await productPriceElement.getText();
      const productPrice = parseFloat(productPriceText.replace("$", "").trim());
      totalPriceSum += productPrice;
    }
    //check that number of items near to "Cart" button is right
    const newBadgeCount = await headerSection.getBadgeCount();
    expect(newBadgeCount).toEqual(initialBadgeCount + indexesToAdd.length);
    //check that on the Cart page all items that we added are present
    await headerSection.openCart();
    expect(cartPage.cartItems).toBeElementsArrayOfSize(newBadgeCount);
    for (const title of itemsTitles) {
      expect(await cartPage.getCartItemByTitle(title)).toBeDisplayed();
    }

    await cartPage.createCheckout();
    expect(checkoutPage.chekoutForm).toBeDisplayed();
    //check inputs on the Checkout Page
    await checkoutPage.setFirstName(testData.userCheckoutInfo.firstname);
    expect(checkoutPage.firstNameInput).toHaveValue(
      testData.userCheckoutInfo.firstname
    );

    await checkoutPage.setLastName(testData.userCheckoutInfo.lastname);
    expect(checkoutPage.firstNameInput).toHaveValue(
      testData.userCheckoutInfo.lastname
    );

    await checkoutPage.setPostalCode(testData.userCheckoutInfo.postalCode);
    expect(checkoutPage.firstNameInput).toHaveValue(
      testData.userCheckoutInfo.postalCode
    );

    await checkoutPage.countinue();
    expect(overviewPage.overviewTitle).toBeDisplayed();
    expect(overviewPage.cartItems).toBeElementsArrayOfSize(indexesToAdd.length);
    //check that on the Overview page all items that we added are present
    for (const title of itemsTitles) {
      expect(await overviewPage.getItemByTitle(title)).toBeDisplayed();
    }
    const overviewTotalPrice = await overviewPage.totalPrice();
    expect(overviewTotalPrice).toEqual(totalPriceSum);

    await overviewPage.finishOrder();
    expect(checkoutCompletePage.checkoutCompleteTitle).toBeDisplayed();
    expect(checkoutCompletePage.thankOrderMessage).toBeDisplayed();
    //check that after creating order that in our cart are no items
    await checkoutCompletePage.backHome();
    expect(inventoryPage.titleProducts).toBeDisplayed();
    expect(await headerSection.buttonBadge.isExisting()).toBe(false);
  });
  //This test has a bug, so he is disabled
  xit("Checkout without products", async () => {
    await expect(inventoryPage.titleProducts).toBeDisplayed();

    await headerSection.openCart();
    const cartItemsExist = await cartPage.cartItems.isExisting();
    await expect(cartItemsExist).toBe(false);

    await cartPage.createCheckout();
    await expect(cartPage.cartTitle).toBeDisplayed();
    await expect(cartPage.messageCartIsEmpty).toBeDisplayed();
  });
});
