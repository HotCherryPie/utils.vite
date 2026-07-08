/* eslint-disable unicorn/no-this-outside-of-class */
import childProcess from 'node:child_process';

import type { Plugin } from 'vite';

const MODULE_ID = 'virtual:env-meta';
const RESOLVED_MODULE_ID = `\0${MODULE_ID}`;

const getBranch = () =>
  new Promise<string | undefined>((resolve, reject) => {
    childProcess.exec(
      /* Not `git branch --show-current` because
       *  - If no repo is present, prints unborn branch name, e.g. main or master
       *  - On detached HEAD prints nothing (used command will print HEAD)
       */
      // eslint-disable-next-line sonar/no-os-command-from-path
      'git rev-parse --abbrev-ref HEAD',
      (error, stdout) => {
        if (error) {
          reject(error);
          return;
        }

        const name = stdout.trim();

        if (name.length === 0) {
          resolve(undefined);
          return;
        }

        resolve(name);
      },
    );
  });

export const plugin: () => Plugin = () => {
  let branch: string | undefined;

  return {
    name: 'env-meta',
    enforce: 'pre',

    async configResolved() {
      try {
        branch = await getBranch();
      } catch (error) {
        const message = error instanceof Error ? error.message : '';
        this.error(`Cannot resolve git branch: ${message}`);
      }
    },

    resolveId(source, importer) {
      if (source !== MODULE_ID) return; // null

      if (!importer) {
        this.error(`"${MODULE_ID}" must be imported from a real file.`);

        // @ts-expect-error only for type narrowing
        return; // null
      }

      return RESOLVED_MODULE_ID;
    },

    load(id) {
      if (!id.startsWith(RESOLVED_MODULE_ID)) return; // null

      return {
        // Doesn't really do anything for this kind of module, but anyways [^_^]
        moduleSideEffects: false,
        code: `
          export const branch = ${JSON.stringify(branch)}
        `,
      };
    },
  };
};
