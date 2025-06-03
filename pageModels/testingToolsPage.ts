import {type Locator, type Page } from "playwright/test";

export class ToolsPage{
    readonly page:Page;
    readonly dataTextarea:Locator;
    readonly submitButton:Locator;
    constructor(page:Page){
       this.page = page
       this.dataTextarea = this.page.getByPlaceholder('Дані у форматі JSON.')
       this.submitButton = this.page.getByRole('button', {name:"Заповнити"}) 
    }
    async createData(inputJson:string){
        //this.dataTextarea.clear()
        await this.dataTextarea.fill(inputJson)
        await this.submitButton.click()
    }
}

