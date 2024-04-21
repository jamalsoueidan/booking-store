import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Wrapper} from '~/components/Wrapper';
import {PAGE_QUERY} from '~/data/fragments';
import {useComponents} from '~/lib/use-components';

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

  return json(
    {page},
    {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=3600',
      },
    },
  );
}

export default function Page() {
  const {page} = useLoaderData<typeof loader>();

  const markup = useComponents(page.components);
  const header = useComponents(page.options);

  return (
    <>
      {header}
      {page.body.length > 1 && (
        <Wrapper>
          <main dangerouslySetInnerHTML={{__html: page.body}} />
        </Wrapper>
      )}
      {markup}
    </>
  );
}
