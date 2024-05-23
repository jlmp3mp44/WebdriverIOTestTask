const { expect } = require('@wdio/globals')
const LoginPage = require('../pageobjects/login.page')
const InventoryPage =  require('../pageobjects/inventory.page')
const testData =  require('../data/testData')
const HeaderSection = require('../sections/headerSection');
const CartPage =  require('../pageobjects/cart.page');
const FooterSection = require('../sections/footerSection');
const CheckoutPage =  require('../pageobjects/checkout.page')
const OverviewPage =  require('../pageobjects/overview.page');

// Function to check if an array is sorted in ascending order
// Function to check if an array of strings is sorted in ascending order
function isAscending(arr) {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1].localeCompare(arr[i]) > 0) {
        return false;
      }
    }
    return true;
  }

  function isAscendingPrice(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1] > arr[i]) {
            return false;
        }
    }
    return true;
}
  
  function isDescending(arr) {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i - 1].localeCompare(arr[i]) < 0) {
        return false;
      }
    }
    return true;
  }
  function isDescendingPrice(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i - 1] < arr[i]) {
            return false;
        }
    }
    return true;
}




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

    xit('Should logout', async () => {

        expect(InventoryPage).toBeDisplayed();
        
        await (await HeaderSection.buttonMenu).click();
        expect(HeaderSection.menuItems).toBeElementsArrayOfSize(4);
        await (await HeaderSection.getLogoutButton()).click();
        expect(LoginPage).toBeDisplayed();
        
        // Add assertions to ensure the username and password fields are empty after logout
        expect(await LoginPage.inputUsername.getValue()).toEqual('');
        expect(await LoginPage.inputPassword.getValue()).toEqual('');
    });
    
    xit('Should save cart after logout', async () => {
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

    xit('Should sort products', async () => {
        // Ensure the inventory page is displayed
        expect(InventoryPage).toBeDisplayed();
    
        // Wait for the sort container to be clickable and then click on it
        const sortContainer = await InventoryPage.sortContainer;
        await sortContainer.waitForClickable();
        await sortContainer.click();
    
        // Ensure the sort options are displayed
        expect(InventoryPage.optionValuesSortContainer).toBeElementsArrayOfSize(4);
    
        // Select the "A-Z" sort option and verify the titles are in ascending order
        const azOption = await InventoryPage.selectSortOption(testData.filters.az);
        await azOption.click();
        await browser.pause(500); // Add a short pause to allow sorting to take effect
        titles = await InventoryPage.getItemTitles();
        expect(isAscending(titles)).toBeTruthy();
    
    
        // Select the "Z-A" sort option and verify the titles are in descending order
        const zaOption = await InventoryPage.selectSortOption(testData.filters.za);
        await zaOption.click();
        await browser.pause(500); // Add a short pause to allow sorting to take effect
        titles = await InventoryPage.getItemTitles();
        expect(isDescending(titles)).toBeTruthy();
      

        const lowHiOption = await InventoryPage.selectSortOption(testData.filters.lohi);
        await lowHiOption.click();
        await browser.pause(500); // Add a short pause to allow sorting to take effect
        prices = await InventoryPage.getItemPrices();
        expect(isAscendingPrice(prices)).toBeTruthy();
    

        const hiLoOption = await InventoryPage.selectSortOption(testData.filters.hilo);
        await hiLoOption.click();
        await browser.pause(500); // Add a short pause to allow sorting to take effect
        prices = await InventoryPage.getItemPrices();
        expect(isDescendingPrice(prices)).toBeTruthy();
      
        
    });
    

    xit('Should redirect to  company`s social medias', async() => {
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

    it('Should check that checkout is valid', async () => {
        expect(InventoryPage).toBeDisplayed();

        const indexesToAdd = [5]; 
        const productTitles = [];
        let totalPriceSum = 0;  // Initialize total price sum
    
        const initialBadgeCount = await HeaderSection.getBadgeCount();
    
        for (const index of indexesToAdd) {
            console.log("INDEXINDEXINDEXINDEXNINDEX" + index);
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
    });
});
    
