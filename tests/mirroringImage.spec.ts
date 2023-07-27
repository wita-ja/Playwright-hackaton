import { test, type Page, type Mouse } from '@playwright/test';
import { faker } from '@faker-js/faker';
import * as fs from 'node:fs';
import Jimp from "jimp";

type dimensions = {
    width: any,
    height: any
}

test('Mirrore Image', async ({ page }) => {
    await page.setViewportSize({ width: 1000, height: 1000 });
    await page.goto('https://jacksonpollock.org/');
    const canvasElement = page.locator('#myCanvas');
    await canvasElement.waitFor({ state: 'visible', timeout: 3000 });
    await canvasElement.click();
    const mouse = page.mouse;
    const steps = { steps: 8 }
    const halfSteps = {steps: 5}

    //galas
    await mouse.move(500, 500, steps); //0
    await mouse.move(500, 600, steps); //1
    await mouse.move(500, 500, steps); //2

    //apatinis sparnas
    await mouse.click(500, 500);
    await mouse.move(400, 650, steps); //3
    await mouse.move(250, 750, steps); //4
    await mouse.move(150, 750, steps); //5
    await mouse.move(100, 650, steps); //6
    await mouse.move(200, 550, steps); //7
    await mouse.move(250, 450, halfSteps); //8
    await mouse.move(350, 400, halfSteps); //9

    //spalvinimas apatinio sparno
    await mouse.move(350, 450, {steps:15}); //10
    await mouse.move(300, 600, {steps:20}); //11
    await mouse.move(300, 450, halfSteps); //12
    await mouse.move(350, 450, halfSteps); //13
    await mouse.move(350, 400, halfSteps); //14

    //virsutinis sparnas
    await mouse.click(350, 400);
    await mouse.move(350, 350, steps); //15
    await mouse.move(150, 250, steps); //16
    await mouse.move(100, 200, steps); //17
    await mouse.move(150, 100, steps); //18
    await mouse.move(300, 150, steps); //19
    await mouse.move(450, 250, steps); //20

    //priekis
    await mouse.move(500, 350, steps); //21
    await mouse.click(500, 350);
    await mouse.move(500, 150, steps); //22

    // usikai
    await mouse.move(400, 50, steps); //18
    await mouse.move(500, 150, steps); //19

    const finalImage = await page.screenshot();
    let rightSide: any;
    
    Jimp.read(finalImage).then((image) => {
       rightSide = image.mirror(true, false ).crop(498, 0, 500, 1000);
    });

    const leftSide = await Jimp.read(finalImage);
    leftSide.composite(rightSide, 500, 0).write('screenshot_final.png');
});
