import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  WrapperFeatures,
  WrapperHeroTitle,
} from '~/components/DynamicComponents';
import {CallToAction} from '~/components/metaobjects/CallToAction';
import {CardMedia} from '~/components/metaobjects/CardMedia';
import {Faq} from '~/components/metaobjects/Faq';
import {GoogleMap} from '~/components/metaobjects/GoogleMap';
import {Help} from '~/components/metaobjects/Help';
import {SideBySide} from '~/components/metaobjects/SideBySide';
import {PAGE_QUERY} from '~/data/fragments';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.page.title ?? ''}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {page} = await context.storefront.query(PAGE_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  if (!page) {
    throw new Response('Not Found', {status: 404});
  }

  return json({page});
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  const markup = page.components?.references?.nodes.map((c) => {
    if (c.type === 'features') {
      return <WrapperFeatures key={c.id} component={c} />;
    } else if (c.type === 'faq') {
      return <Faq key={c.id} component={c} />;
    } else if (c.type === 'maps') {
      return <GoogleMap key={c.id} component={c} />;
    } else if (c.type === 'card_media') {
      return <CardMedia key={c.id} component={c} />;
    } else if (c.type === 'side_by_side') {
      return <SideBySide key={c.id} component={c} />;
    } else if (c.type === 'help') {
      return <Help key={c.id} component={c} />;
    } else if (c.type === 'call_to_action') {
      return <CallToAction key={c.id} component={c} />;
    } else {
      return <>unknown {c.type}</>;
    }
  });

  return (
    <>
      <WrapperHeroTitle {...page} />
      {markup}
    </>
  );
}
