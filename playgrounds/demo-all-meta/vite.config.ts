import { defineConfig } from 'vite';

import { plugin as envMeta } from '../../packages/vite-plugin-env-meta/lib/index.ts';
import { plugin as fileMeta } from '../../packages/vite-plugin-file-meta/lib/index.ts';

// https://vite.dev/config/
export default defineConfig({
  plugins: [fileMeta(), envMeta()],
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
