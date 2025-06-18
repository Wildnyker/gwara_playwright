import { test, expect } from '@playwright/test';
import { PageManager } from '../pageModels/pageManager';
import {DBDATA, TESTUSER_1_NAME, TESTUSER_2_NAME, CLEANUPCODE} from './test data/testData';

// No longer needed as page models are brought via page manager
// import { FeedPage } from '../pageModels/feedPage';
// import { PostPage } from '../pageModels/postPage';
// import { CleanupPage } from '../pageModels/cleanupPage';
// import { ToolsPage } from '../pageModels/testingToolsPage';
// import { LoginPage } from '../pageModels/loginPage';

test.use({ storageState: './.auth/user1.json' });

test.beforeEach(async ({ page }) => {
    // Arrange: Go to the main feed page and ensure the user is logged in
    const pm = new PageManager(page)
    await page.goto('/');

    await expect(pm.onFeedPage().openPostFormButton).toBeVisible();
});


test.describe('Positive cases for adding a post as user', ()=>{

    test('Add a valid post with title only', async ({ page }) => {
        // Arrange: Prepare page objects
        const pm = new PageManager(page)


        // Act: Add post with only title
        await pm.onFeedPage().addPost("Test title 1");

        // Assert: Title is visible on the post page
        await expect(pm.onPostPage().postTitle, "Title has expected text").toHaveText('Test title 1');
        await page.waitForTimeout(5000)
    });

    test('Add a valid post with title + body', async ({ page }) => {
        // Arrange: Prepare page objects
        const pm = new PageManager(page)


        // Act: Add post with title and body
        await pm.onFeedPage().addPost("Test title 2", undefined, "Test Body");

        // Assert: Title and body are visible on the post page
        await expect(pm.onPostPage().postTitle, "Title has expected text").toHaveText('Test title 2');
        await expect(pm.onPostPage().postBody, "Body has expected text").toHaveText('Test Body');
    });

    test('Add a valid post with title + body + image', async ({ page }) => {
        // Arrange: Prepare page objects
        const pm = new PageManager(page)


        // Act: Add post with title, image, and body
        await pm.onFeedPage().addPost("Test title 3", "https://clipart-library.com/data_images/320464.png", "Test Body 2");

        // Assert: Title, image, and body are all correctly rendered
        await expect(pm.onPostPage().postTitle, "Title has expected text").toHaveText('Test title 3');
        await expect(pm.onPostPage().postImage, "Image is visible").toBeVisible();
        await expect(pm.onPostPage().postImage, "Image has expected src").toHaveAttribute('src', 'https://clipart-library.com/data_images/320464.png');
        await expect(pm.onPostPage().postBody, "Body has expected text").toHaveText('Test Body 2');
    });
})

test.describe('Negative cases for adding a post as user', ()=>{
    test.use({ storageState: '.auth/user1.json' });
    test('Add a post with image + body without title(required)', async ({page})=>{
        // Arrange: Prepare page object
        const pm = new PageManager(page);

        // Act: Add image and body to the post form & submit it
        await pm.onFeedPage().addPost(undefined, "https://clipart-library.com/data_images/320464.png", "Test Body 3");

        //Assert URL did not change & post button is still visible
        await expect(page).toHaveURL('/')
        await expect(pm.onFeedPage().postButton).toBeVisible()

    })


    test('Add a post with a non-valid image link', async ({page})=>{
        // Arrange: Prepare page object
        const pm = new PageManager(page);

        //Act: Add title, not valid image link & body to the post form & submit it
        await pm.onFeedPage().addPost("Test title 3", "not_a_link", "Test Body 2");

        //Assert: URL did not change, error about non valid image link is visible & is correct
        await expect(page).toHaveURL('/')
        await expect(pm.onFeedPage().addPostError).toHaveText('Некоректне посилання на зображення')
    })
})


test.describe('Post deletion',()=>{
    test('delete own post', async({page})=>{
        // Arrange: Set up page objects
        const pm = new PageManager(page);

        // Act: Open the post, verify it's opened, and perform the deletion steps
        await pm.onFeedPage().postFeedTitle('Post title 1').click()
        await pm.onPostPage().verifyCorrectPostIsOpened('Post title 1', TESTUSER_1_NAME)
        await pm.onPostPage().clickDeletePostButton()
        await pm.onPostPage().confirmPostDeletion()

        // Assert: Check that the post is no longer visible on the global Feed page
        await expect(pm.onFeedPage().postFeedTitle('Post title 1'), 'Check that post is no longer visible on the global Feed page').not.toBeVisible()
    })

    test("delete other user's post", async({page})=>{
        // Arrange: Set up page objects
        const pm = new PageManager(page);
        
        // Act: Open the post, verify it's opened
        await pm.onFeedPage().postFeedTitle('Post title 2').click()
        await pm.onPostPage().verifyCorrectPostIsOpened('Post title 2', TESTUSER_2_NAME)

        //Assert: Check that no delete button is visible for the other user's posts
        await expect(pm.onPostPage().postDeleteButton, "No delete button is visible for the other user's posts").not.toBeVisible()
    })
})

test.describe('Feed Empty state',()=>{
    test('Verify empty state is shown', async ({page})=>{
        // Arrange: Prepare all necessary page objects for the test
        const pm = new PageManager(page);

        // Arrange: Clean the database to ensure the feed is empty 
        await pm.onCleanupPage().cleanData(CLEANUPCODE);

        // Assert: Confirm the UI shows the empty state message (no posts)
        await expect(pm.onFeedPage().emptyPostsContainer).toHaveText('Жодного допису. ');

        // Act: Repopulate the database with test data (users/posts)
        await pm.onToolsPage().createData(DBDATA);

        // Act: Log in as Test User 1 & 2 and save the authentication state
        await pm.onLoginPage().saveAuthStatesForTestUser1();
        await pm.onLoginPage().saveAuthStatesForTestUser2();
    })
})