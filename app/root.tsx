import carouselStyles from '@mantine/carousel/styles.css?url';
import {
  ColorSchemeScript,
  DirectionProvider,
  MantineProvider,
} from '@mantine/core';
import coreStyles from '@mantine/core/styles.css?url';
import {ModalsProvider} from '@mantine/modals';
import {NavigationProgress, nprogress} from '@mantine/nprogress';
import nprogressStyles from '@mantine/nprogress/styles.css?url';

import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useMatches,
  useNavigation,
  useRouteError,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import {
  UNSTABLE_Analytics as Analytics,
  getShopAnalytics,
  useNonce,
} from '@shopify/hydrogen';
import {
  defer,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@shopify/remix-oxygen';
import {useEffect, type ReactNode} from 'react';
import favicon from './assets/favicon.svg';
import {CustomAnalytics} from './components/CustomAnalytics';
import {LayoutWrapper} from './components/LayoutWrapper';
import {PAGE_QUERY} from './routes/pages.$handle';
import appStyles from './styles/app.css?url';

/**
 * This is important to avoid re-fetching root queries on sub-navigations
 */
export const shouldRevalidate: ShouldRevalidateFunction = ({
  formMethod,
  currentUrl,
  nextUrl,
}) => {
  // revalidate when a mutation is performed e.g add to cart, login...
  if (formMethod && formMethod !== 'GET') {
    return true;
  }

  // revalidate when manually revalidating via useRevalidator
  if (currentUrl.toString() === nextUrl.toString()) {
    return true;
  }

  return false;
};

export function links() {
  return [
    {rel: 'stylesheet', href: appStyles},
    {rel: 'stylesheet', href: carouselStyles},
    {rel: 'stylesheet', href: coreStyles},
    {rel: 'stylesheet', href: nprogressStyles},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
}

/**
 * Access the result of the root loader from a React component.
 */
export const useRootLoaderData = () => {
  const [root] = useMatches();
  return root?.data as SerializeFrom<typeof loader>;
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront, customerAccount, cart, env} = context;
  const publicStoreDomain = context.env.PUBLIC_STORE_DOMAIN;

  const isLoggedInPromise = customerAccount.isLoggedIn();
  const cartPromise = cart.get();

  // defer the footer query (below the fold)
  const footerPromise = storefront.query(FOOTER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      footerMenuHandle: 'footer', // Adjust to your footer menu handle
    },
  });

  // await the header query (above the fold)
  const headerPromise = storefront.query(HEADER_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      headerMenuHandle: 'main-menu', // Adjust to your header menu handle
    },
  });

  // await the header query (above the fold)
  const page = await storefront.query(PAGE_QUERY, {
    cache: storefront.CacheLong(),
    variables: {
      handle: 'global',
    },
  });

  return defer({
    cart: cartPromise,
    page,
    footer: footerPromise,
    header: await headerPromise,
    isLoggedIn: isLoggedInPromise,
    publicStoreDomain,
    shop: getShopAnalytics({
      storefront,
      publicStorefrontId: env.PUBLIC_STOREFRONT_ID,
    }),
    consent: {
      checkoutDomain: env.PUBLIC_CHECKOUT_DOMAIN,
      storefrontAccessToken: env.PUBLIC_STOREFRONT_API_TOKEN,
    },
    language: storefront.i18n.language,
  });
}

export function Layout({children}: {children: ReactNode}) {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();
  const location = useLocation();
  const path = location.pathname;
  const {state} = useNavigation();

  useEffect(() => {
    if (state === 'loading' || state === 'submitting') {
      nprogress.start();
    } else {
      nprogress.complete();
    }
  }, [state]);

  const pathNotBooking = path.includes('/artist')
    ? !path.includes('/treatment')
    : true;

  return (
    <html lang="en" dir={data.language === 'AR' ? 'rtl' : 'ltr'}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <Meta />
        <Links />
        <ColorSchemeScript />
      </head>
      <body>
        <DirectionProvider detectDirection>
          <MantineProvider>
            <NavigationProgress />
            <ModalsProvider>
              {!path.includes('/account') && pathNotBooking && data?.cart ? (
                <Analytics.Provider
                  cart={data.cart}
                  shop={data.shop}
                  consent={data.consent}
                  customData={{foo: 'bar'}}
                >
                  <LayoutWrapper>{children}</LayoutWrapper>
                  <CustomAnalytics />
                </Analytics.Provider>
              ) : (
                children
              )}
            </ModalsProvider>
          </MantineProvider>
        </DirectionProvider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="route-error">
      <h1>Oops</h1>
      <h2>{errorStatus}</h2>
      {errorMessage && (
        <fieldset>
          <pre>{errorMessage}</pre>
        </fieldset>
      )}
    </div>
  );
}

const MENU_FRAGMENT = `#graphql
  fragment MenuItem on MenuItem {
    id
    resourceId
    tags
    title
    type
    url
  }
  fragment ChildMenuItem on MenuItem {
    ...MenuItem
  }
  fragment ParentMenuItem on MenuItem {
    ...MenuItem
    items {
      ...ChildMenuItem
    }
  }
  fragment Menu on Menu {
    id
    items {
      ...ParentMenuItem
    }
  }
` as const;

const HEADER_QUERY = `#graphql
  fragment Shop on Shop {
    id
    name
    description
    primaryDomain {
      url
    }
    brand {
      logo {
        image {
          url
        }
      }
    }
  }
  query Header(
    $country: CountryCode
    $headerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    shop {
      ...Shop
    }
    menu(handle: $headerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;

const FOOTER_QUERY = `#graphql
  query Footer(
    $country: CountryCode
    $footerMenuHandle: String!
    $language: LanguageCode
  ) @inContext(language: $language, country: $country) {
    menu(handle: $footerMenuHandle) {
      ...Menu
    }
  }
  ${MENU_FRAGMENT}
` as const;
