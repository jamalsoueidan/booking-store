import {ActionIcon, Anchor, Card, Flex, Image, Text} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {Link} from '@remix-run/react';
import type {CollectionFragment} from 'storefrontapi.generated';
import {parseTE} from '~/lib/clean';
import classes from './HeroCategories.module.css';

export default function HeroCategories({
  collections,
}: {
  collections: CollectionFragment[];
}) {
  const isMobile = useMediaQuery('(max-width: 62em)');

  return (
    <Card bg="white" shadow="lg" radius="lg" className={classes.card}>
      <Flex gap={isMobile ? 'sm' : 'xl'} wrap="wrap" justify="center">
        {collections.map((c) => (
          <Anchor component={Link} to={`/categories/${c.handle}`} key={c.id}>
            <Flex justify="center" align="center" direction="column" gap="sm">
              <ActionIcon
                variant="light"
                color={c.color?.value || 'yellow'}
                radius="xl"
                className={classes.icon}
              >
                <Image
                  src={`/categories/${
                    c.icon?.value || 'reshot-icon-beauty-mirror'
                  }.svg`}
                  h="80%"
                  w="80%"
                  alt="ok"
                />
              </ActionIcon>
              <Text c="black" fw="500" className={classes.text} lineClamp={1}>
                {parseTE(c.title)}
              </Text>
            </Flex>
          </Anchor>
        ))}
      </Flex>
    </Card>
  );
}
