import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {HeroTitle} from '~/components/HeroTitle';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [{title: `BySisters | ${data?.title.value ?? ''}`}];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  if (!params.handle) {
    throw new Error('Missing page handle');
  }

  const {metaobject} = await context.storefront.query(CONTENT_QUERY, {
    variables: {
      handle: params.handle,
    },
  });

  if (!metaobject) {
    throw new Response('Not Found', {status: 404});
  }

  const components = metaobject.fields.find(
    (field) => field.key === 'components',
  )!.references?.nodes!;

  const title = metaobject.fields.find((field) => field.key === 'title')!;

  return json({title, components});
}

export default function Page() {
  const {components} = useLoaderData<typeof loader>();

  const markup = components.map((c) => {
    if (c.type === 'hero') {
      const title = c.fields.find((c) => c.key === 'title');
      const subtitle = c.fields.find((c) => c.key === 'subtitle');
      return (
        <HeroTitle
          bg="grape.1"
          key={c.id}
          subtitle={subtitle?.value}
          overtitle=""
        >
          {title?.value}
        </HeroTitle>
      );
    }
    return <>asd</>;
  });

  return <>{markup}</>;
}

const CONTENT_QUERY = `#graphql
  query Content(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    metaobject(handle: {handle: $handle, type: "content"}) {
      fields {
        value
        key
        references(first: 10) {
          nodes {
            ... on Metaobject {
              id
              type
              fields {
                value
                key
                references(first: 10) {
                  nodes {
                    ... on Metaobject {
                      id
                      fields {
                        value
                        key
                      }
                    }
                  }
                }
                reference {
                  ... on Metaobject {
                    id
                    type
                    fields {
                      value
                      key
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
` as const;
