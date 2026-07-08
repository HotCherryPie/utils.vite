declare module 'virtual:file-meta' {
  /**
   * Name of directory.
   *
   * @example "foo"
   */
  export const dirname: string;

  /**
   * Name of file.
   *
   * @example "bar.ts"
   */
  export const filename: string;

  /**
   * Absolute path to directory.
   *
   * @example "/Users/john/Documents/project/src/foo"
   */
  export const dirpath: string;

  /**
   * Absolute path to file.
   *
   * @example "/Users/john/Documents/project/src/foo/bar.ts"
   */
  export const filepath: string;

  /**
   * Relative path to directory.
   *
   * @example "src/foo"
   */
  export const directory: string;

  /**
   * Relative path to file.
   *
   * @example "src/foo/bar.ts"
   */
  export const location: string;

  /**
   * Extension of the file.
   *
   * @example ".ts"
   */
  export const extension: string;

  /**
   * Git codeowners of the file.
   *
   * @example ["@user-1", "@group/developers"]
   */
  export const codeowners: readonly string[];
}
