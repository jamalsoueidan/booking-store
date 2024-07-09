export function updateCustomerTag({
  env,
  customerId,
  tags,
}: {
  env: Env;
  customerId: string;
  tags: string;
}) {
  return fetch(
    `https://${env.PUBLIC_STORE_DOMAIN}/admin/api/2024-01/customers/${customerId}.json`,
    {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': env.PRIVATE_API_ACCESS_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customer: {
          id: customerId,
          tags,
        },
      }),
    },
  );
}
