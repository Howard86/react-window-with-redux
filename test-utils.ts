import { render } from '@testing-library/react';

import GlobalProviders from '@/components/GlobalProviders';

const customRender = (
  ui: JSX.Element,
  options: Parameters<typeof render>[1] = {},
) => render(ui, { wrapper: GlobalProviders, ...options });

export * from '@testing-library/react';

export { customRender as render };
