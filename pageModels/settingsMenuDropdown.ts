import {type Locator, type Page} from '@playwright/test'

export class SettingMenuDropdown {
    readonly page: Page;
    readonly settingsMenuButton: Locator;
    readonly myProfileLink:Locator;
    readonly editProfleLink:Locator;
    readonly logoutLink:Locator;
    readonly aboutProjectLink:Locator;
    
    constructor(page:Page){
        this.page = page;
        this.settingsMenuButton = this.page.locator("#menu-button");
        this.myProfileLink = this.page.getByText("Мій профіль");
        this.editProfleLink = this.page.getByText("Редагувати профіль");
        this.logoutLink = this.page.getByText("Вихід");
        this.aboutProjectLink = this.page.getByText("Про Ґвару");
    }

    async goToEditAboutMePage(){
        await this.settingsMenuButton.click();
        await this.editProfleLink.click();
    }
}
