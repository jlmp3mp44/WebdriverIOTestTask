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
        const usernameValue = await (await LoginPage.inputUsername).getValue();
        expect(usernameValue).toEqual(testData.validCredentials.username);

        await LoginPage.setPassword(testData.validCredentials.password);
        const passwordInputType = await (await LoginPage.inputPassword).getAttribute('type');
        expect(passwordInputType).toEqual('password');

        await (await LoginPage.btnSubmit).click();
        
        const titleText = await InventoryPage.titleProducts.getText(); 
        expect(titleText).toEqual(testData.titles.inventoryTitle);
        
    });

    it("Login with invalid password", async() => {
        await LoginPage.open();

        await LoginPage.setUsername(testData.validCredentials.username);
        const usernameValue = await (await LoginPage.inputUsername).getValue();
        expect(usernameValue).toEqual(testData.validCredentials.username);

        await LoginPage.setPassword(testData.invalidCredentials.password);
        const passwordInputType = await (await LoginPage.inputPassword).getAttribute('type');
        expect(passwordInputType).toEqual('password');

        await (await LoginPage.btnSubmit).click();

        expect(LoginPage.getUsernameErrorIcon).toBeDisplayed();
        expect(LoginPage.getPasswordErrorIcon).toBeDisplayed();
        await expect(LoginPage.errorMessage).toBeDisplayed()
        expect(await LoginPage.isPasswordFieldHighlighted()).toBe(true);
        expect(await LoginPage.isUsernameFieldHighlighted()).toBe(true);
        
    })

    it("Login with invalid login", async() => {
        await LoginPage.open();

        await LoginPage.setUsername(testData.invalidCredentials.username);
        const usernameValue = await (await LoginPage.inputUsername).getValue();
        expect(usernameValue).toEqual(testData.invalidCredentials.username);

        await LoginPage.setPassword(testData.validCredentials.password);
        const passwordInputType = await (await LoginPage.inputPassword).getAttribute('type');
        expect(passwordInputType).toEqual('password');

        await (await LoginPage.btnSubmit).click();

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
        expect(LoginPage).toBeDisplayed();
        
        expect(await LoginPage.inputUsername.getValue()).toEqual('');
        expect(await LoginPage.inputPassword.getValue()).toEqual('');
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
        expect(LoginPage).toBeDisplayed();


        expect(await LoginPage.inputUsername.getValue()).toEqual('');
        expect(await LoginPage.inputPassword.getValue()).toEqual('');

        await LoginPage.login(testData.validCredentials.username, testData.validCredentials.password);

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
    
        await (await InventoryPage.sortContainer).click();
    
        expect(InventoryPage.optionValuesSortContainer).toBeElementsArrayOfSize(4);
    
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
        await browser.switchWindow(testData.socialMedias.twitter);
        await expect(browser).toHaveUrl(testData.socialMedias.twitter);
        await expect(browser.$('//span[text() = "Sauce Labs"]')).toBeDisplayed();
        await browser.switchWindow(url);

        await FooterSection.facebookButton.click();
        await browser.switchWindow(testData.socialMedias.facebook);
        await expect(browser).toHaveUrl(testData.socialMedias.facebook);
        await expect(browser.$('//h1[text() = "Sauce Labs"]')).toBeDisplayed();
        await browser.switchWindow(url);

        await FooterSection.linkedinButton.click();
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
            console.log("Product price text:", productPriceText); // Debugging line
            const productPrice = parseFloat(productPriceText.replace('$', '').trim());  // Convert price text to number
            console.log("Parsed product price:", productPrice); // Debugging line
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
        expect(await (await CheckoutPage.firstNameInput).getValue()).toEqual(testData.userCheckoutInfo.firstname);

        await CheckoutPage.setLastName(testData.userCheckoutInfo.lastname);
        expect(await (await CheckoutPage.lastNameInput).getValue()).toEqual(testData.userCheckoutInfo.lastname);

        await CheckoutPage.setPostalCode(testData.userCheckoutInfo.postalCode);
        expect(await (await CheckoutPage.postalCodeInput).getValue()).toEqual(testData.userCheckoutInfo.postalCode);

        (await CheckoutPage.continueButton).click();

        expect(OverviewPage.overviewTitle).toBeDisplayed();

        expect(OverviewPage.cartItems).toBeElementsArrayOfSize(indexesToAdd.length);
        for (const title of productTitles) {
            expect(await OverviewPage.getItemByTitle(title)).toBeDisplayed();
        }

        const overviewTotalPrice = await OverviewPage.totalPrice();  // Call totalPrice function to get the total price from overview page
        console.log("Overview total price:", overviewTotalPrice); // Debugging line
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
    
