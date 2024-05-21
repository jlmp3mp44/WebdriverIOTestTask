class HeaderSection {
    get buttonMenu(){
        return $('[id*="menu-btn"]');
    }

    get menuItems(){
        return $$('[class*="menu-item"]');
    }

    get buttonShopCart(){
        return $('[class*= "shopping_cart_link"]');
    }

    get buttonBadge(){
        return $('[class="shopping_cart_badge"]');
    }

    async getBadgeCount() {
        const badgeElement = await this.buttonBadge;
        if (await badgeElement.isDisplayed()) {
            return parseInt(await badgeElement.getText(), 10); // Convert text to number
        }
        return 0;
    }

    open () {
        return browser.url('inventory.html') ;
    }

    async getLogoutButton() {
        const menuItems = await this.menuItems;
        
        for (const item of menuItems) {
            const text = await item.getText();
            if (text === 'Logout') {
                return item;
            }
        }
    
        return null; 
    }
    
}

module.exports = new HeaderSection();
