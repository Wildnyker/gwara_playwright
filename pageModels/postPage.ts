import { th } from '@faker-js/faker';
import {expect,type Locator,type Page} from '@playwright/test'

export class PostPage{
    readonly page: Page
    readonly postTitle:Locator;
    readonly postImage:Locator;
    readonly postBody:Locator;
    readonly postCommentButton:Locator
    constructor(page:Page){
        this.page = page;
        this.postTitle = this.page.locator('.entry-title');
        this.postImage = this.page.locator('.entry-image');
        this.postBody = this.page.locator('//p[@class="entry-text"]/following-sibling::p[1]');
        this.postCommentButton = this.page.getByRole('button', { name: 'Висловитись' });
    }

}