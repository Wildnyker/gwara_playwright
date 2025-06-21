import { type Page } from "@playwright/test";
import { RegistrationPage } from "../pageModels/registrationPage";
import { LoginPage } from "../pageModels/loginPage";
import { EditAboutMePage } from "../pageModels/editAboutMePage";
import { AboutMePage } from "../pageModels/aboutMePage";
import { SettingMenuDropdown } from "../pageModels/settingsMenuDropdown";
import { FeedPage } from "../pageModels/feedPage";
import { PostPage } from "../pageModels/postPage";
import { CleanupPage } from "../pageModels/cleanupPage";
import { ToolsPage } from "../pageModels/testingToolsPage";

export class PageManager {
  private readonly page: Page;
  private readonly registrationPage: RegistrationPage;
  private readonly loginPage: LoginPage;
  private readonly editAboutMePage: EditAboutMePage;
  private readonly aboutMePage: AboutMePage;
  private readonly settingMenuDropdown: SettingMenuDropdown;
  private readonly feedPage: FeedPage;
  private readonly postPage: PostPage;
  private readonly cleanupPage: CleanupPage;
  private readonly toolsPage: ToolsPage;

  constructor(page: Page) {
    this.page = page;
    this.registrationPage = new RegistrationPage(this.page);
    this.loginPage = new LoginPage(this.page);
    this.editAboutMePage = new EditAboutMePage(this.page);
    this.aboutMePage = new AboutMePage(this.page);
    this.settingMenuDropdown = new SettingMenuDropdown(this.page);
    this.feedPage = new FeedPage(this.page);
    this.postPage = new PostPage(this.page);
    this.cleanupPage = new CleanupPage(this.page);
    this.toolsPage = new ToolsPage(this.page);
  }

  onRegistrationPage() {
    return this.registrationPage;
  }

  onLoginPage() {
    return this.loginPage;
  }

  onEditAboutMePage() {
    return this.editAboutMePage;
  }

  onAboutMePage() {
    return this.aboutMePage;
  }

  onSettingMenuDropdown() {
    return this.settingMenuDropdown;
  }

  onFeedPage() {
    return this.feedPage;
  }

  onPostPage() {
    return this.postPage;
  }

  onCleanupPage() {
    return this.cleanupPage;
  }

  onToolsPage() {
    return this.toolsPage;
  }
}
