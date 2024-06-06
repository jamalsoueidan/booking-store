export async function getTags(domain: string, accesstoken: string) {
  const response = await fetch(
    `https://${domain}/admin/api/2024-01/blogs/105364226375/articles/tags.json?popular=5`,
    {
      method: 'GET',
      headers: {
        'X-Shopify-Access-Token': accesstoken,
        'Content-Type': 'application/json',
      },
    },
  );

  const {tags} = (await response.json()) as {tags: []};

  return splitTags(tags);
}

export function splitTags(tags: string[]) {
  return tags.reduce((acc, tag: string) => {
    const [category, ...rest] = tag.split('-');
    const value = rest.join('-');

    if (!acc[category]) {
      acc[category] = [];
    }

    acc[category].push(value);

    return acc;
  }, {} as Record<string, string[]>);
}
