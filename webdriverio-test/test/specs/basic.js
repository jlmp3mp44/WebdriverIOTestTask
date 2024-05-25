const { expect } = require('@wdio/globals')
const LoginPage = require('../pageobjects/login.page')
const InventoryPage =  require('../pageobjects/inventory.page')
const testData =  require('../data/testData')
const HeaderSection = require('../sections/headerSection');
const CartPage =  require('../pageobjects/cart.page');
const FooterSection = require('../sections/footerSection');
const CheckoutPage =  require('../pageobjects/checkout.page')
const OverviewPage =  require('../pageobjects/overview.page');
const CheckoutCompletePage = require('../pageobjects/checkoutComplete.page');
const { isAscending, isDescending, isAscendingPrice, isDescendingPrice} = require('../data/utils');
const { checkSocialMedia } = require('./footerLinks'); 

describe('Authorization', () => {
    it('Valid login', async () => {
        await LoginPage.open();

        await LoginPage.setUsername(testData.validCredentials.username);
        expect(LoginPage.inputUsername).toHaveValue(testData.validCredentials.username);

        await LoginPage.setPassword(testData.validCredentials.password);
        await expect(LoginPage.inputPassword).toHaveAttribute('type', 'password');

        await (await LoginPage.btnSubmit).click();
        browser.pause(500);
        expect(InventoryPage.titleProducts).toHaveText(testData.titles.inventoryTitle);
        
    });

    it("Login with invalid password", async() => {
        await LoginPage.open();

        await LoginPage.setUsername(testData.validCredentials.username);
        expect(LoginPage.inputUsername).toHaveValue(testData.validCredentials.username);

        await LoginPage.setPassword(testData.invalidCredentials.password);
        await expect(LoginPage.inputPassword).toHaveAttribute('type', 'password');

        await (await LoginPage.btnSubmit).click();
        browser.pause(500);
        //check that error icons are present
        expect(LoginPage.getUsernameErrorIcon).toBeDisplayed(); 
        expect(LoginPage.getPasswordErrorIcon).toBeDisplayed();
        await expect(LoginPage.errorMessage).toBeDisplayed()
        //check that fields are highlighted with red
        expect(await LoginPage.isPasswordFieldHighlighted()).toBe(true);
        expect(await LoginPage.isUsernameFieldHighlighted()).toBe(true);
        
    })

    it("Login with invalid login", async() => {
        await LoginPage.open();

        await LoginPage.setUsername(testData.invalidCredentials.username);
        expect(LoginPage.inputUsername).toHaveValue(testData.invalidCredentials.username);

        await LoginPage.setPassword(testData.validCredentials.password);
        await expect(LoginPage.inputPassword).toHaveAttribute('type', 'password');

        await (await LoginPage.btnSubmit).click();
        browser.pause(500);
        //check that error icons are present
        expect(LoginPage.getUsernameErrorIcon).toBeDisplayed();
        expect(LoginPage.getPasswordErrorIcon).toBeDisplayed();
        await expect(LoginPage.errorMessage).toBeDisplayed()
        //check that fields are highlighted with red
        expect(await LoginPage.isPasswordFieldHighlighted()).toBe(true);
        expect(await LoginPage.isUsernameFieldHighlighted()).toBe(true);
        
    })
});

