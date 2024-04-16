import {Box, Image, Text, UnstyledButton} from '@mantine/core';
import {Link} from '@remix-run/react';
import {Image as ShopifyImage} from '@shopify/hydrogen';
import type {User, UserTop} from '~/lib/api/model';
import {modifyImageUrl} from '~/lib/image';
import classes from './ArtistCard.module.css';

export const ArtistCard = ({artist}: {artist: User | UserTop}) => (
  <UnstyledButton
    className={classes.button}
    component={Link}
    to={`/artist/${artist.username}`}
    style={{borderRadius: '5%', border: '1px solid #f4f4f4'}}
  >
    <Image
      component={ShopifyImage}
      sizes="(min-width: 45em) 50vw, 100vw"
      aspectRatio="2/5"
      src={modifyImageUrl(artist.images?.profile?.url, '250x250')}
      style={{
        borderTopLeftRadius: '5%',
        borderTopRightRadius: '5%',
      }}
      fallbackSrc="https://placehold.co/400x600?text=Ekspert"
      loading="lazy"
    />
    <Box p="xs" pb="xs" pt="6px">
      <Text fz="lg" fw={500} c="black">
        {artist.fullname}
      </Text>
      <Text fz="sm" c="#666">
        {artist.shortDescription}
      </Text>
    </Box>
  </UnstyledButton>
);
