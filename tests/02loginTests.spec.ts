import {test, expect} from '@playwright/test'
import { PageManager } from '../pageModels/pageManager';
import { TESTUSER_1_NAME, VALID_TEST_PASS, INVALID_SHORT_TEST_PASS } from './test data/testData';

test.use({ storageState: undefined });


test.beforeEach(async({page})=>{
    // Arrange: Ensure we're on the login page and logged out
    if (await page.getByRole('button', { name: "Поділитися" }).isVisible()) {
        await page.goto('/accounts/logout');
        await page.goto('/accounts/login/')
    }
    else {
        await page.goto('/accounts/login/');
    }
})


test('Valid login', async ({ page }) => {
    // Arrange: Prepare the login page object
    const pm = new PageManager(page);

    // Act: Perform login with valid credentials
    await pm.onLoginPage().fillTheFieldsAndLogIn(TESTUSER_1_NAME, VALID_TEST_PASS);

    // Assert: User is redirected to main page
    await expect(page, "Redirected to main page after the login").toHaveURL('/');
    await page.context().storageState({ path: './.auth/user1.json' }); 

    // Act: Open the menu
    await page.locator("#menu-button").click();

    // Assert: User name is visible
    await expect(page.locator('.dropdown-item-text', {hasText:TESTUSER_1_NAME}), "Name of the logged in user is visible").toBeVisible();
});

test('invalid password login', async({page})=>{
    // Arrange: Prepare the login page object
    const pm = new PageManager(page);

    // Act: Attempt login with invalid password
    await pm.onLoginPage().fillTheFieldsAndLogIn('Tester', INVALID_SHORT_TEST_PASS);

    // Assert: Should remain on the login page and show error message
    await expect(page, "Stayed on login page").toHaveURL('/accounts/login/');
    await expect(pm.onLoginPage().errorMessage).toHaveText('Йой, помилка в імені або паролі.');
})

test('invalid username login', async({page})=>{
    // Arrange: Prepare the login page object
    const pm = new PageManager(page);

    // Act: Attempt login with invalid username
    await pm.onLoginPage().fillTheFieldsAndLogIn('Ta', VALID_TEST_PASS);

    // Assert: Should remain on the login page and show error message
    await expect(page, "Stayed on login page").toHaveURL('/accounts/login/')
    await expect(pm.onLoginPage().errorMessage).toHaveText('Йой, помилка в імені або паролі.')
})

test('no username & password', async({page})=>{
    // Act: Try to submit the form without entering credentials
    await page.getByRole('button', { name: 'Увійти' }).click();

    // Assert: Should remain on the login page
    await expect(page, "Stayed on login page").toHaveURL('/accounts/login/');
})