import { defineConfig } from 'vite';

import { plugin } from '../../packages/vite-plugin-file-meta/lib/index.ts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [plugin()],
  build: {
    modulePreload: { polyfill: false },
    target: 'esnext',
    minify: false,
    rolldownOptions: {
      treeshake: {
        // Doesn't work atm
        //  https://github.com/rolldown/rolldown/issues/5872
        propertyReadSideEffects: false,
        propertyWriteSideEffects: false,
        moduleSideEffects: false,
      },
    },
  },
});
