import {test, expect} from '@playwright/test'

test.beforeEach(async({page})=>{
    await page.goto('/')
    await expect(page.getByRole('button', {name:"Поділитися"})).toBeVisible();
})


test('Add a valid post with title only', async({page})=>{
    await page.getByRole('textbox', { name: 'Чим хочеш поділитися?' }).fill('Test name');
    await page.getByRole('button', { name: 'Поділитися' }).click();
    await expect(page.getByRole('button', { name: 'Висловитись' })).toBeVisible();
})