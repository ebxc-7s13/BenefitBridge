import react from "@vitejs/plugin-react";
import type { Plugin } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { defineConfig } from "vitest/config";

// The single file has no manifest or icon files beside it, so drop the tags that point to them.
const dropInstallLinks: Plugin = {
  name: "drop-install-links",
  transformIndexHtml: (html) => html.replace(/\s*<link rel="(manifest|apple-touch-icon)"[^>]*>/g, ""),
};

// `npm run build` → dist/ (installable PWA with offline service worker).
// `npm run build:single` → dist-single/index.html (one self-contained file for releases).
export default defineConfig(({ mode }) => ({
  base: "./",
  plugins: mode === "single" ? [react(), viteSingleFile(), dropInstallLinks] : [react()],
  define: { __SINGLE_FILE__: JSON.stringify(mode === "single") },
  build: {
    outDir: mode === "single" ? "dist-single" : "dist",
    copyPublicDir: mode !== "single",
    // Everything ships in one bundle on purpose so the app works fully offline.
    chunkSizeWarningLimit: 800,
  },
  test: {
    include: ["src/**/*.test.ts"],
  },
}));
