import {test, expect} from '@playwright/test'
import { faker } from '@faker-js/faker'

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
    const validUserName = faker.person.firstName()
    const validUserPassword = faker.internet.password()
    await page.getByPlaceholder('Ім\'я користувача').fill(validUserName);
    await page.getByPlaceholder('Пароль').nth(0).fill(validUserPassword);
    await page.getByPlaceholder('Повторіть пароль').fill(validUserPassword);
    await page.getByRole('button', {name:"Зареєструватись"}).click()

    await expect(page, "Redirected to main page after the login").toHaveURL('http://localhost:8000/')
    await page.locator("#menu-button").click()
    await expect(page.getByText(validUserName), "Name of the logged in user is visible").toBeVisible()
})

test('not valid password registration(short)', async ({page})=>{
    const validUserName = faker.person.firstName()
    const shortUserPassword = 'par0l'
    await page.getByPlaceholder('Ім\'я користувача').fill(validUserName);
    await page.getByPlaceholder('Пароль').nth(0).fill(shortUserPassword);
    await page.getByPlaceholder('Повторіть пароль').fill(shortUserPassword);
    await page.getByRole('button', {name:"Зареєструватись"}).click()
    var errorText = await page.locator('#usernameForm .error').innerText()
    var errorText = errorText.trim()
    await expect(page.locator('#usernameForm').locator('.error')).toHaveText("* password2 * Пароль надто короткий. Він повинен містити як мінімум 8 символів")
})

test('password is too known', async ({page})=>{
    const validUserName = faker.person.firstName()
    const knownPassword = 'abcdefghij'
    await page.getByPlaceholder('Ім\'я користувача').fill(validUserName);
    await page.getByPlaceholder('Пароль').nth(0).fill(knownPassword);
    await page.getByPlaceholder('Повторіть пароль').fill(knownPassword);
    await page.getByRole('button', {name:"Зареєструватись"}).click()
    var errorText = await page.locator('#usernameForm .error').innerText()
    var errorText = errorText.trim()
    await expect(page.locator('#usernameForm').locator('.error')).toHaveText("* password2 * Пароль надто відомий.")
})

test('password integers only', async ({page})=>{
    const validUserName = faker.person.firstName()
    const shortUserPassword = '002233114477'
    await page.getByPlaceholder('Ім\'я користувача').fill(validUserName);
    await page.getByPlaceholder('Пароль').nth(0).fill(shortUserPassword);
    await page.getByPlaceholder('Повторіть пароль').fill(shortUserPassword);
    await page.getByRole('button', {name:"Зареєструватись"}).click()
    var errorText = await page.locator('#usernameForm .error').innerText()
    var errorText = errorText.trim()
    await expect(page.locator('#usernameForm').locator('.error')).toHaveText("* password2 * Цей пароль повністю складається із цифр.")
})

test('passwords do not match', async ({page})=>{
    const validUserName = faker.person.firstName()
    const shortUserPassword = '002233114477'
    await page.getByPlaceholder('Ім\'я користувача').fill(validUserName);
    await page.getByPlaceholder('Пароль').nth(0).fill(shortUserPassword);
    await page.getByPlaceholder('Повторіть пароль').fill(shortUserPassword);
    await page.getByRole('button', {name:"Зареєструватись"}).click()
    var errorText = await page.locator('#usernameForm .error').innerText()
    var errorText = errorText.trim()
    await expect(page.locator('#usernameForm').locator('.error')).toHaveText("* password2 * Паролі не збігаються")
})

test('Register with an existing username', async({page})=>{
    const validUserPassword = faker.internet.password()
    await page.getByPlaceholder('Ім\'я користувача').fill('Tester');
    await page.getByPlaceholder('Пароль').nth(0).fill(validUserPassword);
    await page.getByPlaceholder('Повторіть пароль').fill(validUserPassword);

    var errorNameText = await page.locator('#usernameError').innerText()
    var errorNameText = errorNameText.trim()
    await expect(page.locator('#usernameError')).toHaveText("Це ім'я вже зайнято.")

    await page.getByRole('button', {name:"Зареєструватись"}).click()
    
    var errorText = await page.locator('#usernameForm .error').innerText()
    var errorText = errorText.trim()
    await expect(page.locator('#usernameForm').locator('.error')).toHaveText("* username * Користувач з таким ім'ям вже існує.")
})

