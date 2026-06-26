declare module 'virtual:file-meta' {
  export const location: {
    readonly absolute: string;
    readonly relative: string;
  };
  export const owners: {
    readonly codeowners: readonly string[];
  };
}
