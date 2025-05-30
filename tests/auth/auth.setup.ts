import { test as setup, expect} from '@playwright/test';
import { VALID_TEST_PASS, TESTUSER_1_NAME } from '../test data/testData';

const authFile = '.auth/user.json';

//auth via UI is done for this project as it is built on Django and it is tricky to get CSRF token that is attached to request
//if user is not registered - register & then login
setup('Authenticate as Testuser 1', async ({ page }) => {

    await page.goto("/accounts/login/");
    await page.getByRole('textbox', { name: 'Ім\'я користувача' }).fill(TESTUSER_1_NAME);
    await page.getByRole('textbox', { name: 'Пароль' }).fill(VALID_TEST_PASS);
    await page.getByRole('button', { name: 'Увійти' }).click();
    const currentUrl = await page.url();
    if(currentUrl.includes('/accounts/login')){
        console.log('user not found - register');
        await page.goto('/accounts/register');
        await page.getByRole('textbox', { name: 'Ім\'я користувача' }).fill(TESTUSER_1_NAME);
        await page.getByRole('textbox', { name: 'Пароль' }).fill(VALID_TEST_PASS);
        await page.getByRole('textbox', { name: 'Підтвердження пароля' }).fill(VALID_TEST_PASS);
        await page.getByRole('button', { name: 'Зареєструватися' }).click();
        
        // Optional: check success or fallback
        await expect(page.getByRole('button', { name: 'Поділитися' }), 'User registered and logged in').toBeVisible();
    } else {
        await expect(page.getByRole('button', { name: 'Поділитися' }), 'User logged in').toBeVisible();
    }
    await page.context().storageState({ path: authFile });
});
