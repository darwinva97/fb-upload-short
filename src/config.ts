import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const BROWSER_PATH = String(process.env.BROWSER_PATH);
export const USER_DATA_DIR = String(process.env.USER_DATA_DIR);
export const FB_USER = String(process.env.FB_USER);
export const FB_PASS = String(process.env.FB_PASS);
export const FB_URL_BASE = String(process.env.FB_URL_BASE);
export const FB_SLUG_USER = String(process.env.FB_SLUG_USER);
export const DREAMSTUDIO_API_KEY = String(process.env.DREAMSTUDIO_API_KEY);
export const ASSETS_PATH = path.resolve(__dirname, "..", "assets");
