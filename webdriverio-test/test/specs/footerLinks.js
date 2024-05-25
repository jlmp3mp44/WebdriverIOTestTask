async function checkSocialMedia(button, expectedUrl, expectedElementSelector) {
    await button.click();
    await browser.pause(500);
    await browser.switchWindow(expectedUrl);
    await expect(browser).toHaveUrl(expectedUrl);
    await expect(browser.$(expectedElementSelector)).toBeDisplayed();
    await browser.switchWindow("");  // Switch back to the original window
}

module.exports = {
    checkSocialMedia
};


