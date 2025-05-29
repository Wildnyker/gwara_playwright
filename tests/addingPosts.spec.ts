import {test, expect} from '@playwright/test'
import { FeedPage } from '../pageModels/feedPage';
import { PostPage } from '../pageModels/postPage';

test.beforeEach(async({page})=>{
    await page.goto('/')
    await expect(page.getByRole('button', {name:"Поділитися"})).toBeVisible();
})


test('Add a valid post with title only', async({page})=>{
    const feedPage = new FeedPage(page);
    const postPage = new PostPage(page);
    await feedPage.addPost("Test title 1")
    await expect(postPage.postTitle, "Title has expected text").toHaveText('Test title 1')
})

test('Add a valid post with title + body', async({page})=>{
    const feedPage = new FeedPage(page);
    const postPage = new PostPage(page);
    await feedPage.addPost("Test title 2", undefined, "Test Body")
    await expect(postPage.postTitle, "Title has expected text").toHaveText('Test title 2')
    await expect(postPage.postBody, "Body has expected text").toHaveText('Test Body')
 
})


test('Add a valid post with title + body + image', async({page})=>{
    const feedPage = new FeedPage(page);
    const postPage = new PostPage(page);
    await feedPage.addPost("Test title 3", "https://clipart-library.com/data_images/320464.png","Test Body 2")
    await expect(postPage.postTitle, "Title has expected text").toHaveText('Test title 3')
    await expect(postPage.postImage, "Image is visible").toBeVisible()
    await expect(postPage.postImage, "Image has expected src").toHaveAttribute('src', 'https://clipart-library.com/data_images/320464.png');
    await expect(postPage.postBody,"Body has expected text").toHaveText('Test Body 2')
})