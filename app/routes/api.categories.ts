import {json, type LoaderFunctionArgs} from '@remix-run/server-runtime';

export async function loader({context, request}: LoaderFunctionArgs) {
  const query = `
  {
  collections(first: 250, query: "-Alle AND -Subcategory AND -User") {
    nodes {
      id
      title
      description
      ruleSet {
        rules {
          column
          condition
        }
      }
    }
  }
}
  `;

  const response = await fetch(
    `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2024-04/graphql.json`,
    {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': context.env.PRIVATE_API_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
      }),
    },
  );

  const tags = await response.json();

  return json(tags);
}
