import {test, expect} from '@playwright/test'
import {faker} from '@faker-js/faker'
import { RegistrationPage } from '../pageModels/registrationPage'


test.beforeEach(async({page})=>{
    if (await page.getByRole('button', { name: "Поділитися" }).isVisible()) {
        await page.goto('http://localhost:8000/accounts/logout');
        await page.goto('http://localhost:8000/accounts/register')
    }
    else {
        await page.goto('http://localhost:8000/accounts/register');
    }
})


test('valid registration', async ({page})=>{
    const registrationPage = new RegistrationPage(page);
    const validUserName = faker.person.firstName();
    const validUserPassword = faker.internet.password();
    await registrationPage.register(validUserName,validUserPassword,validUserPassword);
    await expect(page, "Redirected to main page after the login").toHaveURL('http://localhost:8000/');
    await page.locator("#menu-button").click();
    await expect(page.getByText(validUserName), "Name of the logged in user is visible").toBeVisible();
})

test('short password registration', async ({page})=>{
    const registrationPage = new RegistrationPage(page);
    const validUserName = faker.person.firstName();
    const shortUserPassword = 'par0l';
    await registrationPage.register(validUserName,shortUserPassword,shortUserPassword);
    await expect(await registrationPage.getFinalFormErrorText()).toHaveText("* password2 * Пароль надто короткий. Він повинен містити як мінімум 8 символів");

})

test('too known password registration', async({page})=>{
    const registrationPage = new RegistrationPage(page);
    const validUserName = faker.person.firstName();
    const knownPassword = 'abcdefghij';
    await registrationPage.register(validUserName, knownPassword, knownPassword);
    await expect(await registrationPage.getFinalFormErrorText()).toHaveText("* password2 * Пароль надто відомий.")
})