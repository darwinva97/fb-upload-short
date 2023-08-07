import Jimp from "jimp";
import path from "path";
import { ColorActionName } from "@jimp/plugin-color";
import { getPrompt } from "./prompt";
import { generateImage } from "./stability";

export const getImage = async () => {
  const prompt = getPrompt();
  const imageData = await generateImage(prompt);
  if (!imageData) return;

  const { filePath, stabilityResultData } = imageData;

  return new Promise((resolve, rejects) => {
    Jimp.read(filePath, (err, image) => {
      if (err) {
        rejects(err);
      }

      let textImage = new Jimp(1000, 1000, 0x0, (err, textImage) => {
        //((0x0 = 0 = rgba(0, 0, 0, 0)) = transparent)
        if (err) throw err;
      });

      Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then((font) => {
        textImage.print(
          font,
          300,
          300,
          JSON.stringify(stabilityResultData, null, 3)
        );
        textImage.color([
          { apply: ColorActionName.LIGHTEN, params: ["#00ff00"] },
        ]);
        image.blit(textImage, 0, 0);
        image.write(filePath);
        resolve(imageData);
      });
    });
  });
};
