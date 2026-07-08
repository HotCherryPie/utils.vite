import { branch } from 'virtual:env-meta';
import { location, owners } from 'virtual:file-meta';

import './style.css';

// eslint-disable-next-line ts/no-non-null-assertion
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="font-size:24px; display:flex; flex-direction:column; gap:8px;">
    <div>File <code>${location.relative}</code></div>
    <div>Owners <code>${owners.codeowners.join(', ')}</code></div>
    <div>Branch <code>${branch ?? ''}</code></div>
  </div>
`;
