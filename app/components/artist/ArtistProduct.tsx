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
import {type AccountServicesProductsQuery} from 'storefrontapi.generated';
import {type CustomerProductList} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';
import classes from './ArtistProduct.module.css';

export type ArtistProductProps = {
  product: AccountServicesProductsQuery['products']['nodes'][number];
  services: CustomerProductList[];
};

export function ArtistProduct({product, services}: ArtistProductProps) {
  const artistService = services.find(({productId}) => {
    return productId.toString() === parseGid(product.id).id;
  });

  const artistVariant = product.variants.nodes.find(({id}) => {
    return parseGid(id).id === artistService?.variantId.toString();
  });

  return (
    <Card
      key={product.handle}
      withBorder
      radius="lg"
      className={classes.card}
      component={Link}
      to={`treatment/${product.handle}`}
    >
      <AspectRatio ratio={1920 / 1080}>
        <Image
          data={product.images.nodes[0]}
          aspectRatio="1/1"
          sizes="(min-width: 45em) 20vw, 50vw"
        />
      </AspectRatio>
      <Title order={3} className={classes.title} mt="sm" mb={rem(4)}>
        {product.title}
      </Title>
      <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
        {artistService?.description || 'ingen beskrivelse'}
      </Text>
      <Card.Section mt="md" mb="md">
        <Divider />
      </Card.Section>

      <Group justify="space-between">
        <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
          {durationToTime(artistService?.duration ?? 0)}
        </Text>

        {artistVariant ? (
          <Badge variant="light" color="gray" size="lg">
            <Money data={artistVariant.price} />
          </Badge>
        ) : null}
      </Group>
    </Card>
  );
}
