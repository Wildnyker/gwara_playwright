import {test, expect} from '@playwright/test'
import {faker} from '@faker-js/faker'
import { PageManager } from '../pageModels/pageManager';
import { TESTUSER_1_NAME, INVALID_SHORT_TEST_PASS } from './test data/testData';

test.use({ storageState: undefined });

test.beforeEach(async({page})=>{
    //Arrange: Ensure we're on register page while being logged out 
    if (await page.getByRole('button', { name: "Поділитися" }).isVisible()) {
        await page.goto('/accounts/logout');
        await page.goto('/accounts/register')
    }
    else {
        await page.goto('/accounts/register');
    }
})


test('valid registration', async ({page})=>{
    //Arrange: prepare page + test data
    const pm = new PageManager(page)
    const validUserName = faker.person.firstName();
    const validUserPassword = faker.internet.password();

    //Act: Register with valid credentials
    await pm.onRegistrationPage().register(validUserName,validUserPassword,validUserPassword);

    //Asserr: Ensure we're redirected to the main page & registered user's name is visible
    await expect(page, "Redirected to main page after the login").toHaveURL('/');
    await page.locator("#menu-button").click();
    await expect(page.getByText(validUserName), "Name of the logged in user is visible").toBeVisible();
})

test('short password registration', async ({page})=>{
    // Arrange: Prepare registration page and short password
    const pm = new PageManager(page)
    const validUserName = faker.person.firstName();

    // Act: Try to register with short password
    await pm.onRegistrationPage().register(validUserName,INVALID_SHORT_TEST_PASS,INVALID_SHORT_TEST_PASS);

    // Assert: Correct error is show
    await expect(await pm.onRegistrationPage().finalValidationError).toHaveText("Пароль надто короткий. Він повинен містити як мінімум 8 символів");

})

test('too known password registration', async({page})=>{
    // Arrange: Prepare registration page and too common password
    const pm = new PageManager(page)
    const validUserName = faker.person.firstName();
    const knownPassword = 'abcdefghij';

    // Act: Try to register with too common password
    await pm.onRegistrationPage().register(validUserName, knownPassword, knownPassword);

    // Assert: Correct error is shown
    await expect(await pm.onRegistrationPage().finalValidationError).toHaveText("Пароль надто відомий.");
})

test('password from integers only registration', async ({page})=>{
    // Arrange: Prepare registration page and all-numeric password
    const pm = new PageManager(page)
    const validUserName = faker.person.firstName();
    const integersPassword = "00223344551177";

     // Act: Try to register with numbers-only password
    await pm.onRegistrationPage().register(validUserName, integersPassword, integersPassword);

    // Assert: Correct error is shown
    await expect(await pm.onRegistrationPage().finalValidationError).toHaveText("Цей пароль повністю складається із цифр.");
})

test('passwords do not match registration', async({page})=>{
    // Arrange: Prepare registration page and two different passwords
    const pm = new PageManager(page)
    const validUserName = faker.person.firstName();
    const validPassword1 = faker.internet.password();
    const validPassword2 = faker.internet.password();

    // Act: Try to register with passwords that do not match
    await pm.onRegistrationPage().register(validUserName, validPassword1, validPassword2);

    // Assert: Correct error is shown
    await expect(await pm.onRegistrationPage().finalValidationError).toHaveText("Паролі не збігаються");
})

test('existing username registration', async({page})=>{
    // Arrange: Prepare registration page and a username that already exists
    const pm = new PageManager(page)
    const validPassword = faker.internet.password();

    // Act: Try to register with an existing username
    await pm.onRegistrationPage().register(TESTUSER_1_NAME, validPassword, validPassword);

    // Assert: Correct error is shown
    await expect(await pm.onRegistrationPage().finalValidationError).toHaveText("Користувач з таким ім'ям вже існує.");
})