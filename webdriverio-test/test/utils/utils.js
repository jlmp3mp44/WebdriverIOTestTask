
function isSorted(arr, compareFn) {
    for (let i = 1; i < arr.length; i++) {
        if (compareFn(arr[i - 1], arr[i]) > 0) {
            return false;
        }
    }
    return true;
}

function isAscending(arr) {
    return isSorted(arr, (a, b) => a.localeCompare(b));
}

function isDescending(arr) {
    return isSorted(arr, (a, b) => b.localeCompare(a));
}

function isAscendingPrice(arr) {
    return isSorted(arr, (a, b) => a - b);
}

function isDescendingPrice(arr) {
    return isSorted(arr, (a, b) => b - a);
}

async function checkSocialMedia(button, expectedUrl, expectedElementSelector) {
    await button.click();
    await browser.pause(500);
    await browser.switchWindow(expectedUrl);
    await expect(browser).toHaveUrl(expectedUrl);
    await expect(browser.$(expectedElementSelector)).toBeDisplayed();
    await browser.switchWindow("");  // Switch back to the original window
}


module.exports = {
    isAscending,
    isDescending,
    isAscendingPrice,
    isDescendingPrice,
    checkSocialMedia
};
