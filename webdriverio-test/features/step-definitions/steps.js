const { Given, When, Then } = require("@wdio/cucumber-framework");
const loginPage = require("../../test/pageobjects/login.page");

Given(/^I'm located on the login page of saucedemo website$/, async () => {
    await loginPage.open();
});

When(/^I click "(.+)" button$/, async (buttonText) => {
    await loginPage.clickButtonByText(buttonText);
});

Then(/^I should see "(.+)" error message$/, async (message) => {
    const errorMessage = await loginPage.getMessageByText(message);
    await expect(errorMessage).toBeDisplayed();
    await expect(errorMessage).toHaveText(message);
});


