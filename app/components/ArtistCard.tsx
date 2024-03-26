import {Box, Button, Image, Stack, Text, UnstyledButton} from '@mantine/core';
import {Link} from '@remix-run/react';
import {Image as ShopifyImage} from '@shopify/hydrogen';
import type {User, UserTop} from '~/lib/api/model';
import classes from './ArtistCard.module.css';

export const ArtistCard = ({artist}: {artist: User | UserTop}) => (
  <UnstyledButton
    className={classes.button}
    component={Link}
    to={`/artist/${artist.username}`}
    bg="white"
    style={{borderRadius: '5%'}}
  >
    <Stack gap="6">
      <div style={{position: 'relative'}}>
        <Image
          component={ShopifyImage}
          sizes="(min-width: 45em) 50vw, 100vw"
          aspectRatio="2/5"
          src={artist.images?.profile?.url}
          style={{
            borderTopLeftRadius: '5%',
            borderTopRightRadius: '5%',
          }}
          fallbackSrc="https://placehold.co/400x600?text=Ekspert"
        />
        <Button variant="default" size="xs" radius="lg">
          Vis profile
        </Button>
      </div>
      <Box bg="white" p="xs">
        <Text fz="lg" fw={500} c="black">
          {artist.fullname}
        </Text>
        <Text fz="sm" c="#666">
          {artist.shortDescription}
        </Text>
      </Box>
    </Stack>
  </UnstyledButton>
);
