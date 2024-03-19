import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {
  WrapperCardMedia,
  WrapperFaq,
  WrapperFeatures,
  WrapperHelp,
  WrapperHeroTitle,
  WrapperMaps,
  WrapperSideBySide,
} from '~/components/DynamicComponents';

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
      return <WrapperFaq key={c.id} component={c} />;
    } else if (c.type === 'maps') {
      return <WrapperMaps key={c.id} component={c} />;
    } else if (c.type === 'card_media') {
      return <WrapperCardMedia key={c.id} component={c} />;
    } else if (c.type === 'side_by_side') {
      return <WrapperSideBySide key={c.id} component={c} />;
    } else if (c.type === 'help') {
      return <WrapperHelp key={c.id} component={c} />;
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

const PAGE_FRAGMENT = `#graphql
  fragment PageComponentMediaImage on MediaImage {
    id
    image {
      url
      width
      height
    }
  }

  fragment PageComponentMetaobject on Metaobject {
    id
    type
    fields {
      key
      value
      type
      reference {
        ...PageComponentMediaImage
      }
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
        }
      }
      reference {
        ...PageComponentMediaImage
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

    options: metafield(namespace: "custom", key: "options") {
      reference {
        ...PageComponent
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
