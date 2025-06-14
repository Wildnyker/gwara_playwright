import { th } from '@faker-js/faker';
import {expect,type Locator,type Page} from '@playwright/test'

export class PostPage{
    readonly page: Page
    readonly postAuthor:Locator;
    readonly postTitle:Locator;
    readonly postImage:Locator;
    readonly postBody:Locator;
    readonly postCommentButton:Locator;
    readonly postCommentTextArea:Locator;
    readonly postCommentCounter:Locator;
    readonly firstCommentBody:Locator;
    readonly postEditButton:Locator;
    readonly postDeleteButton:Locator;
    readonly deletionConfirmationPopupTitle:Locator;
    readonly confirmPostDeletionButton: Locator;
    readonly cancelPostDeletionButton: Locator; 
    readonly postDeletedTag: Locator;
    constructor(page:Page){
        this.page = page;
        this.postAuthor = this.page.locator('.author-name')
        this.postTitle = this.page.locator('.entry-title');
        this.postImage = this.page.locator('.entry-image');
        this.postBody = this.page.locator('//p[@class="entry-text"]/following-sibling::p[1]');
        this.postCommentTextArea = this.page.locator('#comment_field');
        this.postCommentButton = this.page.getByRole('button', { name: 'Висловитись' });
        this.firstCommentBody = this.page.locator('.entry')
        this.postCommentCounter = this.page.getByRole('heading', {level:6})
        this.postEditButton = this.page.getByRole('button', {name:'Виправити'});
        this.postDeleteButton = this.page.getByRole('button', {name:'Прибрати'});
        this.confirmPostDeletionButton = this.page.getByRole('button', { name: 'Так,прибрати' })
        this.cancelPostDeletionButton = this.page.getByRole('button', { name: 'Ні, назад' })
        this.deletionConfirmationPopupTitle = this.page.locator(".entry h4", {hasText:"Ви впевнені, що хочете прибрати цей допис?"})
        this.postDeletedTag = this.page.getByText('//прибрано//')
    }

    async verifyCorrectPostIsOpened(title:string){
        await expect(this.postCommentButton, "Check that post page is opened").toBeVisible()
        await expect(this.postTitle, 'Check that correct post title is shown').toHaveText(title)                
    }

    async clickDeletePostButton(){
        await this.postDeleteButton.click()
        await expect(this.deletionConfirmationPopupTitle, "Check that deletion popup is opened").toBeVisible()     
    }
    async confirmPostDeletion(){
        await this.confirmPostDeletionButton.click()
        await expect(this.postDeletedTag, "Check that post is marked as deleted").toBeVisible()
        await this.page.goto('/')
    }

    async addComment(commentText:string){
        await this.postCommentTextArea.fill(commentText)      
        await this.postCommentButton.click()
    }
}