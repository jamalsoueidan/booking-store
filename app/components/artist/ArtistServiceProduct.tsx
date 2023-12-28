import {
  Badge,
  Box,
  Divider,
  Flex,
  Group,
  Image,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {useSearchParams} from '@remix-run/react';

import {Money, Image as ShopifyImage, parseGid} from '@shopify/hydrogen';
import {type ProductItemFragment} from 'storefrontapi.generated';
import {type CustomerProductBase} from '~/lib/api/model';

import {useMediaQuery} from '@mantine/hooks';
import {ArtistServiceCheckboxCard} from '~/components/artist/ArtistServiceCheckboxCard';
import {durationToTime} from '~/lib/duration';
import classes from './ArtistServiceProduct.module.css';

type ArtistServiceProductProps = {
  product: ProductItemFragment;
  services: CustomerProductBase[];
  defaultChecked?: boolean;
};

export function ArtistServiceProduct({
  product,
  services,
  defaultChecked,
}: ArtistServiceProductProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMediaQuery('(max-width: 62em)');

  const onChange = (checked: boolean) => {
    const newSearchParams = new URLSearchParams(searchParams);

    const existingItems = newSearchParams.getAll('productIds');
    const itemIndex = existingItems.indexOf(parseGid(product.id).id);

    if (checked && itemIndex === -1) {
      newSearchParams.append('productIds', parseGid(product.id).id);
    }

    if (!checked) {
      const updatedItems = existingItems.filter(
        (item) => item !== parseGid(product.id).id,
      );
      newSearchParams.delete('productIds');
      updatedItems.forEach((item) =>
        newSearchParams.append('productIds', item),
      );
    }

    setSearchParams(newSearchParams, {
      state: {
        key: 'booking',
      },
    });
  };

  const artistService = services.find(({productId}) => {
    return productId.toString() === parseGid(product.id).id;
  });

  const leftSection = (
    <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
      {durationToTime(artistService?.duration ?? 0)}
    </Text>
  );

  const rightSection = artistService?.price && (
    <Badge variant="light" color="gray" size="md">
      <Money data={artistService?.price as any} />
    </Badge>
  );

  return (
    <ArtistServiceCheckboxCard
      value={artistService!.productId.toString()}
      defaultChecked={defaultChecked}
      onChange={onChange}
      name="productIds"
    >
      <Flex>
        {product.featuredImage && (
          <div className={classes.image}>
            <Image
              component={ShopifyImage}
              data={product.featuredImage}
              h="auto"
              loading="lazy"
            />
          </div>
        )}
        <div style={{flex: '1'}}>
          <Box p="xs">
            <Title order={4} className={classes.title} mb={rem(4)} fw={500}>
              {product.title}
            </Title>
            <Flex
              gap="sm"
              direction="column"
              justify="flex-start"
              style={{flexGrow: 1, position: 'relative'}}
            >
              <Text c="dimmed" size="sm" fw={400} lineClamp={isMobile ? 4 : 2}>
                {artistService?.description ||
                  product.description ||
                  'ingen beskrivelse'}
              </Text>
            </Flex>
          </Box>

          <Divider />

          <Box p="xs">
            <Group justify="space-between">
              {leftSection}
              {rightSection}
            </Group>
          </Box>
        </div>
      </Flex>
    </ArtistServiceCheckboxCard>
  );
}
