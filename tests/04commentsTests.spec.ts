import {test, expect} from '@playwright/test'
import { PageManager } from '../pageModels/pageManager'
import { TEST_COMMENT1, TESTUSER_1_NAME, TESTUSER_2_NAME} from './test data/testData';

test.use({ storageState: './.auth/user1.json' });
test.beforeEach(async({page})=>{
    const pm = new PageManager(page)
    // Arrange: Go to the main feed page and ensure the user is logged in
    await page.goto('/');
    await page.waitForTimeout(5000)
    await expect(pm.onFeedPage().openPostFormButton).toBeVisible();
})

test('add valid comment to own post', async({page})=>{
    const pm = new PageManager(page)
    await pm.onFeedPage().postFeedTitle("Post title 4").click()
    await expect(pm.onPostPage().postAuthor).toHaveText(TESTUSER_1_NAME)
    await pm.onPostPage().addComment(TEST_COMMENT1)
    await expect(pm.onPostPage().firstCommentBody).toContainText(TEST_COMMENT1)
    await expect(pm.onPostPage().postCommentCounter).toHaveText('= Думки 1 = ')
})


test('add valid comment to other user post', async({page})=>{
    const pm = new PageManager(page)
    await pm.onFeedPage().postFeedTitle("Post title 2").click()
    await expect(pm.onPostPage().postAuthor).toHaveText(TESTUSER_2_NAME)
    await pm.onPostPage().addComment(TEST_COMMENT1)
    await expect(pm.onPostPage().firstCommentBody).toContainText(TEST_COMMENT1)
    await expect(pm.onPostPage().postCommentCounter).toHaveText('= Думки 1 = ') 
})

// test('add empty comment', async({page})=>{

// })

// test('add max-length comment', async({page})=>{

// })

// test('check comment posting is not possible fro not logged user', async ({page})=>{

// })

// test('edit own comment', async({page})=>{

// })

// test('delete own domment', async({page})=>{
    
// })