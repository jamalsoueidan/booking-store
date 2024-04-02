import {Badge, Card, Stack, Text} from '@mantine/core';
import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {type ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';
import classes from './ProductCard.module.css';

export function ProductCard({
  product,
  loading,
}: {
  product: ProductItemFragment;
  loading?: 'eager' | 'lazy';
}) {
  const variant = product.variants.nodes[0];
  const variantUrl = useVariantUrl(product.handle, variant.selectedOptions);

  return (
    <Card
      withBorder
      radius="md"
      className={classes.card}
      component={Link}
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      {product.featuredImage && (
        <Card.Section className={classes.imageSection}>
          <Image
            alt={product.featuredImage.altText || product.title}
            aspectRatio="1/2"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        </Card.Section>
      )}

      <Stack mt="md" gap="xs">
        <Text fw={500}>{product.title}</Text>
        <Badge variant="outline" c="green">
          <Money data={product.priceRange.minVariantPrice} />
        </Badge>
      </Stack>
    </Card>
  );
}
