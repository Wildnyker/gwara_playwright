import {test as teardown} from "@playwright/test"
import { CleanupPage } from "../../pageModels/cleanupPage"
import {CLEANUPCODE} from "../test data/testData"

teardown('delete database entries', async({page})=>{
    const cleanDBPage = new CleanupPage(page)
    await cleanDBPage.cleanData(CLEANUPCODE)
})