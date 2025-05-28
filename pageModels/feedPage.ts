import {expect,type Locator,type Page} from '@playwright/test'

export class FeedPage{
    readonly page: Page;
    readonly titleField: Locator;
    readonly imageField:Locator;
    readonly postTextField: Locator;
    readonly shareButton: Locator;
    constructor(page:Page){
        this.page = page
        this.titleField = page.getByRole('textbox', { name: 'Чим хочеш поділитися?' })
        this.imageField = page.getByPlaceholder('URL зображення')
        this.postTextField = page.locator('#new-entry-text')
        this.shareButton = page.getByRole('button', { name: 'Поділитися' })
    }

    async addPost(title?:string, imageLink?:string, postText?:string){
        if(title){
            await this.titleField.fill(title);
        }
 
        if(imageLink){
            await this.imageField.fill(imageLink);
        }
        
        if(postText){
            await this.postTextField.fill(postText);
        }

        await this.shareButton.click()
    }

}