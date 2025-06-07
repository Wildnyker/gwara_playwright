import { test, expect } from "@playwright/test";
import { EditAboutMePage } from "../pageModels/editAboutMePage";
import { AboutMePage } from "../pageModels/aboutMePage";
import {TESTUSER_2_NAME} from './test data/testData'
import { SettingMenuDropdown } from "../pageModels/settingsMenuDropdown";
test.use({ storageState: './.auth/user2.json' });

test.beforeEach(async ({ page }) => {
    // Arrange: Go to the main feed page and ensure the user is logged in
    await page.goto('/');
    await expect(page.getByRole('button', { name: "Поділитися" }), "Share button is visible").toBeVisible();
});

test('change "empty" about me', async({page})=>{
    const editAboutMePage = new EditAboutMePage(page)
    const aboutMePage = new AboutMePage(page)
    const settingsMenuDropdown = new SettingMenuDropdown(page)
    await settingsMenuDropdown.goToEditAboutMePage()
    await editAboutMePage.submitChangesAboutMe("Test description")
    await expect(page.url).toBe(`/accuonts/u/${TESTUSER_2_NAME}`)
    await expect(aboutMePage.aboutMeDescription).toHaveText("Test description")
})