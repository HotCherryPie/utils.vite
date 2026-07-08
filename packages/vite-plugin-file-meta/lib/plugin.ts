/* eslint-disable unicorn/no-this-outside-of-class */
import * as glCodeowners from '@gitlab/codeowners';
import path from 'pathe';
import type { Plugin } from 'vite';
import { normalizePath } from 'vite';

const MODULE_ID = 'virtual:file-meta';
const RESOLVED_MODULE_ID = `\0${MODULE_ID}`;

// eslint-disable-next-line sonar/super-linear-regex
const removeQueryAndHashFromPath = (it: string) => it.replace(/[?#].*$/, '');

// https://vite.dev/guide/api-plugin#virtual-modules-convention
export const plugin: () => Promise<Plugin> = async () => {
  const cwd = normalizePath(process.cwd());
  const codeowners = await glCodeowners.parse(
    path.resolve(cwd, '.gitlab/CODEOWNERS'),
  );

  return {
    name: 'vite-plugin-file-meta',
    enforce: 'pre',

    resolveId(source, importer) {
      if (source !== MODULE_ID) return; // null

      if (!importer) {
        this.error(`"${MODULE_ID}" must be imported from a real file.`);

        // @ts-expect-error only for type narrowing
        return; // null
      }

      const searchParameters = new URLSearchParams([
        ['location', removeQueryAndHashFromPath(normalizePath(importer))],
      ]);

      return `${RESOLVED_MODULE_ID}?${searchParameters.toString()}`;
    },

    load(id) {
      if (!id.startsWith(RESOLVED_MODULE_ID)) return; // null

      const searchParameters = new URL(id).searchParams;
      const filepath = searchParameters.get('location') ?? undefined;

      if (filepath === undefined) {
        this.error('[vite-plugin-file-meta] Missing id location.');

        // @ts-expect-error only for type narrowing
        return;
      }

      const locationRelativeToCwd = filepath.replace(`${cwd}/`, '');
      const owners = codeowners.getOwners(locationRelativeToCwd);

      const dirpath = path.dirname(filepath);
      const filename = path.basename(filepath);
      const dirname = dirpath.split('/').at(-1);
      const location = dirpath.replace(`${cwd}/`, '');
      const extension = path.extname(filename);

      return {
        // Doesn't really do anything for this kind of module, but anyways [^_^]
        moduleSideEffects: false,

        //  - dirname   - name of directory
        //  - filename  - name of file
        //  - dirpath   - absolute path to directory
        //  - filepath  - absolute path to file
        //  - directory - relative path to directory
        //  - location  - relative path to file
        //  - extension - extension of the file
        code: `
          export const dirname = ${JSON.stringify(dirname)};
          export const filename = ${JSON.stringify(filename)};
          export const dirpath = ${JSON.stringify(dirpath)};
          export const filepath = ${JSON.stringify(filepath)};
          export const directory = ${JSON.stringify(location)};
          export const location = ${JSON.stringify(locationRelativeToCwd)};
          export const extension = ${JSON.stringify(extension)};

          export const codeowners = ${JSON.stringify(owners)};

          // export const location = {
          //   absolute: ${JSON.stringify(filepath)},
          //   relative: ${JSON.stringify(locationRelativeToCwd)},
          // };
          // export const owners = {
          //   codeowners: ${JSON.stringify(owners)},
          // };
        `,
      };
    },
  };
};
