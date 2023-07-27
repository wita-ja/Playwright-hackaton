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
for (;! await page.getByText(/Results/).isVisible();) {
    
    await answer.type(`${getAnswer(await question.textContent())}`);
    
}
});
