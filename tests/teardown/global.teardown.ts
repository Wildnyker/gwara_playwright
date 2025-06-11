import {test as teardown} from "@playwright/test"
import { PageManager } from "../../pageModels/pageManager"
import {CLEANUPCODE} from "../test data/testData"

teardown('delete database entries', async({page})=>{
    const pm = new PageManager(page)
    await pm.onCleanupPage().cleanData(CLEANUPCODE)
})