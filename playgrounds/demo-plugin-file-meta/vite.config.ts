import { defineConfig } from 'vite';

import { plugin } from '../../packages/vite-plugin-file-meta/lib/index.ts';

// https://vite.dev/config/
export default defineConfig({
  // @ts-expect-error fuck off aaa
  plugins: [plugin()],
});
