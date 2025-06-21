import { type Locator, type Page } from "@playwright/test";

export class CleanupPage {
  readonly page: Page;
  readonly clenupCodeField: Locator;
  readonly confirmCleanupButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.clenupCodeField = this.page.locator("#id_code");
    this.confirmCleanupButton = this.page.getByRole("button", {
      name: "Підтвердити очищення",
    });
  }

  async cleanData(cleanupCode: string) {
    await this.page.goto("/cleanup");
    await this.clenupCodeField.fill(cleanupCode);
    await this.confirmCleanupButton.click();
  }
}
