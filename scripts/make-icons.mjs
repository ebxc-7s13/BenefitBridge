// Renders the app icon to the PNG sizes phones need. Run: node scripts/make-icons.mjs
import { chromium } from "@playwright/test";

const mark = (bg, inset) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="${inset ? 0 : 112}" fill="${bg}"/>
  <g transform="${inset ? "translate(64 64) scale(0.75)" : ""}">
    <path d="M96 340c40-90 100-136 160-136s120 46 160 136M96 340h320M176 340v-60M256 340v-80M336 340v-60"
      stroke="#fff" stroke-width="34" stroke-linecap="round" fill="none"/>
  </g></svg>`;

const browser = await chromium.launch(process.env.PW_CHROMIUM_PATH ? { executablePath: process.env.PW_CHROMIUM_PATH } : {});
const page = await browser.newPage();
for (const [file, size, maskable] of [["icon-192.png", 192, false], ["icon-512.png", 512, false], ["icon-maskable-512.png", 512, true]]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<style>html,body{margin:0;background:transparent}svg{display:block;width:${size}px;height:${size}px}</style>${mark("#1f5f4a", maskable)}`);
  await page.screenshot({ path: `public/${file}`, omitBackground: true });
}
await browser.close();
