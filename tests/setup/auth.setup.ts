import { test as setup} from '@playwright/test';
import { VALID_TEST_PASS, TESTUSER_1_NAME, TESTUSER_2_NAME } from '../test data/testData';

const authFile1 = '.auth/user1.json';
const authFile2 = '.auth/user2.json';

setup('Authenticate as Testuser 1', async ({ page }) => {
    //Tester_one
    await page.goto("/accounts/login/");
    await page.getByRole('textbox', { name: 'Ім\'я користувача' }).fill(TESTUSER_1_NAME);
    await page.getByRole('textbox', { name: 'Пароль' }).fill(VALID_TEST_PASS);
    await page.getByRole('button', { name: 'Увійти' }).click();
    await page.context().storageState({ path: authFile1 });
});


setup('Authenticate as Testuser 2', async ({ page }) => {
    //Tester_two
    await page.goto("/accounts/login/");
    await page.getByRole('textbox', { name: 'Ім\'я користувача' }).fill(TESTUSER_2_NAME);
    await page.getByRole('textbox', { name: 'Пароль' }).fill(VALID_TEST_PASS);
    await page.getByRole('button', { name: 'Увійти' }).click();
    await page.context().storageState({ path: authFile2 });
});
