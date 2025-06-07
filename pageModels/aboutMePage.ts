import {type Locator, type Page} from '@playwright/test'

export class AboutMePage {
    readonly page: Page;
    readonly aboutMeDescription:Locator;
    readonly editAboutMePageHeader: Locator;

    constructor(page:Page){
        this.page = page;
        this.aboutMeDescription =this.page.getByRole('heading',{name:/Сторінка/i});
    }
}