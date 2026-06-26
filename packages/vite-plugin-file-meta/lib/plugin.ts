import { pathToFileURL } from 'node:url';

import * as glCodeowners from '@gitlab/codeowners';
import path from 'pathe';
import type { Plugin } from 'vite';
import { normalizePath } from 'vite';

export const plugin: () => Promise<Plugin> = async () => {
  const PUBLIC_ID = 'virtual:file-meta';
  const RESOLVED_PREFIX = `\0${PUBLIC_ID}`;
  const cwd = normalizePath(process.cwd());

  const codeowners = await glCodeowners.parse(
    path.resolve(cwd, '.gitlab/CODEOWNERS'),
  );

  return {
    name: 'vite-plugin-file-meta',
    enforce: 'pre',

    resolveId(source, importer) {
      if (source !== PUBLIC_ID) return; // null

      if (!importer) {
        this.error(`"${PUBLIC_ID}" must be imported from a real file.`);

        // @ts-expect-error only for type narrowing
        return; // null
      }

      // Strips query and hash from path.
      const location = pathToFileURL(normalizePath(importer)).pathname;

      return `${RESOLVED_PREFIX}?location=${encodeURIComponent(location)}`;
    },

    load(id) {
      if (!id.startsWith(RESOLVED_PREFIX)) return; // null

      const queryIndex = id.indexOf('?');
      const query = queryIndex === -1 ? '' : id.slice(queryIndex + 1);
      const searchParameters = new URLSearchParams(query);

      const location = searchParameters.get('location') ?? undefined;
      const locationRelativeToCwd = location?.replace(`${cwd}/`, '');
      const owners =
        locationRelativeToCwd === undefined ?
          []
        : codeowners.getOwners(locationRelativeToCwd);

      return {
        code: `
          export const location = ${JSON.stringify(locationRelativeToCwd)};
          export const owners = {
            codeowners: ${JSON.stringify(owners)},
          };
        `,
        map: { mappings: '' },
      };
    },
  };
};
