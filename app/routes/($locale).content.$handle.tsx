import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Icon12Hours} from '@tabler/icons-react';
import {type ComponentItemFragment} from 'storefrontapi.generated';
import {Features, type FeatureProps} from '~/components/Features';
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

  const markup = components.map((c: ComponentItemFragment) => {
    if (c.type === 'hero') {
      return <WrapperHeroTitle key={c.id} component={c} />;
    } else if (c.type === 'features') {
      return <WrapperFeatures key={c.id} component={c} />;
    }
    return <>unknown {c.type}</>;
  });

  return <>{markup}</>;
}

function WrapperHeroTitle({component}: {component: ComponentItemFragment}) {
  const title = component.fields.find((c) => c.key === 'title');
  const subtitle = component.fields.find((c) => c.key === 'subtitle');

  return (
    <HeroTitle bg="grape.1" subtitle={subtitle?.value} overtitle="">
      {title?.value}
    </HeroTitle>
  );
}

function WrapperFeatures({component}: {component: ComponentItemFragment}) {
  const hero = component.fields.find((c) => c.key === 'hero')?.reference
    ?.fields;
  const references = component.fields.find((c) => c.key === 'items')?.references
    ?.nodes;

  if (!hero) {
    return null;
  }

  const title = hero.find((i) => i.key === 'title')?.value || '';
  const subtitle = hero.find((i) => i.key === 'subtitle')?.value || '';

  const items: Array<FeatureProps> =
    references?.map((item) => {
      const title = item.fields.find((f) => f.key === 'title')?.value || '';
      const description =
        item.fields.find((f) => f.key === 'description')?.value || '';

      return {
        icon: Icon12Hours,
        title,
        description,
      };
    }) || [];

  return <Features title={title} subtitle={subtitle} items={items} />;
}

export const COMPONENT_ITEM_FRAGMENT = `#graphql
  fragment ComponentItem on Metaobject {
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
` as const;

export const CONTENT_ITEM_FRAGMENT = `#graphql
  ${COMPONENT_ITEM_FRAGMENT}
  fragment MetafieldItem on Metaobject {
    fields {
      value
      key
      references(first: 10) {
        nodes {
          ...ComponentItem
        }
      }
    }
  }
` as const;

const CONTENT_QUERY = `#graphql
  ${CONTENT_ITEM_FRAGMENT}
  query Content(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    metaobject(handle: {handle: $handle, type: "content"}) {
      ...MetafieldItem
    }
  }
` as const;
