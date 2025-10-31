import type { Config } from 'svgo';

interface SvgLoaderOptionsFiles {
  svgo?: boolean | Config;
  defaultImport?: 'url' | 'component';
  wrapperComponentPath?: string;
}

interface Override {
  files: string | string[];
  options: SvgLoaderOptionsFiles;
}

export interface SvgLoaderOptions extends SvgLoaderOptionsFiles {
  overrides?: Override[];
}
