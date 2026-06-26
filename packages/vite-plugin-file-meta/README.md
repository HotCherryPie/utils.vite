# `vite-plugin-file-meta`

## Usage

<small><code>vite.config.ts</code></small>

```ts
import { defineConfig } from 'vite';
import { plugin } from 'vite-plugin-file-meta';

export default defineConfig({
  plugins: [plugin()],
});
```

<small><code>src/foo.ts</code></small>

```ts
import { location } from 'virtual:file-meta';

console.log(location.relative); // src/foo.ts
```
