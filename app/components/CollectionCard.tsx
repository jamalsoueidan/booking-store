import {AspectRatio, Card, Text} from '@mantine/core';
import {Link} from '@remix-run/react';
import {Image} from '@shopify/hydrogen';
import {type CollectionFragment} from 'storefrontapi.generated';
import {parseCT} from '~/lib/clean';
import classes from './CollectionCard.module.css';

export function CollectionCard({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Card
      p="md"
      radius="md"
      component={Link}
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className={classes.card}
    >
      {collection?.image && (
        <AspectRatio ratio={1080 / 1080}>
          <Image
            alt={collection.image.altText || collection.title}
            aspectRatio="1/1"
            data={collection.image}
            loading={index < 3 ? 'eager' : undefined}
          />
        </AspectRatio>
      )}
      <Text c="dimmed" size="xs" tt="uppercase" fw={700} mt="md">
        {collection.handle}
      </Text>
      <Text className={classes.title} mt={5}>
        {parseCT(collection.title)}
      </Text>
    </Card>
  );
}
