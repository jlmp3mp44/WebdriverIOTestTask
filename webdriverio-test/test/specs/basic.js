const { expect } = require('@wdio/globals')
const LoginPage = require('../pageobjects/login.page')
const InventoryPage =  require('../pageobjects/inventory.page')
const testData =  require('../data/testData')
const HeaderSection = require('../sections/headerSection');
const CartPage =  require('../pageobjects/cart.page');
const footerSection = require('../sections/footerSection');


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
    it('Should save card after logout', async () => {
        expect(InventoryPage).toBeDisplayed();
    
        const numOfBadge = await HeaderSection.getBadgeCount();
    
        (await InventoryPage.buttonAddToCart).click(); // Corrected this line
        const newBadgeCount = await HeaderSection.getBadgeCount();
        expect(newBadgeCount).toEqual(numOfBadge + 1);

        (await HeaderSection.buttonShopCart).click();
        expect(CartPage.cartItem).toBeElementsArrayOfSize(newBadgeCount);

        await (await HeaderSection.buttonMenu).click();
        expect(HeaderSection.menuItems).toBeElementsArrayOfSize(4);
        await (await HeaderSection.getLogoutButton()).click();
        expect(LoginPage).toBeDisplayed();


        expect(await LoginPage.inputUsername.getValue()).toEqual('');
        expect(await LoginPage.inputPassword.getValue()).toEqual('');

        await LoginPage.login(testData.validCredentials.username, testData.validCredentials.password);

        expect(InventoryPage.inventoryItem).toBeDisplayed();
        expect(HeaderSection.buttonShopCart).toBeDisplayed();

        (await HeaderSection.buttonShopCart).click();
        expect(CartPage.cartItem).toBeElementsArrayOfSize(newBadgeCount);

    });

    it('Should sorting products', async () => {
    expect(InventoryPage).toBeDisplayed();

    const sortContainer = await InventoryPage.sortContainer;
    expect(sortContainer).toBeClickable();
    console.log('Sort container:', sortContainer); // Log the sort container element

    await sortContainer.waitForClickable(); // Wait for the sort container to become clickable
    await sortContainer.click(); // Attempt to click on the sort container

    expect(InventoryPage.optionValuesSortContainer).toBeElementsArrayOfSize(4);

    const value = 'az'; // Define the value you want to pass
    const azOption = await InventoryPage.specificOptionElement(value);
    azOption.click();
    expect(await InventoryPage.compareProductItemTitlesInOrder()).toBeTruthy(); // Ensure to await the result of compareProductItemTitlesInOrder()
});

    it('Should redirect to  company`s social medias', async() => {
        expect(InventoryPage).toBeDisplayed();
        await footerSection.twitterButton.click();
        await expect(browser.getUrl).toBe('https://x.com/saucelabs');
        
    })

    
});