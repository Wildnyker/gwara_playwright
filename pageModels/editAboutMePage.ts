import {type Locator, type Page} from '@playwright/test'


export class EditAboutMePage{
    readonly page: Page;
    readonly editAboutMePageHeader: Locator;
    readonly aboutMeTextbox: Locator;
    readonly aboutMePlaceholder: Locator;
    readonly confirmChangesButton: Locator;
    constructor(page:Page){
        this.page = page
        this.editAboutMePageHeader = this.page.getByRole('heading',{name:/Редагувати сторінку користувача/i});
        this.aboutMeTextbox = this.page.getByPlaceholder('Про мене');
        this.aboutMePlaceholder = this.page.getByPlaceholder('Про мене');
        this.confirmChangesButton = this.page.getByRole('button', {name:'Підтвердити зміни'});
    }

    async submitChangesAboutMe(aboutMeDescription?:string){
        if (aboutMeDescription){
            await this.aboutMeTextbox.fill(aboutMeDescription);
            await this.confirmChangesButton.click();
        }
        else{
            await this.confirmChangesButton.click();
        }
    }


}
