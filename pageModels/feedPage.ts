import {expect,type Locator,type Page} from '@playwright/test'
import { title } from 'process';

export class FeedPage{
    readonly page: Page;
    readonly openPostFormButton:Locator
    readonly titleField: Locator;
    readonly imageField:Locator;
    readonly postTextField: Locator;
    readonly postButton: Locator;
    readonly addPostError: Locator;
    readonly emptyPostsContainer: Locator;
    readonly settingsMenuButton:Locator;
    


    constructor(page:Page){
        this.page = page
        this.titleField = this.page.getByRole('textbox', { name: 'Чим хочеш поділитися?' });
        this.imageField = this.page.getByPlaceholder('URL зображення');
        this.postTextField = this.page.locator('#new-entry-text');
        this.postButton = this.page.getByRole('button', { name: 'Поділитися' });
        this.addPostError = this.page.locator('#new-entry-form-error');
        this.emptyPostsContainer = this.page.locator(".entries");
        this.openPostFormButton = this.page.locator("[alt='New']")
        
    }

    async addPost(title?:string, imageLink?:string, postText?:string){
        this.openPostFormButton.click()

        if(title){
            await this.titleField.fill(title);
        }
 
        if(imageLink){
            await this.imageField.fill(imageLink);
        }
        
        if(postText){
            await this.postTextField.fill(postText);
        }

        await this.postButton.click();
    }

    postFeedTitle(title:string):Locator{
        return this.page.getByRole('link', { name: title });
    }



   

}