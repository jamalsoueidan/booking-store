import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';
import {professions, skills} from '~/components/ProfessionButton';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {payload} = await getBookingShopifyApi().customerGet(customerId);

  const username = payload.username;

  const {storefront} = context;

  const {metaobject: user} = await storefront.query(USER_METAOBJECT_QUERY, {
    variables: {
      username: payload.username,
    },
    cache: context.storefront.CacheShort(),
  });

  if (!user) {
    throw new Response(`${username} not found`, {
      status: 404,
    });
  }

  const {collection} = await context.storefront.query(USER_PRODUCTS, {
    variables: {
      handle: username,
      filters: [
        {
          productMetafield: {
            namespace: 'system',
            key: 'type',
            value: 'product',
          },
        },
        {
          productMetafield: {
            namespace: 'booking',
            key: 'hide_from_profile',
            value: 'false',
          },
        },
      ],
    },
    cache: context.storefront.CacheNone(),
  });

  const response = await getBookingShopifyApi().openAIProfile({
    professions: Object.keys(professions).filter((key) => key !== 'all'),
    skills: Object.keys(skills),
    user,
    products: collection?.products.nodes || [],
  });

  return json(response.payload);
}

const USER_PRODUCTS = `#graphql
  query UserProducts(
    $handle: String!
    $country: CountryCode
    $language: LanguageCode
    $filters: [ProductFilter!] = {}
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      products(first: 20, sortKey: TITLE, filters: $filters) {
        nodes {
          title
          descriptionHtml
          productType
        }
      }
    }
  }
` as const;

const USER_METAOBJECT_QUERY = `#graphql
  query UserMetaobject(
    $username: String!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    metaobject(handle: {handle: $username, type: "user"}) {
      fullname: field(key: "fullname") {
        value
      }
      schedules: field(key: "schedules") {
        references(first: 4) {
          nodes {
            ...on Metaobject {
              id
              handle
              name: field(key: "name") {
                value
              }
              slots: field(key: "slots") {
                value
              }
            }
          }
        }
      }
      locations: field(key: "locations") {
        references(first: 4) {
          nodes {
            ...on Metaobject {
              id
              handle
              locationType: field(key: "location_type") {
                value
              }
              name: field(key: "name") {
                value
              }
              fullAddress: field(key: "full_address") {
                value
              }
              city: field(key: "city") {
                value
              }
              country: field(key: "country") {
                value
              }
              distanceForFree: field(key: "distance_for_free") {
                value
              }
              distanceHourlyRate: field(key: "distance_hourly_rate") {
                value
              }
              fixedRatePerKm: field(key: "fixed_rate_per_km") {
                value
              }
              minDriveDistance: field(key: "min_drive_distance") {
                value
              }
              maxDriveDistance: field(key: "max_drive_distance") {
                value
              }
              startFee: field(key: "start_fee") {
                value
              }
              geoLocation: field(key: "geo_location") {
                value
              }
            }
          }
        }
      }
    }
  }
` as const;
