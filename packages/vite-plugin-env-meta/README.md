# `vite-plugin-env-meta`

## Usage

<small><code>vite.config.ts</code></small>

```ts
import { defineConfig } from 'vite';
import { plugin } from 'vite-plugin-env-meta';

export default defineConfig({
  plugins: [plugin()],
});
```

<small><code>src/foo.ts</code></small>

```ts
import { branch } from 'virtual:env-meta';

console.log(branch); // main
```
