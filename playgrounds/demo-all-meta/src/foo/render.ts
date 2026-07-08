import { branch } from 'virtual:env-meta';
import * as fileMeta from 'virtual:file-meta';

export const render = () => {
  // eslint-disable-next-line ts/no-non-null-assertion
  document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div style="font-size:24px; display:flex; flex-direction:column; gap:8px;">
      <h3>File Meta</h3>
      ${Object.entries(fileMeta)
        .map(([k, v]) => `<div>${k}: <code>${v}</code></div>`)
        .join('\n')}

      <h3>Env Meta</h3>
      <div>Branch <code>${branch ?? ''}</code></div>
    </div>
  `;
};
