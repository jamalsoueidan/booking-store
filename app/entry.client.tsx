import {RemixBrowser} from '@remix-run/react';
import {startTransition, StrictMode} from 'react';
import {hydrateRoot} from 'react-dom/client';

import i18n from 'i18next';
import {I18nextProvider} from 'react-i18next';
import {initI18Next} from './i18n';

initI18Next(i18n)
  .then(() => {
    return startTransition(() => {
      hydrateRoot(
        document,
        <StrictMode>
          <I18nextProvider i18n={i18n}>
            <RemixBrowser />
          </I18nextProvider>
        </StrictMode>,
      );
    });
  })
  .catch((error: any) => console.error(error));
