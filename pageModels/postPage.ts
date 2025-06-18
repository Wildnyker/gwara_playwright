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
    readonly postCommentDropdownMenu:Locator;
    readonly postCommentEditButton:Locator;
    readonly postCommentDeleteButton:Locator;
    readonly commentDeletionPopupTitle:Locator;
    readonly commentDeletionPopupYes:Locator;
    readonly commentDeletionPopupNo:Locator;
    readonly commentEditField: Locator;
    readonly commentEditConfirmButton: Locator;
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
        this.firstCommentBody = this.page.locator('.entry-text').nth(1)
        this.postCommentDropdownMenu = this.page.locator('#post-comment-menu')
        this.postCommentDeleteButton = this.page.getByText('Видалити')
        this.postCommentEditButton = this.page.locator('.dropdown-item.edit-button')
        this.commentDeletionPopupNo = this.page.getByText('No')
        this.commentDeletionPopupYes = this.page.getByText('Yes')
        this.commentDeletionPopupTitle = this.page.getByText('Are you sure you want to delete this?')
        this.commentEditField = this.page.locator("#edit-field-1")
        this.commentEditConfirmButton = this.page.getByText("Зберегти")
        this.postCommentCounter = this.page.getByRole('heading', {level:6})
        this.postEditButton = this.page.getByRole('button', {name:'Виправити'});
        this.postDeleteButton = this.page.getByRole('button', {name:'Прибрати'});
        this.confirmPostDeletionButton = this.page.getByRole('button', { name: 'Так,прибрати' })
        this.cancelPostDeletionButton = this.page.getByRole('button', { name: 'Ні, назад' })
        this.deletionConfirmationPopupTitle = this.page.locator(".entry h4", {hasText:"Ви впевнені, що хочете прибрати цей допис?"})
        this.postDeletedTag = this.page.getByText('//прибрано//')
    }

    async verifyCorrectPostIsOpened(title:string, author:string){
        await expect(this.postCommentButton, "Check that post page is opened").toBeVisible()
        await expect(this.postTitle, 'Check that correct post title is shown').toHaveText(title)
        await expect(this.postAuthor, 'Check that correct post author is shown').toHaveText(author)                
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

    async deleteFirstComment(){
        await this.postCommentDropdownMenu.click()
        await this.postCommentDeleteButton.click()
        await this.commentDeletionPopupYes.click()
    }

    async editFirstComment(changedCommentText:string){
        await this.postCommentDropdownMenu.click()
        await this.postCommentEditButton.click()
        await this.commentEditField.clear()
        await this.commentEditField.fill(changedCommentText)
        await this.commentEditConfirmButton.click()
    }
}