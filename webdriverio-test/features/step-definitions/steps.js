const{Given, When, Then} =  require('@wdio/cucumber-framework');

const loginPage  =  require('../../test/pageobjects/login.page');

const pages = {
    login: loginPage,

}

Given(/^I`m located on the login page of saucedemo website$/, async () => {
    await pages['login'].open();
    await browser.pause(500);
});

When(/^I click Login button$/, async () => {
    await (await loginPage.btnSubmit).click();
    await browser.pause(500);
});

Then(/^I should see (.+) error message$/, async (message) => {
    await expect(loginPage.usernameIsRequiredMessage).toBeDisplayed();
    await expect(loginPage.usernameIsRequiredMessage).toHaveText(message);
});
