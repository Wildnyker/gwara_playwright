import { test, expect } from '@playwright/test';
import { PageManager } from '../pageModels/pageManager';
import { TEST_COMMENT1, TEST_COMMENT2, TESTUSER_1_NAME, TESTUSER_2_NAME, MAX_LENGTH_COMMENT } from './test data/testData';


test.describe('Authenticated user comment tests', ()=>{
    test.use({ storageState: './.auth/user1.json' });
    
    test.beforeEach(async ({ page }) => {
        // Arrange: Navigate to main page and check post form is visible
        const pm = new PageManager(page);
        await page.goto('/');
        await expect(pm.onFeedPage().openPostFormButton).toBeVisible();
    });

    test('add valid comment to own post', async ({ page }) => {
        // Arrange
        const pm = new PageManager(page);
        await pm.onFeedPage().postFeedTitle("Post title 4").click();
        
        // Assert precondition
        await expect(pm.onPostPage().postAuthor).toHaveText(TESTUSER_1_NAME);
        
        // Act
        await pm.onPostPage().addComment(TEST_COMMENT1);
        
        // Assert
        await expect(pm.onPostPage().firstCommentBody).toContainText(TEST_COMMENT1);
        await expect(pm.onPostPage().postCommentCounter).toHaveText('= Думки 1 = ');
    });

    test('add valid comment to other user post', async ({ page }) => {
        //Arrange
        const pm = new PageManager(page);
            await pm.onFeedPage().postFeedTitle("Post title 2").click();
        await expect(pm.onPostPage().postAuthor).toHaveText(TESTUSER_2_NAME);
        
        //Act
        await pm.onPostPage().addComment(TEST_COMMENT1);
        
        //Assert
        await expect(pm.onPostPage().firstCommentBody).toContainText(TEST_COMMENT1);
        await expect(pm.onPostPage().postCommentCounter).toHaveText('= Думки 1 = ');
    });


    test('empty comment is not added; existing comment stays first', async({page})=>{
        //Arrange
        const pm = new PageManager(page);
        await pm.onFeedPage().postFeedTitle("Post title 2").click();
        await pm.onPostPage().verifyCorrectPostIsOpened("Post title 2", TESTUSER_2_NAME);
        await expect(pm.onPostPage().postAuthor).toHaveText(TESTUSER_2_NAME);
        
        //Act
        await pm.onPostPage().addComment('')
        
        //Assert: empty comment is ignored, first existing comment remains unchanged
        await expect(pm.onPostPage().firstCommentBody).toContainText(TEST_COMMENT1);
        await expect(pm.onPostPage().postCommentCounter).toHaveText('= Думки 1 = ');
    })

    test('add max-length comment', async({page})=>{
        //Arrange
        const pm = new PageManager(page);
        await pm.onFeedPage().postFeedTitle("Post title 2").click();
        await pm.onPostPage().verifyCorrectPostIsOpened("Post title 2", TESTUSER_2_NAME);
        
        //Act
        await pm.onPostPage().addComment(MAX_LENGTH_COMMENT);
        
        //Assert
        await expect(pm.onPostPage().firstCommentBody).toContainText(MAX_LENGTH_COMMENT);
        await expect(pm.onPostPage().postCommentCounter).toHaveText('= Думки 2 = ');
    })

    test('edit own comment ', async ({ page }) => {
        //Arrange
        const pm = new PageManager(page);
        await pm.onFeedPage().postFeedTitle("Post title 4").click();
        await pm.onPostPage().verifyCorrectPostIsOpened("Post title 4", TESTUSER_1_NAME);
        
        //Act
        await pm.onPostPage().editFirstComment(TEST_COMMENT2);
        
        //Assert
        await expect(pm.onPostPage().firstCommentBody).toContainText(TEST_COMMENT2);
        await expect(pm.onPostPage().postCommentCounter).toHaveText('= Думки 1 = ');
    });

    test('delete own comment under own post', async ({ page }) => {
        //Arrange
        const pm = new PageManager(page);
        await pm.onFeedPage().postFeedTitle("Post title 4").click();
        await pm.onPostPage().verifyCorrectPostIsOpened("Post title 4", TESTUSER_1_NAME);
        
        //Act
        await pm.onPostPage().deleteFirstComment();
        
        //Assert
        await expect(pm.onPostPage().firstCommentBody).toHaveCount(0);
        await expect(pm.onPostPage().postCommentCounter).toHaveText('= Думки = ');
    });
});

test.describe('Anonymous user tests', () => {
  test.use({ storageState: undefined });

  test('check comment posting is not possible for not logged user', async ({ browser }) => {
    //Arrange
    const context = await browser.newContext(); // disables inherited storage
    await context.clearCookies();
    const page = await context.newPage();
    const pm = new PageManager(page);
    await page.goto('/');
    await pm.onFeedPage().postFeedTitle('Post title 4').click();
    await pm.onPostPage().verifyCorrectPostIsOpened("Post title 4", TESTUSER_1_NAME);
    
    //Act
    await pm.onPostPage().addComment(TEST_COMMENT1);
    
    //Assert
    await expect(page.locator('h2')).toHaveText('Вхід в акаунт');
  });
});








