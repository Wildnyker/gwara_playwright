import { test, expect } from "@playwright/test";
import { EditAboutMePage } from "../pageModels/editAboutMePage";
import { AboutMePage } from "../pageModels/aboutMePage";
import {TESTUSER_2_NAME} from './test data/testData'
import { SettingMenuDropdown } from "../pageModels/settingsMenuDropdown";
import { LONG_ABOUT_ME_TEXT } from "./test data/testData";
import { TOO_LONG_ABOUT_ME_TEXT } from "./test data/testData";

test.use({ storageState: './.auth/user2.json' });

test.beforeEach(async ({ page }) => {
    // Arrange: Go to the main feed page and ensure the user is logged in
    await page.goto('/');
    await expect(page.getByRole('button', { name: "Поділитися" }), "Share button is visible").toBeVisible();

    // Arrange: Go to the "Edit about me page"
    const settingsMenuDropdown = new SettingMenuDropdown(page);
    await settingsMenuDropdown.goToEditAboutMePage();
});


test('should display placeholder when "About Me" section is empty', async ({page})=>{
    //Arrange: prepared POM 
    const editAboutMePage = new EditAboutMePage(page);

    //Assert we are on correct page, edit form is visible and has expected placeholeder for edit textbox
    await expect(page.url).toBe(`accounts/edit-profile/${TESTUSER_2_NAME}`) ; 
    await expect (editAboutMePage.aboutMePlaceholder).toBeVisible();
})

test('should submit empty "About Me" form and show empty state', async({page})=>{
    //Arrange: prepared POM 
    const editAboutMePage = new EditAboutMePage(page);
    const settingsMenuDropdown = new SettingMenuDropdown(page);
    const aboutMePage = new AboutMePage(page);

    //Assert we are on the right page & form has expected placeholeder 
    await expect(editAboutMePage.editAboutMePageHeader).toHaveText(`Редагувати сторінку користувача ${TESTUSER_2_NAME}`);
    await expect (editAboutMePage.aboutMeTextbox).toHaveAttribute("placeholder","Про мене");
    
    //Act: submit empty edit profile form
    await editAboutMePage.submitChangesAboutMe();

    // Assert: "About Me" description is in empty state
    await expect(aboutMePage.aboutMeDescription).toHaveText("Про мене:");
})

test('should save and display entered "About Me" text', async({page})=>{
    // Arrange: Prepare Page Objects 
    const editAboutMePage = new EditAboutMePage(page);
    const aboutMePage = new AboutMePage(page);
    
    // Act: Fill new "About Me" text and submit
    await editAboutMePage.submitChangesAboutMe("Test description");

    // Assert: Redirect to user profile and verify description is updated
    await expect(page.url).toBe(`/accuonts/u/${TESTUSER_2_NAME}`);
    await expect(aboutMePage.aboutMeDescription).toHaveText("Про мене: Test description");
})


test('should update existing "About Me" text with new value', async({page})=>{
    // Arrange: Prepare Page Objects
    const editAboutMePage = new EditAboutMePage(page);
    const aboutMePage = new AboutMePage(page);

    // Assert: Pre-filled text is as expected before editing
    await expect(editAboutMePage.aboutMeTextbox).toHaveText('Test description');

    // Act: Clear the field and submit new text
    await editAboutMePage.aboutMeTextbox.clear();
    await editAboutMePage.submitChangesAboutMe("New description");

    // Assert: User is redirected and the new description is displayed
    await expect(page.url).toBe(`/accuonts/u/${TESTUSER_2_NAME}`);
    await expect(aboutMePage.aboutMeDescription).toHaveText("Про мене: New description");
})

test('should correctly save and display max-length "About Me" text', async({page})=>{
    // Arrange: Prepare Page Objects
    const editAboutMePage = new EditAboutMePage(page);
    const aboutMePage = new AboutMePage(page);

    // Assert: Textbox is pre-filled with valid max-length input
    await expect(editAboutMePage.aboutMeTextbox).toHaveText(LONG_ABOUT_ME_TEXT);

    // Act: Submit the current max-length text
    await editAboutMePage.aboutMeTextbox.clear();
    await editAboutMePage.submitChangesAboutMe("");

    // Assert: Redirect occurs and full max-length text is saved and displayed
    await expect(page.url).toBe(`/accuonts/u/${TESTUSER_2_NAME}`)
    await expect(aboutMePage.aboutMeDescription).toHaveText(`Про мене: ${LONG_ABOUT_ME_TEXT}`);
})

test('should truncate and save "About Me" when text exceeds max length', async({page})=>{
    // Arrange: Prepare Page Objects
    const editAboutMePage = new EditAboutMePage(page);
    const aboutMePage = new AboutMePage(page);

    // Assert: Textbox is pre-filled with too-long input
    await expect(editAboutMePage.aboutMeTextbox).toHaveText(TOO_LONG_ABOUT_ME_TEXT);

    // Act: Submit the too-long input (implicitly expects server/client to truncate)
    await editAboutMePage.aboutMeTextbox.clear();
    await editAboutMePage.submitChangesAboutMe("");

    // Assert: Redirect occurs and only the truncated valid part is saved
    await expect(page.url).toBe(`/accuonts/u/${TESTUSER_2_NAME}`);
    await expect(aboutMePage.aboutMeDescription).toHaveText(`Про мене: ${LONG_ABOUT_ME_TEXT}`);
})