import {test, expect} from '@playwright/test'
import { FeedPage } from '../pageModels/feedPage';
import { title } from 'process';

test.beforeEach(async({page})=>{
    await page.goto('/')
    await expect(page.getByRole('button', {name:"Поділитися"})).toBeVisible();
})


test('Add a valid post with title only', async({page})=>{
    const feedPage = new FeedPage(page);
    await feedPage.addPost("Test title 1")
    await expect(page.locator('.entry-title')).toHaveText('Test title 1')
    await expect(page.getByRole('button', { name: 'Висловитись' })).toBeVisible();
})

test('Add a valid post with title + body', async({page})=>{
    const feedPage = new FeedPage(page);
    await feedPage.addPost("Test title 2", undefined, "Test Body")
    await expect(page.getByRole('button', { name: 'Висловитись' })).toBeVisible();
    await expect(page.locator('.entry-title')).toHaveText('Test title 2')
    await expect(page.getByText('Test Body 1')).toBeVisible()
})


test('Add a valid post with title + body + image', async({page})=>{
    const feedPage = new FeedPage(page);
    await feedPage.addPost("Test title 3", "https://clipart-library.com/data_images/320464.png","Test Body 2")
    await expect(page.locator('.entry-title')).toHaveText('Test title 3')
    await expect(page.locator('.entry-image')).toBeVisible()
    await expect(page.locator('.entry-image')).toHaveAttribute('src', 'https://clipart-library.com/data_images/320464.png');
    await expect(page.getByText('Test Body 2')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Висловитись' })).toBeVisible();
})