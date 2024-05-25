
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

function checkSocialMedia(button, expectedUrl, expectedElementSelector) {
    button.click();
    browser.pause(500);
    browser.switchWindow(expectedUrl);
    expect(browser).toHaveUrl(expectedUrl);
    expect(browser.$(expectedElementSelector)).toBeDisplayed();
    browser.switchWindow("");
}

module.exports = {
    isAscending,
    isDescending,
    isAscendingPrice,
    isDescendingPrice,
    checkSocialMedia
};
