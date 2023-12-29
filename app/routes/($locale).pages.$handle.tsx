import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  WrapperFaq,
  WrapperFeatures,
  WrapperHeroTitle,
} from '~/components/DynamicComponents';
import {HeroTitle} from '~/components/HeroTitle';
import {Wrapper} from '~/components/Wrapper';

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
    if (c.type === 'hero') {
      return <WrapperHeroTitle key={c.id} component={c} />;
    } else if (c.type === 'features') {
      return <WrapperFeatures key={c.id} component={c} />;
    } else if (c.type === 'faq') {
      return <WrapperFaq key={c.id} component={c} />;
    }
    return <>unknown {c.type}</>;
  });

  return (
    <>
      <HeroTitle bg="gray.1" subtitle="" overtitle="">
        {page.title}
      </HeroTitle>

      {page.body && (
        <Wrapper>
          <main dangerouslySetInnerHTML={{__html: page.body}} />
        </Wrapper>
      )}

      {markup}
    </>
  );
}

const PAGE_FRAGMENT = `#graphql
  fragment PageComponentPage on Page {
    id
    title
    body
  }

  fragment PageComponentMetaobject on Metaobject {
    type
    fields {
      key
      value
    }
  }

  fragment PageComponent on Metaobject {
    id
    type
    fields {
      value
      type
      key
      references(first: 10) {
        nodes {
          ...PageComponentMetaobject
          ...PageComponentPage
        }
      }
    }
  }

  fragment Page on Page {
    id
    title
    body
    seo {
      description
      title
    }
    components: metafield(namespace: "custom", key: "components") {
      references(first: 5) {
        nodes {
          ...PageComponent
        }
      }
    }
  }
` as const;

const PAGE_QUERY = `#graphql
  ${PAGE_FRAGMENT}
  query Page(
    $language: LanguageCode,
    $country: CountryCode,
    $handle: String!
  )
  @inContext(language: $language, country: $country) {
    page(handle: $handle) {
      ...Page
    }
  }
` as const;
