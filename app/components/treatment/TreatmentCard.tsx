import {
  AspectRatio,
  Badge,
  Card,
  Divider,
  Group,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {Link} from '@remix-run/react';
import {Image, Money, parseGid} from '@shopify/hydrogen';
import {type ProductItemFragment} from 'storefrontapi.generated';
import {useVariantUrl} from '~/utils';
import classes from './TreatmentCard.module.css';

export function TreatmentCard({
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
      key={product.handle}
      withBorder
      radius="lg"
      className={classes.card}
      component={Link}
      to={`./${product.handle}-${parseGid(product.id).id}`}
    >
      {product.featuredImage && (
        <AspectRatio ratio={1920 / 1080}>
          <Image
            data={product.featuredImage}
            aspectRatio="1/1"
            sizes="(min-width: 45em) 20vw, 50vw"
          />
        </AspectRatio>
      )}
      <Title
        order={3}
        className={classes.title}
        mt={product.featuredImage ? 'sm' : undefined}
        mb={rem(4)}
        fw={500}
      >
        {product.title}
      </Title>
      <Text c="dimmed" size="xs" tt="uppercase" fw={400} lineClamp={2}>
        {product.description || 'ingen beskrivelse'}
      </Text>
      <Card.Section mt="md" mb="md">
        <Divider />
      </Card.Section>

      <Group justify="space-between">
        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
          tid fra 1 time
        </Text>

        <Badge variant="light" color="gray" size="lg">
          <Money data={product.priceRange.minVariantPrice} />
        </Badge>
      </Group>
    </Card>
  );
}
