import { expect, type Locator, type Page } from "playwright/test";


export class RegistrationPage {
    readonly page:Page;
    readonly usernameRegField: Locator;
    readonly passwordRegField: Locator;
    readonly repeatPasswordRegField: Locator;
    readonly registerButton: Locator;
    readonly formFinalError: Locator;
    readonly usernameError: Locator;
    readonly menuButton: Locator;




    constructor(page:Page){
        this.page = page;
        this.usernameRegField = page.getByPlaceholder('Ім\'я користувача');
        this.passwordRegField = page.getByPlaceholder('Пароль').nth(0);
        this.repeatPasswordRegField = page.getByPlaceholder('Повторіть пароль');
        this.registerButton = page.getByRole('button', {name:"Зареєструватись"});
        this.formFinalError = page.locator('#usernameForm .error');
        this.usernameError = page.locator('#usernameError');
        this.menuButton = page.locator("#menu-button");
    }

    async register(username:string, password: string, confirmPassword:string){
        await this.usernameRegField.fill(username)
        await this.passwordRegField.fill(password)
        await this.repeatPasswordRegField.fill(confirmPassword)
        await this.registerButton.click()
    }

    async getFinalFormErrorText(){
        const formErrorText = this.page.locator('#usernameForm .error')
        return formErrorText
        //return formErrorText.trim()
    }

    async getUserDuplicateErrorText(){
        const userDuplicateErrorText = await this.page.locator('#usernameError')
        return userDuplicateErrorText
    }

}