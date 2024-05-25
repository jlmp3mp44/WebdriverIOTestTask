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
const { isAscending, isDescending, isAscendingPrice, isDescendingPrice } = require('../data/utils');


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
        expect(LoginPage.getUsernameErrorIcon).toBeDisplayed();
        expect(LoginPage.getPasswordErrorIcon).toBeDisplayed();
        await expect(LoginPage.errorMessage).toBeDisplayed()
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
        expect(LoginPage.getUsernameErrorIcon).toBeDisplayed();
        expect(LoginPage.getPasswordErrorIcon).toBeDisplayed();
        await expect(LoginPage.errorMessage).toBeDisplayed()
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
        expect(await LoginPage.inputUsername).toHaveValue('');
        expect(await LoginPage.inputPassword).toHaveValue('')
    });
    
    it('Saving the card after logout ', async () => {
        await expect(InventoryPage.titleProducts).toBeDisplayed();

        const indicesToAdd = [1, 2]; 
        const productTitles = [];
        const initialBadgeCount = await HeaderSection.getBadgeCount();
    
        for (const index of indicesToAdd) {
            await (await InventoryPage.buttonAddToCart(index)).click();
            const productTitle = await InventoryPage.getItemTitle(index);
            productTitles.push(await productTitle.getText());
        }
       
        const newBadgeCount = await HeaderSection.getBadgeCount();
        expect(newBadgeCount).toEqual(initialBadgeCount + indicesToAdd.length);

        await (await HeaderSection.buttonMenu).click();
        expect(HeaderSection.menuItems).toBeElementsArrayOfSize(4);

        (await HeaderSection.logoutButton).click();
        browser.pause(500);
        expect(LoginPage.btnSubmit).toBeDisplayed();
        expect(await LoginPage.inputUsername).toHaveValue('');
        expect(await LoginPage.inputPassword).toHaveValue('')

        await LoginPage.login(testData.validCredentials.username, testData.validCredentials.password);
        browser.pause(500);
        expect(InventoryPage.inventoryItem).toBeDisplayed();
        expect(HeaderSection.buttonShopCart).toBeDisplayed();

        await (await HeaderSection.buttonShopCart).click();
        expect(CartPage.cartItems).toBeElementsArrayOfSize(newBadgeCount);
        for (const title of productTitles) {
            expect(await CartPage.getCartItemByTitle(title)).toBeDisplayed();
        }

    });

    it('Sorting', async () => {
        await expect(InventoryPage.titleProducts).toBeDisplayed();
    
        (await InventoryPage.selectSortOption(testData.filters.az)).click();
        await browser.pause(500); 
        titles = await InventoryPage.getItemTitles();
        expect(isAscending(titles)).toBe(true);
    
        (await InventoryPage.selectSortOption(testData.filters.za)).click();
        await browser.pause(500); 
        titles = await InventoryPage.getItemTitles();
        expect(isDescending(titles)).toBe(true);
      
        (await InventoryPage.selectSortOption(testData.filters.lohi)).click();
        await browser.pause(500); 
        prices = await InventoryPage.getItemPrices();
        expect(isAscendingPrice(prices)).toBe(true);
    
        (await InventoryPage.selectSortOption(testData.filters.hilo)).click();
        await browser.pause(500); // Add a short pause to allow sorting to take effect
        prices = await InventoryPage.getItemPrices();
        expect(isDescendingPrice(prices)).toBe(true);
    });

    it('Footer Links', async() => {
        await expect(InventoryPage.titleProducts).toBeDisplayed();
        const url =  await browser.getUrl();

        await FooterSection.twitterButton.click();
        browser.pause(500);
        await browser.switchWindow(testData.socialMedias.twitter);
        await expect(browser).toHaveUrl(testData.socialMedias.twitter);
        await expect(browser.$('//span[text() = "Sauce Labs"]')).toBeDisplayed();
        await browser.switchWindow(url);

        await FooterSection.facebookButton.click();
        browser.pause(500);
        await browser.switchWindow(testData.socialMedias.facebook);
        await expect(browser).toHaveUrl(testData.socialMedias.facebook);
        await expect(browser.$('//h1[text() = "Sauce Labs"]')).toBeDisplayed();
        await browser.switchWindow(url);

        await FooterSection.linkedinButton.click();
        browser.pause(500);
        await browser.switchWindow(testData.socialMedias.linkedin);
        await expect(browser).toHaveUrl(testData.socialMedias.linkedin);
        //await expect(browser.$('//h1[text() = "Sauce Labs"]')).toBeExisting();
    })

    it('Valid Checkout', async () => {
        await expect(InventoryPage.titleProducts).toBeDisplayed();

        const indexesToAdd = [1]; 
        const productTitles = [];
        let totalPriceSum = 0;  // Initialize total price sum
    
        const initialBadgeCount = await HeaderSection.getBadgeCount();
    
        for (const index of indexesToAdd) {
            await (await InventoryPage.buttonAddToCart(index)).click();
            const productTitle = await InventoryPage.getItemTitle(index);
            productTitles.push(await productTitle.getText());
            const productPriceElement = await InventoryPage.getItemPrice(index);
            const productPriceText = await productPriceElement.getText();
            const productPrice = parseFloat(productPriceText.replace('$', '').trim());  // Convert price text to number
           
            totalPriceSum += productPrice;  // Sum the prices
        }
       
        const newBadgeCount = await HeaderSection.getBadgeCount();
        expect(newBadgeCount).toEqual(initialBadgeCount + indexesToAdd.length);

        await (await HeaderSection.buttonShopCart).click();
        expect(CartPage.cartItems).toBeElementsArrayOfSize(newBadgeCount);
        for (const title of productTitles) {
            expect(await CartPage.getCartItemByTitle(title)).toBeDisplayed();
        }

        (await CartPage.checkoutButton).click();
        expect(CheckoutPage.chekoutForm).toBeDisplayed();

        await CheckoutPage.setFirstName(testData.userCheckoutInfo.firstname);
        expect(CheckoutPage.firstNameInput).toHaveValue(testData.userCheckoutInfo.firstname);

        await CheckoutPage.setLastName(testData.userCheckoutInfo.lastname);
        expect(CheckoutPage.firstNameInput).toHaveValue(testData.userCheckoutInfo.lastname);

        await CheckoutPage.setPostalCode(testData.userCheckoutInfo.postalCode);
        expect(CheckoutPage.firstNameInput).toHaveValue(testData.userCheckoutInfo.postalCode);

        (await CheckoutPage.continueButton).click();
        expect(OverviewPage.overviewTitle).toBeDisplayed();
        expect(OverviewPage.cartItems).toBeElementsArrayOfSize(indexesToAdd.length);
        for (const title of productTitles) {
            expect(await OverviewPage.getItemByTitle(title)).toBeDisplayed();
        }
        const overviewTotalPrice = await OverviewPage.totalPrice();  // Call totalPrice function to get the total price from overview page
        expect(overviewTotalPrice).toEqual(totalPriceSum);  // Compare total prices

        (await OverviewPage.finishButton).click();
        expect(CheckoutCompletePage.checkoutCompleteTitle).toBeDisplayed();
        expect(CheckoutCompletePage.thankOrderMessage).toBeDisplayed();

        (await CheckoutCompletePage.backHomeButton).click();
        expect(InventoryPage.titleProducts).toBeDisplayed();
        expect(await HeaderSection.buttonBadge.isExisting()).toBe(false);
    });

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
    
