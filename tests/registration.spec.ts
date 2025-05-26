import {test, expect} from '@playwright/test'
import {faker} from '@faker-js/faker'
import { RegistrationPage } from '../pageModels/registrationPage'
import { TESTUSER_1_NAME } from './testData';


test.beforeEach(async({page})=>{
    if (await page.getByRole('button', { name: "Поділитися" }).isVisible()) {
        await page.goto('/accounts/logout');
        await page.goto('/accounts/register')
    }
    else {
        await page.goto('/accounts/register');
    }
})


test('valid registration', async ({page})=>{
    const registrationPage = new RegistrationPage(page);
    const validUserName = faker.person.firstName();
    const validUserPassword = faker.internet.password();

    await registrationPage.register(validUserName,validUserPassword,validUserPassword);

    await expect(page, "Redirected to main page after the login").toHaveURL('/');
    await page.locator("#menu-button").click();
    await expect(page.getByText(validUserName), "Name of the logged in user is visible").toBeVisible();
})

test('short password registration', async ({page})=>{
    const registrationPage = new RegistrationPage(page);
    const validUserName = faker.person.firstName();
    const shortUserPassword = 'par0l';

    await registrationPage.register(validUserName,shortUserPassword,shortUserPassword);
    await expect(await registrationPage.getFinalFormErrorText).toHaveText("* password2 * Пароль надто короткий. Він повинен містити як мінімум 8 символів");

})

test('too known password registration', async({page})=>{
    const registrationPage = new RegistrationPage(page);
    const validUserName = faker.person.firstName();
    const knownPassword = 'abcdefghij';

    await registrationPage.register(validUserName, knownPassword, knownPassword);
    await expect(await registrationPage.getFinalFormErrorText).toHaveText("* password2 * Пароль надто відомий.");
})

test('password from integers only registration', async ({page})=>{
    const registrationPage = new RegistrationPage(page);
    const validUserName = faker.person.firstName();
    const integersPassword = "00223344551177";

    await registrationPage.register(validUserName, integersPassword, integersPassword);
    await expect(await registrationPage.getFinalFormErrorText).toHaveText("* password2 * Цей пароль повністю складається із цифр.")
})

test('passwords do not match registration', async({page})=>{
    const registrationPage = new RegistrationPage(page);
    const validUserName = faker.person.firstName();
    const validPassword1 = faker.internet.password();
    const validPassword2 = faker.internet.password();

    await registrationPage.register(validUserName, validPassword1, validPassword2);
    await expect(await registrationPage.getFinalFormErrorText).toHaveText("* password2 * Паролі не збігаються");
})

test('existing username registration', async({page})=>{
    const registrationPage = new RegistrationPage(page);
    const validPassword = faker.internet.password();
    await registrationPage.register(TESTUSER_1_NAME, validPassword, validPassword);
    await expect(await registrationPage.getFinalFormErrorText).toHaveText("* username * Користувач з таким ім'ям вже існує.");
})