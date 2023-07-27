import { test, type Page, type Mouse } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as fs from 'node:fs';

type dimensions = {
    width: any,
    height: any
}

test('Mirrore Image', async ({ page }) => {
    await page.setViewportSize({width:1000, height: 1000});
    await page.goto('https://jacksonpollock.org/');
    const canvasElement =page.locator('#myCanvas');
    await canvasElement.waitFor({ state: 'visible', timeout: 3000 });

    const mouse = page.mouse;
        await mouse.move(500, 500);
        await mouse
        //await mouse.click(coordinatesToMove.width, coordinatesToMove.height);
        await page.waitForTimeout(1000);
    

    //await page.waitForTimeout(3000)
    await page.screenshot({ path: 'screenshot.png' });
});
