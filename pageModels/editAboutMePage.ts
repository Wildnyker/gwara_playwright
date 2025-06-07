import {type Locator, type Page} from '@playwright/test'


export class EditAboutMePage{
    readonly page: Page;
    readonly editAboutMePageHeader: Locator;
    readonly aboutMeTextbox: Locator;
    readonly confirmChangesButton: Locator;
    constructor(page:Page){
        this.page = page
        this.editAboutMePageHeader = this.page.getByRole('heading',{name:/Редагувати сторінку користувача/i});
        this.aboutMeTextbox = this.page.getByPlaceholder('Про мене');
        this.confirmChangesButton = this.page.getByRole('button', {name:'Підтвердити зміни'});
    }

    async submitChangesAboutMe(aboutMeDescription:string){
        this.aboutMeTextbox.fill(aboutMeDescription);
        this.confirmChangesButton.click();
    }
}
