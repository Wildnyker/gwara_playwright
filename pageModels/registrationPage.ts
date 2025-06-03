import {type Locator, type Page } from "playwright/test";


export class RegistrationPage {
    readonly page:Page;
    readonly usernameRegField: Locator;
    readonly passwordRegField: Locator;
    readonly repeatPasswordRegField: Locator;
    readonly registerButton: Locator;
    //readonly formFinalError: Locator;
    readonly menuButton: Locator;
    readonly finalValidationError:Locator;

    constructor(page:Page){
        this.page = page;
        this.usernameRegField = this.page.getByPlaceholder('Ім\'я користувача');
        this.passwordRegField = this.page.getByPlaceholder('Пароль').nth(0);
        this.repeatPasswordRegField = this.page.getByPlaceholder('Повторіть пароль');
        this.registerButton = this.page.getByRole('button', {name:"Зареєструватись"});
        this.menuButton = this.page.locator("#menu-button");
        this.finalValidationError = this.page.locator('.error-message p')
    }

    async register(username:string, password: string, confirmPassword:string){
        await this.usernameRegField.fill(username);
        await this.passwordRegField.fill(password);
        await this.repeatPasswordRegField.fill(confirmPassword);
        await this.registerButton.click();
    }


}