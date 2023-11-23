import {Button, Card, Mark, Overlay, Text} from '@mantine/core';
import {Link} from '@remix-run/react';
import {IconArrowRight} from '@tabler/icons-react';
import {type CollectionFragment} from 'storefrontapi.generated';
import {parseTE} from '~/lib/clean';
import classes from './TreatmentCollection.module.css';

export function TreatmentCollectionCard({
  collection,
  index,
}: {
  collection: CollectionFragment;
  index: number;
}) {
  return (
    <Card
      radius="md"
      className={classes.card}
      style={{
        backgroundImage: `url(${collection.image?.url})`,
      }}
      component={Link}
      to={`/treatments/${collection.handle}`}
      prefetch="intent"
    >
      <Overlay className={classes.overlay} opacity={0.3} zIndex={0} />

      <div className={classes.content}>
        <Text
          size="lg"
          mb="lg"
          fw={700}
          className={classes.title}
          tt="uppercase"
        >
          <Mark p="xs">{parseTE(collection.title)}</Mark>
        </Text>

        <Text size="sm" className={classes.description} lineClamp={5}>
          {collection.description}
        </Text>

        <Button
          className={classes.action}
          variant="white"
          color="dark"
          size="md"
          rightSection={<IconArrowRight size={28} />}
        >
          Se behandlinger
        </Button>
      </div>
    </Card>
  );
}
