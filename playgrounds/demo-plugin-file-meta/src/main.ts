import { location, owners } from 'virtual:file-meta';

import './style.css';

// eslint-disable-next-line ts/no-non-null-assertion
document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div style="font-size: 24px;">
    <p>
      Hello form <code>${location.absolute}</code>
    </p>
    <p>
      Owners are <code>${owners.codeowners.join(', ')}</code>
    </p>
  </div>
`;
