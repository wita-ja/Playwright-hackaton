import { test } from '@playwright/test';

test('max score', async ({ page }) => {
  await page.goto('https://www.mathster.com/10secondsmaths/');
  //document.querySelectorAll("input[type=checkbox]")
  // Expect a title "to contain" a substring.
//   const modes = page.locator("input[type=checkbox]");
//   const x = await  modes.all();
//   x.forEach(async (y) => await y.check())
// console.log(x);
for (const i of await page.locator("input[type=checkbox]").all()) {
    await i.click();
}

// const slider = page.locator("#math-range-slider");
await page.dragAndDrop(".noUi-handle.noUi-handle-lower", "#time-box");
const getAnswer = (question: string): Number => {
    if (question.includes("+")) {
      const splitted = question.split(" + ");
      return +splitted[0] + +splitted[1];
    }
      if (question.includes("-")) {
      const splitted = question.split(" - ");
      return +splitted[0] - +splitted[1];
    }
    if (question.includes("×")) {
        const splitted = question.split(" × ");
      return +splitted[0] * +splitted[1];
    }
      if (question.includes("÷")) {
        const splitted = question.split(" ÷ ");
      return +splitted[0] / +splitted[1];
    }
      if (question.includes("√")) {
        const splitted = question.split("√");
      return Math.sqrt(+splitted[1]);
    }
      if (question.includes("³")) {
        const splitted = question.split("³");
      return Math.pow(+splitted[0], 3);
    }
        if (question.includes("²")) {
        const splitted = question.split("²");
      return Math.pow(+splitted[0], 2);
    }
  }


const question = page.locator("#question");
const answer = page.locator("#question-answer");
// while(! await page.getByText(/Results/).isVisible()) {
//     await answer.type(`${getAnswer(await question.textContent())}`);
// }
await page.waitForEvent("");
await page.evaluate(async () => {
  const question = document.getElementById("question");
  const answer = document.getElementById("question-answer") as HTMLInputElement;
  while(!document.getElementById("results")) {
    answer.value = `${getAnswer(question.textContent)}`
    answer.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: true })
    );
  }
})
// for (;! await page.getByText(/Results/).isVisible();) {
    
//     await answer.type(`${getAnswer(await question.textContent())}`);
    
// }
});

const cellN = page.locator(".cell.N");
const cellNE = page.locator(".cell.NE");
const cellE = page.locator(".cell.E");
const cellSE = page.locator(".cell.SE");
const cellS = page.locator(".cell.S");
const cellW = page.locator(".cell.W");
const cellSW = page.locator(".cell.SW");
const cellNW = page.locator(".cell.NW");
const cellC = page.locator(".cell.C");