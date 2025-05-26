import {expect,type Locator,type Page} from '@playwright/test'

export class LoginPage{
    readonly page:Page;
    readonly usernameLoginField:Locator;
    readonly passwordLoginField:Locator;
    readonly loginButton:Locator;

    constructor(page:Page){
        this.page = page
        this.usernameLoginField = this.page.getByRole('textbox', { name: 'Ім\'я користувача' })
        this.passwordLoginField = this.page.getByRole('textbox', { name: 'Пароль' })
        this.loginButton = this.page.getByRole('button', { name: 'Увійти' })

        
    }

    async fillTheFieldsAndLogIn(username:string, password:string){
        await this.usernameLoginField.fill(username)
        await this.passwordLoginField.fill(password)
        await this.loginButton.click()
    }
}