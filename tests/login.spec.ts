import {test, expect} from '@playwright/test'

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

    await page.getByRole('textbox', { name: 'Ім\'я користувача' }).click();
    await page.getByRole('textbox', { name: 'Ім\'я користувача' }).fill('Tester');
    await page.getByRole('textbox', { name: 'Ім\'я користувача' }).press('Tab');
    await page.getByRole('textbox', { name: 'Пароль' }).fill('Test!2345');
    await page.getByRole('button', { name: 'Увійти' }).click();

    await expect(page, "Redirected to main page after the login").toHaveURL('http://localhost:8000/')
    await page.locator("#menu-button").click()
    await expect(page.getByText("Tester"), "Name of the logged in user is visible").toBeVisible()
});