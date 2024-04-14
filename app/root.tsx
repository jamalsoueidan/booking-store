import {
  AppShell,
  Burger,
  Button,
  ColorSchemeScript,
  createTheme,
  Flex,
  Group,
  Image,
  MantineProvider,
  rem,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {ModalsProvider} from '@mantine/modals';

import '@mantine/carousel/styles.css';
import '@mantine/core/styles.css';
//import '@mantine/notifications/styles.css';
import '@mantine/tiptap/styles.css';

import {
  useDisclosure,
  useHeadroom,
  useMediaQuery,
  useWindowScroll,
} from '@mantine/hooks';
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useMatches,
  useRouteError,
  type ShouldRevalidateFunction,
} from '@remix-run/react';
import {useNonce} from '@shopify/hydrogen';
import {
  defer,
  type LoaderFunctionArgs,
  type SerializeFrom,
} from '@shopify/remix-oxygen';
import {Layout} from '~/components/Layout';
import favicon from './assets/favicon.svg';
import appStyles from './styles/app.css?url';
import logo from '/Artboard4.svg';

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
  const {storefront, customerAccount, cart} = context;
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

  return defer(
    {
      cart: cartPromise,
      footer: footerPromise,
      header: await headerPromise,
      isLoggedIn: isLoggedInPromise,
      publicStoreDomain,
    },
    {
      headers: {
        'Set-Cookie': await context.session.commit(),
      },
    },
  );
}

export default function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();
  const [opened, {toggle}] = useDisclosure();
  const pinned = useHeadroom({fixedAt: 120});
  const [scroll] = useWindowScroll();
  const isMobile = useMediaQuery('(max-width: 62em)');

  return (
    <html lang="en">
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
        <MantineProvider>
          <ModalsProvider>
            <AppShell
              header={{
                height: 70,
                collapsed: !pinned && !isMobile,
                offset: !!isMobile,
              }}
              navbar={{
                width: 300,
                breakpoint: 'sm',
                collapsed: {desktop: true, mobile: !opened},
              }}
              withBorder={false}
            >
              <AppShell.Header
                component={Flex}
                p="md"
                bg={scroll.y === 0 ? 'transparent' : 'white'}
              >
                <Group h="100%" miw="150px">
                  <Burger
                    opened={opened}
                    onClick={toggle}
                    hiddenFrom="sm"
                    size="sm"
                  />
                  <UnstyledButton component={Link} to="/">
                    <Title
                      order={1}
                      component={Flex}
                      lh="xs"
                      fz={rem(20)}
                      fw="500"
                      data-testid="logo-login"
                    >
                      ByS
                      <Image
                        src={logo}
                        alt="it's me"
                        h="auto"
                        w="8px"
                        mx="2px"
                      />
                      sters
                    </Title>
                  </UnstyledButton>
                </Group>
                <Flex
                  justify="center"
                  align="center"
                  visibleFrom="sm"
                  style={{flex: 1}}
                  h="100%"
                >
                  {data.header.menu?.items.map(({url, title}) => (
                    <NavLink key={url} to={new URL(url || '').pathname}>
                      {({isActive}) => (
                        <Button
                          radius="xl"
                          fz="md"
                          fw="500"
                          variant={
                            title.includes('skønhedskarriere')
                              ? 'filled'
                              : 'transparent'
                          }
                          color={
                            title.includes('skønhedskarriere')
                              ? '#8a60f6'
                              : 'black'
                          }
                        >
                          {title}
                        </Button>
                      )}
                    </NavLink>
                  ))}
                </Flex>
                <Flex
                  justify="flex-end"
                  align="center"
                  gap={0}
                  visibleFrom="sm"
                  miw="150px"
                >
                  login
                </Flex>
              </AppShell.Header>

              <AppShell.Navbar py="md" px={4}>
                x
              </AppShell.Navbar>

              <AppShell.Main py="md">
                <Outlet />
              </AppShell.Main>
            </AppShell>
          </ModalsProvider>
        </MantineProvider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const theme = createTheme({});
  const error = useRouteError();
  const rootData = useRootLoaderData();
  const nonce = useNonce();
  let errorMessage = 'Unknown error';
  let errorStatus = 500;

  if (isRouteErrorResponse(error)) {
    errorMessage = error?.data?.message ?? error.data;
    errorStatus = error.status;
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <html lang="en">
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
        <MantineProvider theme={theme}>
          <ModalsProvider>
            <Layout {...rootData}>
              <div className="route-error">
                <h1>Oops</h1>
                <h2>{errorStatus}</h2>
                {errorMessage && (
                  <fieldset>
                    <pre>{errorMessage}</pre>
                  </fieldset>
                )}
              </div>
            </Layout>
          </ModalsProvider>
        </MantineProvider>
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
      </body>
    </html>
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
