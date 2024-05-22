const { expect } = require('@wdio/globals')
const LoginPage = require('../pageobjects/login.page')
const InventoryPage =  require('../pageobjects/inventory.page')
const testData =  require('../data/testData')
const HeaderSection = require('../sections/headerSection');
const CartPage =  require('../pageobjects/cart.page');
const FooterSection = require('../sections/footerSection');


describe('Authorization', () => {
    it('Should login with valid credentials', async () => {
        await LoginPage.open();

        await LoginPage.setUsername(testData.validCredentials.username);
        const usernameValue = await (await LoginPage.inputUsername).getValue();
        expect(usernameValue).toEqual(testData.validCredentials.username);

        await LoginPage.setPassword(testData.validCredentials.password);
        const passwordInputType = await (await LoginPage.inputPassword).getAttribute('type');
        expect(passwordInputType).toEqual('password');

        await (await LoginPage.btnSubmit).click();
        
        const titleText = await InventoryPage.gettitleProductsText(); 
        expect(titleText).toEqual(testData.titles.inventoryTitle);
        
    });

    it("Shouldn`t login with invalid password", async() => {
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
        expect(LoginPage.isPasswordFieldHighlighted).toBeTruthy();
        expect(LoginPage.isUsernameFieldHighlighted).toBeTruthy();
        
    })

    it("Shouldn`t login with invalid login", async() => {
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
        expect(LoginPage.isPasswordFieldHighlighted).toBeTruthy();
        expect(LoginPage.isUsernameFieldHighlighted).toBeTruthy();
        
    })
});

describe('Work with cards', () => {
    beforeEach(async () => {
        await LoginPage.open();
        await LoginPage.login(testData.validCredentials.username, testData.validCredentials.password);
    });

    it('Should logout', async () => {

        expect(InventoryPage).toBeDisplayed();
        
        await (await HeaderSection.buttonMenu).click();
        expect(HeaderSection.menuItems).toBeElementsArrayOfSize(4);
        await (await HeaderSection.getLogoutButton()).click();
        expect(LoginPage).toBeDisplayed();
        
        // Add assertions to ensure the username and password fields are empty after logout
        expect(await LoginPage.inputUsername.getValue()).toEqual('');
        expect(await LoginPage.inputPassword.getValue()).toEqual('');
    });
    
    it('Should save cart after logout', async () => {
        expect(InventoryPage).toBeDisplayed();

        const indicesToAdd = [1, 2, 3]; 
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
        await (await HeaderSection.getLogoutButton()).click();
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

    it('Should sorting products', async () => {
    expect(InventoryPage).toBeDisplayed();

    const sortContainer = await InventoryPage.sortContainer;
    expect(sortContainer).toBeClickable();
    await sortContainer.click(); // Attempt to click on the sort container

    expect(InventoryPage.optionValuesSortContainer).toBeElementsArrayOfSize(4);

    const value = 'az'; // Define the value you want to pass
    const azOption = await InventoryPage.specificOptionElement(value);
    azOption.click();
    expect(await InventoryPage.compareProductItemTitlesInOrder()).toBeTruthy(); // Ensure to await the result of compareProductItemTitlesInOrder()
});

    it('Should redirect to  company`s social medias', async() => {
        expect(InventoryPage).toBeDisplayed();

        const url =  await browser.getUrl();
        await FooterSection.twitterButton.click();
        await browser.switchWindow(testData.socialMedias.twitter);
        await expect(browser).toHaveUrl(testData.socialMedias.twitter);
        await browser.switchWindow(url);

        await FooterSection.facebookButton.click();
        await browser.switchWindow(testData.socialMedias.facebook);
        await expect(browser).toHaveUrl(testData.socialMedias.facebook);
        await browser.switchWindow(url);

        await FooterSection.linkedinButton.click();
        await browser.switchWindow(testData.socialMedias.linkedin);
        await expect(browser).toHaveUrl(testData.socialMedias.linkedin);
        

    })

    
});