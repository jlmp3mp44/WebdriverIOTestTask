const { Given, When, Then } = require("@wdio/cucumber-framework");
const loginPage = require("../../test/pageobjects/login.page");

pages = {
  login: loginPage,
};

Given(
  /^I'm located on the "(.+)" page of saucedemo website$/,
  async (pageName) => {
    const page = pages[pageName];
    await page.open();
  }
);

When(/^I click "(.+)" button$/, async (buttonText) => {
  await loginPage.clickButtonByText(buttonText);
});

Then(/^I should see "(.+)" error message$/, async (message) => {
  const errorMessage = await loginPage.getMessageByText(message);
  await expect(errorMessage).toBeDisplayed();
  await expect(errorMessage).toHaveText(message);
});
