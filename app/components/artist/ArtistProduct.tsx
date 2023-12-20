import {Badge, Card, Text} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Link} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {type AccountServicesProductsQuery} from 'storefrontapi.generated';
import {type CustomerProductList} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';
import classes from './ArtistProduct.module.css';
import {ArtistServiceContent} from './ArtistServiceContent';

export type ArtistProductProps = {
  product: AccountServicesProductsQuery['products']['nodes'][number];
  services: CustomerProductList[];
};

export function ArtistProduct({product, services}: ArtistProductProps) {
  const isMobile = useMediaQuery('(max-width: 62em)');
  const artistService = services.find(({productId}) => {
    return productId.toString() === parseGid(product.id).id;
  });

  const leftSection = (
    <Text c="dimmed" fz={isMobile ? 11 : 'xs'} tt="uppercase" fw={700}>
      {durationToTime(artistService?.duration ?? 0)}
    </Text>
  );

  const rightSection = artistService?.price && (
    <Badge variant="light" color="gray" size={isMobile ? 'sm' : 'lg'}>
      <Money data={artistService?.price as any} />
    </Badge>
  );

  return (
    <Card
      key={product.handle}
      withBorder
      radius={0}
      className={classes.card}
      component={Link}
      to={`treatment/${product.handle}`}
    >
      <ArtistServiceContent
        product={product}
        description={artistService?.description}
        leftSection={leftSection}
        rightSection={rightSection}
      />
    </Card>
  );
}
