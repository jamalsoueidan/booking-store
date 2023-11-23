import {Badge, Card, Group, Text} from '@mantine/core';
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
            aspectRatio="1/3"
            data={product.featuredImage}
            loading={loading}
            sizes="(min-width: 45em) 400px, 100vw"
          />
        </Card.Section>
      )}

      <Group justify="space-between" mt="md">
        <div>
          <Text fw={500}>{product.title}</Text>
          <Text fz="xs" c="dimmed">
            {product.handle}
          </Text>
        </div>
        <Badge variant="outline">
          <Money data={product.priceRange.minVariantPrice} />
        </Badge>
      </Group>
    </Card>
  );
}
