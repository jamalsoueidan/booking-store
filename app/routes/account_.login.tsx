import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({context}: LoaderFunctionArgs) {
  return context.customerAccount.login({
    uiLocales: context.storefront.i18n.language,
  });
}
