/* eslint-disable unicorn/no-this-outside-of-class */
import * as glCodeowners from '@gitlab/codeowners';
import path from 'pathe';
import type { Plugin } from 'vite';
import { normalizePath } from 'vite';

const MODULE_ID = 'virtual:file-meta';
const RESOLVED_MODULE_ID = `\0${MODULE_ID}`;

// eslint-disable-next-line sonar/super-linear-regex
const removeQueryAndHashFromPath = (it: string) => it.replace(/[?#].*$/, '');

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
      const location = searchParameters.get('location') ?? undefined;
      const locationRelativeToCwd = location?.replace(`${cwd}/`, '');
      const owners =
        locationRelativeToCwd === undefined ?
          []
        : codeowners.getOwners(locationRelativeToCwd);

      return {
        // Doesn't really do anything for this kind of module, but anyways [^_^]
        moduleSideEffects: false,

        // TODO: add
        //  - dirname   - name of directory
        //  - filename  - name of file
        //  - dirpath   - absolute path to directory
        //  - filepath  - absolute path to file
        //  - directory - relative path to directory
        //  - location  - relative path to file
        //  - extension
        code: `
          export const location = {
            absolute: ${JSON.stringify(location)},
            relative: ${JSON.stringify(locationRelativeToCwd)},
          };
          export const owners = {
            codeowners: ${JSON.stringify(owners)},
          };
        `,
      };
    },
  };
};
