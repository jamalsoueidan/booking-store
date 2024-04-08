import {
  Badge,
  Button,
  Card,
  Flex,
  Group,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {Link} from '@remix-run/react';
import {Money, parseGid} from '@shopify/hydrogen';
import {IconCalendar} from '@tabler/icons-react';
import {type ArtistServicesProductsQuery} from 'storefrontapi.generated';
import {useUser} from '~/hooks/use-user';
import type {CustomerProductList} from '~/lib/api/model';
import {parseTE} from '~/lib/clean';
import {durationToTime} from '~/lib/duration';
import classes from './ArtistProduct.module.css';

export type ArtistProductProps = {
  product: ArtistServicesProductsQuery['products']['nodes'][number];
  services: CustomerProductList[];
};

export function ArtistProduct({product, services}: ArtistProductProps) {
  const user = useUser();
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
      radius="xl"
      px="md"
      py="lg"
      to={`treatment/${product.handle}`}
    >
      <Stack gap={rem(48)}>
        <Stack gap="6px">
          <Badge c={`${user.theme.color}.6`} color={`${user.theme.color}.1`}>
            {artistService?.scheduleName}
          </Badge>
          <Title order={2} size={rem(24)} fw={600} lts=".5px">
            {product.title}
          </Title>

          <Text c="dimmed" size="md" fw={400} lineClamp={3}>
            {artistService?.description ||
              product.description ||
              'ingen beskrivelse'}
          </Text>
        </Stack>

        <Group
          justify="space-between"
          bg="gray.1"
          w="100%"
          px="md"
          py="sm"
          style={{borderRadius: '25px'}}
        >
          <Flex gap="4px">
            <IconCalendar
              style={{width: rem(44), height: rem(44)}}
              stroke="1"
            />
            <Flex direction="column">
              <Text fw="bold">
                {durationToTime(artistService?.duration ?? 0)}
              </Text>
              <Text c="dimmed" fz="xs">
                {parseTE(collection?.title || '')}
              </Text>
            </Flex>
          </Flex>

          <Button variant="outline" size="xs" color="black" radius="xl">
            {artistService?.price ? (
              <Money data={artistService?.price as any} />
            ) : null}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
