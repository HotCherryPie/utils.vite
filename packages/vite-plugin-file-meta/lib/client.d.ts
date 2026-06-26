declare module 'virtual:file-meta' {
  export const location: string;
  export const owners: {
    readonly codeowners: readonly string[];
  };
}
