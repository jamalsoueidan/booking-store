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
import {LocationIcon} from '../LocationIcon';
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
      shadow="sm"
      className={classes.card}
      component={Link}
      radius="xl"
      px="md"
      py="lg"
      data-testid={`service-item-${artistService?.productId}`}
      to={`treatment/${product.handle}`}
    >
      <Flex direction="column" gap={rem(48)} h="100%">
        <Stack gap="6px" style={{flex: 1}}>
          <Flex justify="space-between">
            <Badge c={`${user.theme.color}.6`} color={`${user.theme.color}.1`}>
              {artistService?.scheduleName}
            </Badge>
            <Flex gap="4px">
              {artistService?.locations.map((location) => (
                <LocationIcon key={location.location} location={location} />
              ))}
            </Flex>
          </Flex>
          <Title
            order={2}
            size={rem(24)}
            fw={600}
            lts=".5px"
            data-testid={`service-title-${artistService?.productId}`}
          >
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
              <Text
                fw="bold"
                data-testid={`service-duration-text-${artistService?.productId}`}
              >
                {durationToTime(artistService?.duration ?? 0)}
              </Text>
              <Text
                c="dimmed"
                fz="xs"
                data-testid={`service-collection-text-${artistService?.productId}`}
              >
                {parseTE(collection?.title || '')}
              </Text>
            </Flex>
          </Flex>

          <Button
            variant="outline"
            size="xs"
            color="black"
            radius="xl"
            data-testid={`service-button-${artistService?.productId}`}
          >
            {artistService?.price ? (
              <>
                {artistService?.options && artistService.options.length > 0
                  ? 'FRA'
                  : null}
                &#160;
                <Money as="span" data={artistService?.price as any} />
              </>
            ) : null}
          </Button>
        </Group>
      </Flex>
    </Card>
  );
}
