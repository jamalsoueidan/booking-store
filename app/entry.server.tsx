import {RemixServer} from '@remix-run/react';
import {type AppLoadContext} from '@remix-run/server-runtime';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import type {EntryContext} from '@shopify/remix-oxygen';
import i18n from 'i18next';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';
import {I18nextProvider} from 'react-i18next';
import {initI18Next} from './i18n';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
  context: AppLoadContext,
) {
  await initI18Next(i18n, context.storefront.i18n.language);

  const {nonce, NonceProvider} = createContentSecurityPolicy({
    shop: {
      checkoutDomain: context.env.PUBLIC_CHECKOUT_DOMAIN,
      storeDomain: context.env.PUBLIC_STORE_DOMAIN,
    },
    connectSrc: [
      "'self'",
      'cdn.shopify.com',
      'monorail-edge.shopifysvc.com',
      'shopify-chat.shopifyapps.com', // Shopify Inbox
    ],
  });

  const body = await renderToReadableStream(
    <NonceProvider>
      <I18nextProvider i18n={i18n}>
        <RemixServer context={remixContext} url={request.url} />
      </I18nextProvider>
    </NonceProvider>,
    {
      nonce,
      signal: request.signal,
      onError(error) {
        // eslint-disable-next-line no-console
        console.error(error);
        responseStatusCode = 500;
      },
    },
  );

  if (isbot(request.headers.get('user-agent'))) {
    await body.allReady;
  }

  responseHeaders.set('Content-Type', 'text/html');

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
