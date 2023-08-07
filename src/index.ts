import { chromium } from "playwright-extra";
import Stealth from "puppeteer-extra-plugin-stealth";
import {
  BROWSER_PATH,
  FB_PASS,
  FB_SLUG_USER,
  FB_URL_BASE,
  FB_USER,
  USER_DATA_DIR,
} from "./config";
import { findByTextContent, pressKeys } from "./utils";
import { ElementHandle } from "playwright";

const stealth = Stealth();

chromium.use(stealth);

const waitPage = chromium
  .launchPersistentContext(USER_DATA_DIR, {
    executablePath: BROWSER_PATH,
    headless: process.env.NODE_ENV !== "development",
  })
  .then((b) => b.newPage());

const main = async () => {
  const page = await waitPage;
  await page.goto(FB_URL_BASE);

  const existInputLogin = await page.$("input#email");
  if (existInputLogin) {
    await page.type("input#email", FB_USER);
    await page.type("input#pass", FB_PASS);

    await Promise.all([
      page.waitForURL(FB_URL_BASE),
      await page.click('button[name="login"]'),
    ]);
  }

  const locatorCreateHistory = page.getByText("Crear historia");
  await locatorCreateHistory.hover();
  await locatorCreateHistory.click();

  const locatorCreateWithPhoto = page.getByText("Crear una historia con fotos");
  await locatorCreateWithPhoto.hover();
  // await locatorCreateWithPhoto.click();
  // await page.keyboard.press("Escape");

  const inputFile = (await page.$(
    "input[type=file]"
  )) as ElementHandle<HTMLInputElement>;
  if (!inputFile) return;
  await inputFile.setInputFiles("./assets/img/ishi.png");

  const locatorAddText = page.getByText("Agregar texto");
  await locatorAddText.hover();
  await locatorAddText.click();

  await new Promise((res) => setTimeout(() => res(null), 1 * 1000));

  await page.keyboard.type("Hello", { delay: 200 });

  // unfocus
  const locatorTitle = page.getByText("Tu historia");
  await locatorTitle.hover();
  await locatorTitle.click();

  // drag move
  const locatorWrited = page.getByText("Empieza a escribir");
  const bounding_box = await locatorWrited.boundingBox();
  if (!bounding_box) return;
  await page.mouse.move(
    bounding_box.x + bounding_box.width / 2,
    bounding_box.y + bounding_box.height / 2
  );
  await page.mouse.down();
  await page.mouse.move(126, 19);
  await page.mouse.up();
};

main();
