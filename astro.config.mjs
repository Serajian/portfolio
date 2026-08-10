// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // TODO: replace with the real domain once it's pointed at the server
  site: 'https://example.com',
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
