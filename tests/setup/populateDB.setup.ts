import { test as setup } from "@playwright/test";
import { ToolsPage } from "../../pageModels/testingToolsPage";
import { PageManager } from "../../pageModels/pageManager";
import { DBDATA } from "../test data/testData";

setup("Populate database with test data", async ({ page }) => {
  const pm = new PageManager(page);
  await pm.onToolsPage().createData(DBDATA);
});
