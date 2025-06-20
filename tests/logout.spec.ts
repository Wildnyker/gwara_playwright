import {test, expect} from '@playwright/test';
import { PageManager } from '../pageModels/pageManager';

test.use({ storageState: './.auth/user1.json' });

test("Logout", async({page})=>{
    const pm = new PageManager(page);
    await page.goto('/');
    await expect(pm.onFeedPage().openPostFormButton).toBeVisible();
    
    await pm.onSettingMenuDropdown().logout();
    await expect(pm.onFeedPage().openPostFormButton).toHaveCount(0);
})