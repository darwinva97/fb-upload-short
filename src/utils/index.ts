import { ElementHandle, Page } from "playwright";

export const findByTextContent = async (page: Page, textContent: string) => {
  textContent = textContent.trim();
  const element = await page.$eval("body", () => {
    const elements = Array.from(document.querySelectorAll("body *")); // Selecciona todos los elementos en el cuerpo de la página

    return elements.find(
      (element) => (element as HTMLElement).innerText === textContent
    );
  });

  if (!element) return null;

  return element;
};

export const pressKeys = async (page: Page, text: string) => {
  const characters = text.split("");

  for await (let character of characters) {
    character = character === " " ? "Space" : character;
    console.log(character);
    await page.keyboard.press(character);
  }
};
