import {Box, Image, Text, UnstyledButton} from '@mantine/core';
import {Link} from '@remix-run/react';
import {Image as ShopifyImage} from '@shopify/hydrogen';
import {type ArticleUserFragment} from 'storefrontapi.generated';
import classes from './ArtistCard.module.css';

export const ArtistCard = ({artist}: {artist: ArticleUserFragment}) => {
  const user = artist.user?.reference;

  return (
    <UnstyledButton
      className={classes.button}
      component={Link}
      to={`/artist/${user?.username?.value}`}
      style={{borderRadius: '5%', border: '1px solid #f4f4f4'}}
    >
      <Image
        component={ShopifyImage}
        sizes="(min-width: 45em) 50vw, 100vw"
        aspectRatio="2/5"
        src={user?.image?.reference?.image?.url}
        style={{
          borderTopLeftRadius: '5%',
          borderTopRightRadius: '5%',
        }}
        fallbackSrc="https://placehold.co/400x600?text=Ekspert"
        loading="lazy"
      />
      <Box p="xs" pb="xs" pt="6px">
        <Text fz="lg" fw={500} c="black">
          {user?.fullname?.value}
        </Text>
        <Text fz="sm" c="#666" lineClamp={2}>
          {user?.shortDescription?.value}
        </Text>
      </Box>
    </UnstyledButton>
  );
};