describe('Work with cards', () => {
    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login(testData.validCredentials.username, testData.validCredentials.password);
    });

    afterEach(async () => {
        await InventoryPage.open();
        const removeButtons = await InventoryPage.removeButton;
        // click on the buttons "Remove form cart" after each test
        if (removeButtons.length > 0) {
            for (const removeButton of removeButtons) {
                if (await removeButton.isDisplayed()) {
                    await removeButton.click();
                }
            }
        }
    });

    it('Logout', async () => {

        await expect(InventoryPage.titleProducts).toBeDisplayed();
        
        await (await HeaderSection.buttonMenu).click();
        expect(HeaderSection.menuItems).toBeElementsArrayOfSize(4);

        (await HeaderSection.logoutButton).click();
        browser.pause(500);
        expect(LoginPage.btnSubmit).toBeDisplayed();
        //check that input fields are empty
        expect(await LoginPage.inputUsername).toHaveValue('');
        expect(await LoginPage.inputPassword).toHaveValue('')
    });
    
    it('Saving the card after logout ', async () => {
        await expect(InventoryPage.titleProducts).toBeDisplayed();

        const indixesToAdd = [1, 2]; //specify idexes for items, that want to add to cart
        const itemsTitles = []; // array for storing titles of items
        const initialBadgeCount = await HeaderSection.getBadgeCount();
        //loop to add items to the cart
        for (const index of indixesToAdd) {
            await (await InventoryPage.buttonAddToCart(index)).click();
            const itemTitle = await InventoryPage.getItemTitle(index);
            itemsTitles.push(await itemTitle.getText());
        }
       //get count of items near to "Cart" button
        const newBadgeCount = await HeaderSection.getBadgeCount();
        expect(newBadgeCount).toEqual(initialBadgeCount + indixesToAdd.length);

        await (await HeaderSection.buttonMenu).click();
        expect(HeaderSection.menuItems).toBeElementsArrayOfSize(4);

        (await HeaderSection.logoutButton).click();
        browser.pause(500);
        expect(LoginPage.btnSubmit).toBeDisplayed();
        //check that input fields are empty
        expect(await LoginPage.inputUsername).toHaveValue('');
        expect(await LoginPage.inputPassword).toHaveValue('')
        //again login
        await LoginPage.login(testData.validCredentials.username, testData.validCredentials.password);
        browser.pause(500);
        expect(InventoryPage.inventoryItem).toBeDisplayed();
        expect(HeaderSection.buttonShopCart).toBeDisplayed();
        //check that all items that were added are saved on the Cart page
        await (await HeaderSection.buttonShopCart).click();
        expect(CartPage.cartItems).toBeElementsArrayOfSize(newBadgeCount);
        for (const title of itemsTitles) {
            expect(await CartPage.getCartItemByTitle(title)).toBeDisplayed();
        }

    });

    it('Sorting', async () => {
        await expect(InventoryPage.titleProducts).toBeDisplayed();
        //sort with 'a-z' filter
        (await InventoryPage.selectSortOption(testData.filters.az)).click();
        await browser.pause(500); 
        titles = await InventoryPage.getItemTitles();
        expect(isAscending(titles)).toBe(true);
        //sort with 'z-a' filter
        (await InventoryPage.selectSortOption(testData.filters.za)).click();
        await browser.pause(500); 
        titles = await InventoryPage.getItemTitles();
        expect(isDescending(titles)).toBe(true);
        //sort with 'li-ho' filter
        (await InventoryPage.selectSortOption(testData.filters.lohi)).click();
        await browser.pause(500); 
        prices = await InventoryPage.getItemPrices();
        expect(isAscendingPrice(prices)).toBe(true);
        //sort with 'hi-lo' filter
        (await InventoryPage.selectSortOption(testData.filters.hilo)).click();
        await browser.pause(500); 
        prices = await InventoryPage.getItemPrices();
        expect(isDescendingPrice(prices)).toBe(true);
    });

    it('Footer Links', async() => {
        await expect(InventoryPage.titleProducts).toBeDisplayed();
        //check that pages opened
        checkSocialMedia(FooterSection.twitterButton, testData.socialMedias.twitter,'//span[contains(text(), "Sauce Labs")]');
        checkSocialMedia(FooterSection.facebookButton, testData.socialMedias.facebook,'//h1[contains(text(), "Sauce Labs")]');
        checkSocialMedia(FooterSection.linkedinButton, testData.socialMedias.linkedin,'//h1[contains(text(), "Sauce Labs")]');
    })

    it('Valid Checkout', async () => {
        await expect(InventoryPage.titleProducts).toBeDisplayed();

        const indexesToAdd = [1]; //specify idexes for items, that want to add to cart
        const itemsTitles = []; //array to storing the items
        let totalPriceSum = 0; //tottal sum for all items, that are in the cart
    
        const initialBadgeCount = await HeaderSection.getBadgeCount();
        //loop for add items to cart and sum the price
        for (const index of indexesToAdd) {
            await (await InventoryPage.buttonAddToCart(index)).click();
            const productTitle = await InventoryPage.getItemTitle(index);
            itemsTitles.push(await productTitle.getText());
            const productPriceElement = await InventoryPage.getItemPrice(index);
            const productPriceText = await productPriceElement.getText();
            const productPrice = parseFloat(productPriceText.replace('$', '').trim()); 
            totalPriceSum += productPrice; 
        }
        //check that number of items near to "Cart" button is right
        const newBadgeCount = await HeaderSection.getBadgeCount();
        expect(newBadgeCount).toEqual(initialBadgeCount + indexesToAdd.length);
        //check that on the Cart page all items that we added are present
        await (await HeaderSection.buttonShopCart).click();
        expect(CartPage.cartItems).toBeElementsArrayOfSize(newBadgeCount);
        for (const title of itemsTitles) {
            expect(await CartPage.getCartItemByTitle(title)).toBeDisplayed();
        }

        (await CartPage.checkoutButton).click();
        expect(CheckoutPage.chekoutForm).toBeDisplayed();
        //check inputs on the Checkout Page
        await CheckoutPage.setFirstName(testData.userCheckoutInfo.firstname);
        expect(CheckoutPage.firstNameInput).toHaveValue(testData.userCheckoutInfo.firstname);

        await CheckoutPage.setLastName(testData.userCheckoutInfo.lastname);
        expect(CheckoutPage.firstNameInput).toHaveValue(testData.userCheckoutInfo.lastname);

        await CheckoutPage.setPostalCode(testData.userCheckoutInfo.postalCode);
        expect(CheckoutPage.firstNameInput).toHaveValue(testData.userCheckoutInfo.postalCode);

        (await CheckoutPage.continueButton).click();
        expect(OverviewPage.overviewTitle).toBeDisplayed();
        expect(OverviewPage.cartItems).toBeElementsArrayOfSize(indexesToAdd.length);
        //check that on the Overview page all items that we added are present
        for (const title of itemsTitles) {
            expect(await OverviewPage.getItemByTitle(title)).toBeDisplayed();
        }
        const overviewTotalPrice = await OverviewPage.totalPrice();  
        expect(overviewTotalPrice).toEqual(totalPriceSum); 

        (await OverviewPage.finishButton).click();
        expect(CheckoutCompletePage.checkoutCompleteTitle).toBeDisplayed();
        expect(CheckoutCompletePage.thankOrderMessage).toBeDisplayed();
        //check that after creating order that in our cart are no items
        (await CheckoutCompletePage.backHomeButton).click();
        expect(InventoryPage.titleProducts).toBeDisplayed();
        expect(await HeaderSection.buttonBadge.isExisting()).toBe(false);
    });
    //This test has a bug, so he is disabled
    xit('Checkout without products', async () => {
        await expect(InventoryPage.titleProducts).toBeDisplayed();

        await HeaderSection.buttonShopCart.click();

        const cartItemsExist = await CartPage.cartItems.isExisting();
        await expect(cartItemsExist).toBe(false);

        await CartPage.checkoutButton.click();

        await expect(CartPage.cartTitle).toBeDisplayed();
        await expect(CartPage.messageCartIsEmpty).toBeDisplayed();

    });
});
    
