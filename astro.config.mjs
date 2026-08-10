// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // canonical domain — serajianmohsen.ir is an alias that redirects here
  site: 'https://mohsenserajian.ir',
  output: 'static',
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // the background shader + animation modules are small; keep them in one chunk
      assetsInlineLimit: 2048,
    },
  },
});
