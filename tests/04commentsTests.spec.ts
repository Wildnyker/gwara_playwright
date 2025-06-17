import { test, expect } from '@playwright/test';
import { PageManager } from '../pageModels/pageManager';
import { TEST_COMMENT1, TESTUSER_1_NAME, TESTUSER_2_NAME, MAX_LENGTH_COMMENT } from './test data/testData';

test.use({ storageState: './.auth/user1.json' });

test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page);
    await page.goto('/');
    await expect(pm.onFeedPage().openPostFormButton).toBeVisible();
});

test('add valid comment to own post', async ({ page }) => {
    const pm = new PageManager(page);
    await pm.onFeedPage().postFeedTitle("Post title 4").click();
    await expect(pm.onPostPage().postAuthor).toHaveText(TESTUSER_1_NAME);
    await pm.onPostPage().addComment(TEST_COMMENT1);
    await expect(pm.onPostPage().firstCommentBody).toContainText(TEST_COMMENT1);
    await expect(pm.onPostPage().postCommentCounter).toHaveText('= Думки 1 = ');
});

test('add valid comment to other user post', async ({ page }) => {
    const pm = new PageManager(page);
    await pm.onFeedPage().postFeedTitle("Post title 2").click();
    await expect(pm.onPostPage().postAuthor).toHaveText(TESTUSER_2_NAME);
    await pm.onPostPage().addComment(TEST_COMMENT1);
    await expect(pm.onPostPage().firstCommentBody).toContainText(TEST_COMMENT1);
    await expect(pm.onPostPage().postCommentCounter).toHaveText('= Думки 1 = ');
});


test('add empty comment', async({page})=>{
    const pm = new PageManager(page)
    await pm.onFeedPage().postFeedTitle("Post title 2").click()
    await expect(pm.onPostPage().postAuthor).toHaveText(TESTUSER_2_NAME)
    await pm.onPostPage().addComment('')
    await expect(pm.onPostPage().firstCommentBody).toContainText(TEST_COMMENT1)
    await expect(pm.onPostPage().postCommentCounter).toHaveText('= Думки 1 = ')
})

test('add max-length comment', async({page})=>{
    const pm = new PageManager(page)
    await pm.onFeedPage().postFeedTitle("Post title 2").click()
    await expect(pm.onPostPage().postAuthor).toHaveText(TESTUSER_2_NAME)
    await pm.onPostPage().addComment(MAX_LENGTH_COMMENT)
    await expect(pm.onPostPage().firstCommentBody).toContainText(MAX_LENGTH_COMMENT)
    await expect(pm.onPostPage().postCommentCounter).toHaveText('= Думки 2 = ') 
})

test('check comment posting is not possible fro not logged user', async ({browser})=>{
    const context = await browser.newContext({ storageState: undefined });// no storageState here
    const page = await context.newPage();
    const pm = new PageManager(page)
    await page.goto('/');
    await pm.onFeedPage().postFeedTitle("Post title 1").click()
    await expect(pm.onPostPage().postAuthor).toHaveText(TESTUSER_1_NAME)
    await pm.onPostPage().addComment(TEST_COMMENT1)
    await expect(page.locator('h2')).toHaveText('Вхід в акаунт')
})


// test('edit own comment', async ({ page }) => {
// });

// test('delete own comment', async ({ page }) => {
// });
