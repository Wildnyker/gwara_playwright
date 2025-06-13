import {test, expect} from '@playwright/test'
import { PageManager } from '../pageModels/pageManager'


test.beforeEach(async({page})=>{
    const pm = new PageManager(page)
    // Arrange: Go to the main feed page and ensure the user is logged in
    await page.goto('/');
    await expect(pm.onFeedPage().openPostFormButton).toBeVisible();
    
    // Arrange: Go to the "Edit about me page"
    await pm.onSettingMenuDropdown().goToEditAboutMePage();
})

test('add valid comment to own post', async({page})=>{

})

test('add valid comment to other user post', async({page})=>{

})

test('add empty comment', async({page})=>{

})

test('add max-length comment', async({page})=>{

})

test('check comment posting is not possible fro not logged user', async ({page})=>{

})

test('edit own comment', async({page})=>{

})

test('delete own domment', async({page})=>{
    
})