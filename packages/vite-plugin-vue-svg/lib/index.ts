import { promises as fs } from 'node:fs';
import nodePath from 'node:path';
import { fileURLToPath } from 'node:url';

import { minimatch } from 'minimatch';
import { optimize as optimizeSvg } from 'svgo';
import type { Plugin } from 'vite';
import { normalizePath } from 'vite';

import type { SvgLoaderOptions } from './types';

const SVG_REGEX = /\.svg(\?(url|component))?$/;

const findConfigInOverrides = (
  overrides: SvgLoaderOptions['overrides'],
  id: string,
) => {
  if (!overrides) return;

  const found = overrides.find((override) => {
    const files =
      typeof override.files === 'string' ? [override.files] : override.files;

    return files.some((file) =>
      minimatch(id, `${import.meta.dirname}/${file}`, { matchBase: true }),
    );
  });

  return found?.options;
};

export const vueSvg = (loaderOptions: SvgLoaderOptions = {}): Plugin => {
  return {
    name: 'vite-plugin-vue-svg',
    enforce: 'pre',

    async load(id: string) {
      if (!SVG_REGEX.test(id)) return;

      const [path, query] = id.split('?', 2);

      if (!path) return;

      const { overrides, ...options } = loaderOptions;

      const resolvedConfig =
        findConfigInOverrides(overrides, id) ?? options ?? {};
      const importType = query ?? resolvedConfig.defaultImport;

      if (importType === 'url') return; // Use default loader

      let svg = await fs.readFile(path, 'utf8');

      if (resolvedConfig.svgo) {
        svg = optimizeSvg(svg, {
          ...(typeof resolvedConfig.svgo === 'boolean' ?
            {}
          : resolvedConfig.svgo),
          path,
        }).data;
      }

      const [content] =
        // eslint-disable-next-line sonarjs/slow-regex
        /(?<=svg.*>(\s|\n)*)<.+>(?=(\s|\n)*<\/\s*svg)/gs.exec(svg) ?? [];

      const [, viewBox = '0 0 0 0'] =
        /viewBox="(\d+ \d+ \d+ \d+)"/g.exec(svg) ?? [];
      const [, fill] = /fill="(.+?)"/g.exec(svg) ?? [];

      const iconBasePath =
        resolvedConfig.wrapperComponentPath ??
        nodePath.resolve(
          nodePath.dirname(fileURLToPath(import.meta.url)),
          './default-wrapper.vue',
        );

      return `
      import { h } from 'vue';
      import IconBase from '${normalizePath(iconBasePath)}';

      export default {
        render: (props, context) => h(
          IconBase,
          {
            ...context.attrs,
            viewBox: "${viewBox}",
            innerHTML: '${content}',
            fill: "${fill}"
          },
        )
      }`;
    },
  };
};
