# `vite-plugin-vue-style-layers`

Based on [this](https://github.com/web-baseline/vite-plugin-vue-style-layer).

## Usage

```ts
import { plugin as vueStyleLayersPlugin } from 'vite-plugin-vue-style-layers';

export default defineConfig({
  plugins: [
    vue(),
    vueStyleLayersPlugin({
      wrapperComponentPath: path.resolve('./src/ui/icon.vue'),
      svgo: {
        floatPrecision: 2,
        plugins: [
          {
            // https://svgo.dev/docs/preset-default/
            name: 'preset-default',
            params: { overrides: { removeViewBox: false } },
          },
          'prefixIds',
          'convertStyleToAttrs',
        ],
      },
    }),
  ],
});
```
