import {Await, useLoaderData, type MetaFunction} from '@remix-run/react';
import type {CartQueryDataReturn} from '@shopify/hydrogen';
import {CartForm} from '@shopify/hydrogen';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Suspense} from 'react';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';
import {CartMain} from '~/components/Cart';
import {Wrapper} from '~/components/Wrapper';
import {METAFIELD_QUERY} from '~/data/fragments';
import {useRootLoaderData} from '~/root';

export const meta: MetaFunction = () => {
  return [{title: `Hydrogen | Cart`}];
};

export async function action({request, context}: ActionFunctionArgs) {
  const {cart} = context;

  const formData = await request.formData();

  const {action, inputs} = CartForm.getFormInput(formData);

  if (!action) {
    throw new Error('No action provided');
  }

  let status = 200;
  let result: CartQueryDataReturn;

  switch (action) {
    case CartForm.ACTIONS.LinesAdd:
      result = await cart.addLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesUpdate:
      result = await cart.updateLines(inputs.lines);
      break;
    case CartForm.ACTIONS.LinesRemove:
      result = await cart.removeLines(inputs.lineIds);
      break;
    case CartForm.ACTIONS.DiscountCodesUpdate: {
      const formDiscountCode = inputs.discountCode;

      // User inputted discount code
      const discountCodes = (
        formDiscountCode ? [formDiscountCode] : []
      ) as string[];

      // Combine discount codes already applied on cart
      discountCodes.push(...inputs.discountCodes);

      result = await cart.updateDiscountCodes(discountCodes);
      break;
    }
    case CartForm.ACTIONS.BuyerIdentityUpdate: {
      result = await cart.updateBuyerIdentity({
        ...inputs.buyerIdentity,
      });
      break;
    }
    default:
      throw new Error(`${action} cart action is not defined`);
  }

  const cartId = result.cart.id;
  const headers = cart.setCartId(result.cart.id);
  const {cart: cartResult, errors} = result;

  const redirectTo = formData.get('redirectTo') ?? null;
  if (typeof redirectTo === 'string') {
    status = 303;
    headers.set('Location', redirectTo);
  }

  headers.append('Set-Cookie', await context.session.commit());

  return json(
    {
      cart: cartResult,
      errors,
      analytics: {
        cartId,
      },
    },
    {status, headers},
  );
}

export async function loader({context, request}: LoaderFunctionArgs) {
  const {metaobject: visualTeaser} = await context.storefront.query(
    METAFIELD_QUERY,
    {
      variables: {
        handle: 'cart',
        type: 'visual_teaser',
      },
    },
  );

  return json({visualTeaser});
}

export default function Cart() {
  const rootData = useRootLoaderData();
  const {visualTeaser} = useLoaderData<typeof loader>();
  const cartPromise = rootData.cart;

  return (
    <>
      <VisualTeaser component={visualTeaser} />

      <Wrapper>
        <Suspense fallback={<p>Henter indkøbskurv ...</p>}>
          <Await
            resolve={cartPromise}
            errorElement={<div>An error occurred</div>}
          >
            {(cart) => {
              return <CartMain layout="page" cart={cart} />;
            }}
          </Await>
        </Suspense>
      </Wrapper>
    </>
  );
}
