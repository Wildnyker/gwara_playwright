import { test, expect } from "@playwright/test";
import { PageManager } from "../pageModels/pageManager";
import { TESTUSER_2_NAME } from "./test data/testData";
import { LONG_ABOUT_ME_TEXT } from "./test data/testData";
import { TOO_LONG_ABOUT_ME_TEXT } from "./test data/testData";

test.use({ storageState: "./.auth/user2.json" });

test.beforeEach(async ({ page }) => {
  const pm = new PageManager(page);
  // Arrange: Go to the main feed page and ensure the user is logged in
  await page.goto("/");
  await expect(pm.onFeedPage().openPostFormButton).toBeVisible();

  // Arrange: Go to the "Edit about me page"
  await pm.onSettingMenuDropdown().goToEditAboutMePage();
});

test('should display placeholder when "About Me" section is empty', async ({
  page,
}) => {
  //Arrange: prepared POM
  const pm = new PageManager(page);

  //Assert we are on correct page, edit form is visible and has expected placeholeder for edit textbox
  await expect(page).toHaveURL(`/accounts/edit-profile/${TESTUSER_2_NAME}`);
  await expect(pm.onEditAboutMePage().aboutMePlaceholder).toBeVisible();
});

test('should submit empty "About Me" form and show empty state', async ({
  page,
}) => {
  //Arrange: prepared POM
  const pm = new PageManager(page);

  //Assert we are on the right page & form has expected placeholeder
  await expect(pm.onEditAboutMePage().editAboutMePageHeader).toHaveText(
    `Редагувати сторінку користувача ${TESTUSER_2_NAME}`
  );
  await expect(pm.onEditAboutMePage().aboutMeTextbox).toHaveAttribute(
    "placeholder",
    "Про мене"
  );

  //Act: submit empty edit profile form
  await pm.onEditAboutMePage().submitChangesAboutMe();

  // Assert: "About Me" description is in empty state
  await expect(pm.onAboutMePage().aboutMeDescription).toHaveText("Про мене:");
});

test('should save and display entered "About Me" text', async ({ page }) => {
  // Arrange: Prepare Page Objects
  const pm = new PageManager(page);

  // Act: Fill new "About Me" text and submit
  await pm.onEditAboutMePage().submitChangesAboutMe("Test description");

  // Assert: Redirect to user profile and verify description is updated
  await expect(page).toHaveURL(`/accounts/u/${TESTUSER_2_NAME}`);
  await expect(pm.onAboutMePage().aboutMeDescription).toHaveText(
    "Про мене: Test description"
  );
});

test('should update existing "About Me" text with new value', async ({
  page,
}) => {
  // Arrange: Prepare Page Objects
  const pm = new PageManager(page);

  // Assert: Pre-filled text is as expected before editing
  await expect(pm.onEditAboutMePage().aboutMeTextbox).toHaveText(
    "Test description"
  );

  // Act: Clear the field and submit new text
  await pm.onEditAboutMePage().aboutMeTextbox.clear();
  await pm.onEditAboutMePage().submitChangesAboutMe("New description");

  // Assert: User is redirected and the new description is displayed
  await expect(page).toHaveURL(`/accounts/u/${TESTUSER_2_NAME}`);
  await expect(pm.onAboutMePage().aboutMeDescription).toHaveText(
    "Про мене: New description"
  );
});

test('should correctly save and display max-length "About Me" text', async ({
  page,
}) => {
  // Arrange: Prepare Page Objects
  const pm = new PageManager(page);

  // Act: Submit the current max-length text
  await pm.onEditAboutMePage().aboutMeTextbox.clear();
  await pm.onEditAboutMePage().submitChangesAboutMe(LONG_ABOUT_ME_TEXT);

  // Assert: Redirect occurs and full max-length text is saved and displayed
  await expect(page).toHaveURL(`/accounts/u/${TESTUSER_2_NAME}`);
  await expect(pm.onAboutMePage().aboutMeDescription).toHaveText(
    `Про мене: ${LONG_ABOUT_ME_TEXT}`
  );
});

test('should truncate and save "About Me" when text exceeds max length', async ({
  page,
}) => {
  // Arrange: Prepare Page Objects
  const pm = new PageManager(page);

  // Assert: Textbox is pre-filled with too-long input
  await expect(pm.onEditAboutMePage().aboutMeTextbox).toHaveText(
    LONG_ABOUT_ME_TEXT
  );

  // Act: Submit the too-long input (implicitly expects server/client to truncate)
  await pm.onEditAboutMePage().aboutMeTextbox.clear();
  await pm.onEditAboutMePage().submitChangesAboutMe(TOO_LONG_ABOUT_ME_TEXT);

  // Assert: Redirect occurs and only the truncated valid part is saved
  await expect(page).toHaveURL(`/accounts/u/${TESTUSER_2_NAME}`);
  await expect(pm.onAboutMePage().aboutMeDescription).toHaveText(
    `Про мене: ${LONG_ABOUT_ME_TEXT}`
  );
});
