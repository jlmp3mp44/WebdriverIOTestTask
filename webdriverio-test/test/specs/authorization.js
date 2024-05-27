const { expect } = require('@wdio/globals')
const loginPage = require('../pageobjects/login.page')
const inventoryPage =  require('../pageobjects/inventory.page')
const testData =  require('../data/testData')


describe('Authorization', () => {
    it('Valid login', async () => {
        await loginPage.open();

        await loginPage.setUsername(testData.validCredentials.username);
        expect(loginPage.inputUsername).toHaveValue(testData.validCredentials.username);

        await loginPage.setPassword(testData.validCredentials.password);
        await expect(loginPage.inputPassword).toHaveAttribute('type', 'password');

        await loginPage.submit();
        expect(inventoryPage.titleProducts).toHaveText(testData.titles.inventoryTitle);
        
    });

    it("Login with invalid password", async() => {
        await loginPage.open();

        await loginPage.setUsername(testData.validCredentials.username);
        expect(loginPage.inputUsername).toHaveValue(testData.validCredentials.username);

        await loginPage.setPassword(testData.invalidCredentials.password);
        await expect(loginPage.inputPassword).toHaveAttribute('type', 'password');

        await loginPage.submit();
        //check that error icons are present
        expect(loginPage.getUsernameErrorIcon).toBeDisplayed(); 
        expect(loginPage.getPasswordErrorIcon).toBeDisplayed();
        await expect(loginPage.errorMessage).toBeDisplayed()
        //check that fields are highlighted with red
        expect(await loginPage.isPasswordFieldHighlighted()).toBe(true);
        expect(await loginPage.isUsernameFieldHighlighted()).toBe(true);
        
    })

    it("Login with invalid login", async() => {
        await loginPage.open();

        await loginPage.setUsername(testData.invalidCredentials.username);
        expect(loginPage.inputUsername).toHaveValue(testData.invalidCredentials.username);

        await loginPage.setPassword(testData.validCredentials.password);
        await expect(loginPage.inputPassword).toHaveAttribute('type', 'password');

        await loginPage.submit();
        //check that error icons are present
        expect(loginPage.getUsernameErrorIcon).toBeDisplayed();
        expect(loginPage.getPasswordErrorIcon).toBeDisplayed();
        await expect(loginPage.errorMessage).toBeDisplayed()
        //check that fields are highlighted with red
        expect(await loginPage.isPasswordFieldHighlighted()).toBe(true);
        expect(await loginPage.isUsernameFieldHighlighted()).toBe(true);
        
    })
});