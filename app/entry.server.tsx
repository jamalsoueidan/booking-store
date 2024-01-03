import {RemixServer} from '@remix-run/react';
import {createContentSecurityPolicy} from '@shopify/hydrogen';
import type {EntryContext} from '@shopify/remix-oxygen';
import isbot from 'isbot';
import {renderToReadableStream} from 'react-dom/server';

export default async function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext,
) {
  const {nonce, header, NonceProvider} = createContentSecurityPolicy();

  const body = await renderToReadableStream(
    <NonceProvider>
      <RemixServer context={remixContext} url={request.url} />
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
  const newHeader = header.replace(
    'https://shopify.com',
    'https://shopify.com https://www.google.com notify.bugsnag.com https://js.hcaptcha.com https://newassets.hcaptcha.com https://api.hcaptcha.com https://api2.hcaptcha.com shopify-chat.shopifyapps.com',
  );
  responseHeaders.set('Content-Security-Policy', newHeader);

  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode,
  });
}
