import {test, expect} from '@playwright/test'
import { LoginPage } from '../pageModels/loginPage'

test.beforeEach(async({page})=>{
    if (await page.getByRole('button', { name: "Поділитися" }).isVisible()) {
        await page.goto('http://localhost:8000/accounts/logout');
        await page.goto('http://localhost:8000/accounts/login/')
    }
    else {
        await page.goto('http://localhost:8000/accounts/login/');
    }
})


test('Valid login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.fillTheFieldsAndLogIn('Tester', 'Test!2345')

    await expect(page, "Redirected to main page after the login").toHaveURL('http://localhost:8000/')
    await page.locator("#menu-button").click()
    await expect(page.getByText("Tester"), "Name of the logged in user is visible").toBeVisible()
});

test('invalid password login', async({page})=>{
    const loginPage = new LoginPage(page);
    await loginPage.fillTheFieldsAndLogIn('Tester', 'Ar')

    await expect(page, "Stayed on login page").toHaveURL('http://localhost:8000/accounts/login/')
    await expect(page.locator('.error-message')).toHaveText('Йой, помилка в імені або паролі.')
})

test('invalid username login', async({page})=>{
    const loginPage = new LoginPage(page);
    await loginPage.fillTheFieldsAndLogIn('Ta', 'Test!2345')

    await expect(page, "Stayed on login page").toHaveURL('http://localhost:8000/accounts/login/')
    await expect(page.locator('.error-message')).toHaveText('Йой, помилка в імені або паролі.')
})

test('no username & password', async({page})=>{
    await page.getByRole('button', { name: 'Увійти' }).click();
    await expect(page, "Stayed on login page").toHaveURL('http://localhost:8000/accounts/login/')
})