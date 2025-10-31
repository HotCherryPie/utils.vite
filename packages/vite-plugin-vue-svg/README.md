# `vite-plugin-vue-svg`

## Usage

```ts
import { plugin as vueSvgPlugin } from 'vite-plugin-vue-svg';

export default defineConfig({
  plugins: [
    vue(),
    vueSvgPlugin({
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

```vue
<template>
  <MyIcon />
</template>

<script setup>
import MyIcon from './my-icon.svg';
</script>
```

### URL

You can import as url with `?url`:

```ts
import iconUrl from './my-icon.svg?url';
// '/src/images/my-icon.svg'
```

### Component

Or explicitly as component `?component`:

```ts
import IconComponent from './my-icon.svg?component';
// <IconComponent />
```

### Import mode

By default `*.svg` files will be imported as vue component. You can override it by setting `defaultImport` option to `url`

```ts
vueSvgPlugin({
  defaultImport: 'url',
});
```
