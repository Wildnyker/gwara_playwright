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


test('verify "about me" empty state', async ({page})=>{
    //Arrange: prepared POM & got to edit profile page
    const editAboutMePage = new EditAboutMePage(page)
    const settingsMenuDropdown = new SettingMenuDropdown(page)
    await settingsMenuDropdown.goToEditAboutMePage()

    //Assert we are on correct page, edit form is visible and has expected placeholeder for edit textbox
    await expect(page.url).toBe(`accounts/edit-profile/${TESTUSER_2_NAME}`)  
    await expect (editAboutMePage.aboutMePlaceholder).toBeVisible()
})

test('submit "empty" about me form', async({page})=>{
    //Arrange: prepared POM & got to edit profile page
    const editAboutMePage = new EditAboutMePage(page)
    const settingsMenuDropdown = new SettingMenuDropdown(page)
    const aboutMePage = new AboutMePage(page)
    await settingsMenuDropdown.goToEditAboutMePage()

    //Assert we are on the right page & form has expected placeholeder 
    await expect(editAboutMePage.editAboutMePageHeader).toHaveText(`Редагувати сторінку користувача ${TESTUSER_2_NAME}`)
    await expect (editAboutMePage.aboutMeTextbox).toHaveAttribute("placeholder","Про мене")
    
    //Act: submit empty edit profile form
    await editAboutMePage.submitChangesAboutMe()

    // Assert: "About Me" description is in empty state
    await expect(aboutMePage.aboutMeDescription).toHaveText("Про мене:")
})

test('change "empty" about me', async({page})=>{
    // Arrange: Prepare Page Objects and go to edit profile page
    const editAboutMePage = new EditAboutMePage(page)
    const aboutMePage = new AboutMePage(page)
    const settingsMenuDropdown = new SettingMenuDropdown(page)
    await settingsMenuDropdown.goToEditAboutMePage()
    
    // Act: Fill new "About Me" text and submit
    await editAboutMePage.submitChangesAboutMe("Test description")

    // Assert: Redirect to user profile and verify description is updated
    await expect(page.url).toBe(`/accuonts/u/${TESTUSER_2_NAME}`)
    await expect(aboutMePage.aboutMeDescription).toHaveText("Про мене: Test description")
})