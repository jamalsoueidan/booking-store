import {Card, Group, Mark, Text} from '@mantine/core';
import {Link} from '@remix-run/react';
import {type CollectionFragment} from 'storefrontapi.generated';
import {parseTE} from '~/lib/clean';
import classes from './CategoryCard.module.css';

export function CategoryCard({collection}: {collection: CollectionFragment}) {
  return (
    <Card
      p="lg"
      shadow="lg"
      className={classes.card}
      radius="md"
      component={Link}
      to={`/categories/${collection.handle}`}
      prefetch="intent"
    >
      <div
        className={classes.image}
        style={{
          backgroundImage: `url(${collection.image?.url})`,
        }}
      />
      <div className={classes.overlay} />

      <div className={classes.content}>
        <Text size="lg" className={classes.title} fw={500} mb="lg">
          <Mark p="sm">{parseTE(collection.title)}</Mark>
        </Text>
        <Group justify="space-between" gap="xs">
          <Text size="sm" className={classes.body} lineClamp={3}>
            {collection.description}
          </Text>
        </Group>
      </div>
    </Card>
  );
}
