import {useLoaderData, type MetaFunction} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Headless} from '~/components/blocks/Headless';
import {VisualTeaser} from '~/components/blocks/VisualTeaser';
import {Wrapper} from '~/components/Wrapper';
import {ACCORDION_FRAGMENT} from '~/graphql/headless/Accordion';
import {BACKGROUND_IMAGE_FRAGMENT} from '~/graphql/headless/BackgroundImage';
import {BUTTON_FRAGMENT} from '~/graphql/headless/Button';
import {CALL_TO_ACTION_FRAGMENT} from '~/graphql/headless/CallToAction';
import {CARD_MEDIA_FRAGMENT} from '~/graphql/headless/CardMedia';
import {FAQ_FRAGMENT} from '~/graphql/headless/Faq';
import {FEATURES_FRAGMENT} from '~/graphql/headless/Features';
import {HELP_FRAGMENT} from '~/graphql/headless/Help';
import {IMAGE_FRAGMENT} from '~/graphql/headless/Image';
import {IMAGE_GRID_WITH_HEADER_FRAGMENT} from '~/graphql/headless/ImageWithGridHeader';
import {MAPS_FRAGMENT} from '~/graphql/headless/Maps';
import {OVERLAY_FRAGMENT} from '~/graphql/headless/Overlay';
import {SIDE_BY_SIDE_FRAGMENT} from '~/graphql/headless/SideBySide';
import {VISUAL_TEASER_FRAGMENT} from '~/graphql/headless/VisualTeaser';

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

  return (
    <>
      <VisualTeaser data={page?.header?.reference} />

      <Headless components={page.options} />
      {page.body.length > 1 && (
        <Wrapper>
          <main dangerouslySetInnerHTML={{__html: page.body}} />
        </Wrapper>
      )}
      <Headless components={page.components} />
    </>
  );
}

const PAGE_FRAGMENT = `#graphql
  #tags
  ${IMAGE_FRAGMENT}
  ${BACKGROUND_IMAGE_FRAGMENT}
  ${BUTTON_FRAGMENT}
  ${OVERLAY_FRAGMENT}

  #fragments
  ${ACCORDION_FRAGMENT}
  ${CALL_TO_ACTION_FRAGMENT}
  ${CARD_MEDIA_FRAGMENT}
  ${FEATURES_FRAGMENT}
  ${HELP_FRAGMENT}
  ${MAPS_FRAGMENT}
  ${SIDE_BY_SIDE_FRAGMENT}
  ${VISUAL_TEASER_FRAGMENT}
  ${FAQ_FRAGMENT}
  ${IMAGE_GRID_WITH_HEADER_FRAGMENT}


  fragment Page on Page {
    id
    title
    body
    seo {
      description
      title
    }
    components: metafield(namespace: "custom", key: "components") {
      references(first: 10) {
        nodes {
          ...Accordion
          ...CallToAction
          ...CardMedia
          ...Features
          ...Help
          ...Maps
          ...SideBySide
          ...VisualTeaser
          ...Faq
          ...ImageGridWithHeader
        }
      }
    }

    header: metafield(namespace: "booking", key: "header") {
      reference {
        ...Accordion
        ...CallToAction
        ...CardMedia
        ...Features
        ...Help
        ...Maps
        ...SideBySide
        ...VisualTeaser
        ...Faq
        ...ImageGridWithHeader
      }
    }

    options: metafield(namespace: "custom", key: "options") {
      references(first: 10) {
        nodes {
          ...Accordion
          ...CallToAction
          ...CardMedia
          ...Features
          ...Help
          ...Maps
          ...SideBySide
          ...VisualTeaser
          ...Faq
          ...ImageGridWithHeader
        }
      }
    }
  }
` as const;

export const PAGE_QUERY = `#graphql
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
