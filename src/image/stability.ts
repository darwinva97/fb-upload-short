import fs from "fs";
import path from "path";
import { DREAMSTUDIO_API_KEY, ASSETS_PATH } from "../config";

const apiHost = "https://api.stability.ai";

const headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${DREAMSTUDIO_API_KEY}`,
};

const urlEngines = `${apiHost}/v1/engines/list`;

export const generateImage = async (prompt: string) => {
  const engines = await fetch(urlEngines, { method: "GET", headers }).then(
    (r) => r.json()
  );
  const engineId = engines.pop().id;
  const urlGeneration = `${apiHost}/v1/generation/${engineId}/text-to-image`;
  const body = JSON.stringify({
    text_prompts: [
      {
        text: prompt,
        weight: 0.5,
      },
    ],
  });
  const data = await fetch(urlGeneration, {
    method: "POST",
    headers,
    body,
  }).then((res) => res.json());

  const base64 = Array.isArray(data?.artifacts)
    ? data?.artifacts[0]?.base64
    : null;

  if (!base64) return;

  const filePath = path.resolve(ASSETS_PATH, Date.now() + ".png");

  fs.writeFileSync(filePath, base64, "base64");

  const removeFile = () => {
    fs.unlinkSync(filePath);
  };

  const stabilityResultData = data?.artifacts[0];

  delete stabilityResultData.base64;

  return {
    filePath,
    removeFile,
    stabilityResultData: {
      ...stabilityResultData,
      engineId,
    },
  };
};
