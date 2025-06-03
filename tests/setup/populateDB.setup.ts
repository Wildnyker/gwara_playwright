import {test as setup} from '@playwright/test'
import { ToolsPage } from '../../pageModels/testingToolsPage';
import {DBDATA} from '../test data/testData'

setup('Populate database with test data', async ({page})=>{
    await page.goto('/testing-tools')
    const toolspage = new ToolsPage(page)
    await toolspage.createData(DBDATA)
})