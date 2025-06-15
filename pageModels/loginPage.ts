import {expect,type Locator,type Page} from '@playwright/test'
import { PageManager } from '../pageModels/pageManager'
import { VALID_TEST_PASS, TESTUSER_1_NAME, TESTUSER_2_NAME } from '../tests/test data/testData';
const authFile1 = '.auth/user1.json';
const authFile2 = '.auth/user2.json';
export class LoginPage{
    readonly page:Page;
    readonly usernameLoginField:Locator;
    readonly passwordLoginField:Locator;
    readonly loginButton:Locator;
    readonly errorMessage:Locator;
    

    constructor(page:Page){
        this.page = page;
        this.usernameLoginField = this.page.getByRole('textbox', { name: 'Ім\'я користувача' });
        this.passwordLoginField = this.page.getByRole('textbox', { name: 'Пароль' });
        this.loginButton = this.page.getByRole('button', { name: 'Увійти' });
        this.errorMessage = this.page.locator('.error-message');
        
    }

    async fillTheFieldsAndLogIn(username:string, password:string){
        await this.usernameLoginField.fill(username);
        await this.passwordLoginField.fill(password);
        await this.loginButton.click();
    }

    async saveAuthStatesForTestUser1(){
        const pm = new PageManager(this.page)
        await this.page.goto("/accounts/login/");
        await this.usernameLoginField.fill(TESTUSER_1_NAME);
        await this.passwordLoginField.fill(VALID_TEST_PASS);
        await this.loginButton.click();
        await this.page.waitForTimeout(3000)
        await this.page.context().storageState({ path: authFile1 });

    }

    async saveAuthStatesForTestUser2(){
        const pm = new PageManager(this.page)
        await this.page.goto("/accounts/login/");
        await this.usernameLoginField.fill(TESTUSER_2_NAME);
        await this.passwordLoginField.fill(VALID_TEST_PASS);
        await this.loginButton.click();
        await this.page.waitForTimeout(3000)
        await this.page.context().storageState({ path: authFile2 });
    }

    

}