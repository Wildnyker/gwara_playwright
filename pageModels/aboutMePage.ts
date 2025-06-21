import { type Locator, type Page } from "@playwright/test";

export class AboutMePage {
  readonly page: Page;
  readonly aboutMeHeader: Locator;
  readonly aboutMeDescription: Locator;

  constructor(page: Page) {
    this.page = page;
    this.aboutMeHeader = this.page.getByRole("heading", { name: /Сторінка/i });
    this.aboutMeDescription = this.page.locator("#bio");
  }
}
