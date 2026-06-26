import { minimatch } from 'minimatch';
import path from 'pathe';
import { parse, atRule } from 'postcss';
import type { Plugin } from 'vite';

export interface FileConfig {
  /** @default undefined */
  layer?: undefined | string;

  /** @default false */
  allowCustomLayers?: boolean | undefined;
}

export interface Rule extends FileConfig {
  /** Glob or delegate func */
  files: string | ((id: string) => boolean);
}

export interface PluginOptions {
  /**
   * Root directory to resolve `.file` globs.
   *
   * @defaultValue {@link https://vite.dev/config/shared-options#root|Vite `root` directory}.
   */
  root?: string | undefined;
  rules: Rule[];
}

export function cssLayers(options: PluginOptions): Plugin {
  let root = options.root;
  let rules: Rule[] = [];

  return {
    name: 'vite-plugin-css-layers',

    configResolved(config) {
      root ??= path.resolve(config.root);

      const constRoot = root;
      rules = options.rules.map((it) => ({
        ...it,
        files:
          typeof it.files === 'string' ?
            path.resolve(constRoot, it.files)
          : it.files,
      }));
    },

    transform(code, id) {
      const [filename, rawQuery] = id.split(`?`, 2);

      if (!filename) return;

      const query = Object.fromEntries(new URLSearchParams(rawQuery)) as {
        type?: 'script' | 'template' | 'style' | 'custom';
        layer?: string;
      };

      if (query.type !== 'style') return;

      const fileConfig = resolveConfigForEntry(id, rules);

      const layer =
        fileConfig.allowCustomLayers ?
          (query.layer ?? fileConfig.layer)
        : fileConfig.layer;

      if (layer) {
        const { nodes } = parse(code);

        if (nodes.filter((node) => node.type !== 'comment').length === 0)
          return;

        const css = atRule({
          name: 'layer',
          params: layer,
          nodes: nodes,
        });

        return {
          code: css.toString(),
          // eslint-disable-next-line unicorn/no-null
          map: null,
        };
      }

      // eslint-disable-next-line unicorn/no-useless-undefined
      return undefined;
    },
  };
}

function resolveConfigForEntry(id: string, rules: Rule[]) {
  const relevantRules = rules.filter((it) => {
    if (typeof it.files === 'string') return minimatch(id, it.files);

    return it.files(id);
  });

  const config: Required<FileConfig> = {
    layer: undefined,
    allowCustomLayers: false,
  };

  for (const it of relevantRules) {
    Object.assign(config, it);
  }

  return config;
}
