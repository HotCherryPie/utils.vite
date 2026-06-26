import { base } from './eslint.config.base.js';

const toolingFiles = [
  '**/eslint.config.*',
  '**/prettier.config.*',
  '**/tsup.config.*',
  '**/vite.config.*',
];

const node = ['./*/lib/**/*'];

export default base({ node, tooling: toolingFiles });
