import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Flex,
  Group,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {Link} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {IconArrowRight} from '@tabler/icons-react';
import {type AccountServicesProductsQuery} from 'storefrontapi.generated';
import {type CustomerProductList} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';
import {BadgeCollection} from '../BadgeCollection';
import classes from './ArtistProduct.module.css';

export type ArtistProductProps = {
  product: AccountServicesProductsQuery['products']['nodes'][number];
  services: CustomerProductList[];
};

export function ArtistProduct({product, services}: ArtistProductProps) {
  const artistService = services.find(
    ({productId}) => productId.toString() === parseGid(product.id).id,
  );

  const collection = product.collections.nodes.find((p) =>
    p.title.includes('treatments'),
  );

  return (
    <Card
      key={product.handle}
      withBorder
      className={classes.card}
      component={Link}
      to={`treatment/${product.handle}`}
    >
      <Group justify="space-between" gap="0">
        <BadgeCollection collection={collection} />
        <ActionIcon variant="outline" color="black" radius="lg" size="md">
          <IconArrowRight style={{width: '70%', height: '70%'}} stroke={1.5} />
        </ActionIcon>
      </Group>
      <Title
        order={2}
        size={rem(24)}
        mt={rem(12)}
        mb={rem(4)}
        fw={700}
        lts=".5px"
      >
        {product.title}
      </Title>

      <Flex
        gap="sm"
        direction="column"
        justify="flex-start"
        style={{flexGrow: 1, position: 'relative'}}
      >
        <Text c="dimmed" size="md" fw={400} lineClamp={2}>
          {artistService?.description ||
            product.description ||
            'ingen beskrivelse'}
        </Text>
      </Flex>

      <Card.Section>
        <Divider my={{base: 'xs', md: 'md'}} />
      </Card.Section>

      <Group justify="space-between" gap="0">
        <Text c="dimmed" fz="xs" tt="uppercase" fw={700}>
          {durationToTime(artistService?.duration ?? 0)}
        </Text>

        {artistService?.price && (
          <Badge variant="light" color="gray" size="lg">
            <Money data={artistService?.price as any} />
          </Badge>
        )}
      </Group>
    </Card>
  );
}
