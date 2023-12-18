import {AspectRatio, Card, Stack, Text} from '@mantine/core';

import {Image, Money} from '@shopify/hydrogen';
import type {ProductVariantFragment} from 'storefrontapi.generated';
import {type ProductsGetUsersByVariant} from '~/lib/api/model';
import classes from './TreatmentPickArtistRadioCard.module.css';

interface TreatmentPickArtistRadioCardProps {
  artist: ProductsGetUsersByVariant;
  variant?: ProductVariantFragment;
}

export function TreatmentPickArtistRadioCard({
  artist,
  variant,
}: TreatmentPickArtistRadioCardProps) {
  return (
    <Card withBorder>
      <Stack gap="xs" justify="center" align="center">
        <AspectRatio ratio={1 / 1} style={{width: '75px'}}>
          <Image
            data={artist.images.profile}
            aspectRatio="1/1"
            loading="eager"
            sizes="(min-width: 45em) 20vw, 50vw"
            className={classes.image}
          />
        </AspectRatio>
        <Text tt="uppercase" c="dimmed" fw={700} size="xs">
          {artist.fullname}
        </Text>

        {variant && (
          <Text size="xs" c="dimmed" fw={500}>
            <Money data={variant.price} />
          </Text>
        )}
      </Stack>
    </Card>
  );
}
