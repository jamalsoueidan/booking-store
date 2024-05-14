import {Badge, Card, Flex, Group, Stack, Text, Title, rem} from '@mantine/core';
import {Link} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {IconCalendar} from '@tabler/icons-react';
import {type ArtistTreatmentProductFragment} from 'storefrontapi.generated';
import {useUser} from '~/hooks/use-user';
import {type CustomerLocationBase} from '~/lib/api/model';
import {durationToTime} from '~/lib/duration';
import {LocationIcon} from '../LocationIcon';
import classes from './ArtistProduct.module.css';
import {PriceBadge} from './PriceBadge';

export type ArtistProductProps = {
  product: ArtistTreatmentProductFragment;
};

export function ArtistProduct({product}: ArtistProductProps) {
  const user = useUser();

  const productId = parseGid(product?.id).id;
  const locations: Array<
    Pick<CustomerLocationBase, 'locationType' | 'originType'>
  > = JSON.parse(product.locations?.value || '') as any;

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
      data-testid={`service-item-${productId}`}
      to={`treatment/${product.handle}`}
    >
      <Flex direction="column" gap={rem(48)} h="100%">
        <Stack gap="6px" style={{flex: 1}}>
          <Flex justify="space-between">
            <Badge c={`${user.theme.color}.6`} color={`${user.theme.color}.1`}>
              {product.productType}
            </Badge>
            <Flex gap="4px">
              {locations.map((location, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <LocationIcon key={index} location={location} />
              ))}
            </Flex>
          </Flex>
          <Title
            order={2}
            size={rem(24)}
            fw={600}
            lts=".5px"
            data-testid={`service-title-${productId}`}
          >
            {product.title}
          </Title>

          <Text
            c="dimmed"
            size="md"
            fw={400}
            lineClamp={3}
            dangerouslySetInnerHTML={{
              __html: product?.descriptionHtml || 'ingen beskrivelse',
            }}
          ></Text>
        </Stack>

        <Group
          justify="space-between"
          bg="gray.1"
          w="100%"
          px="md"
          py="sm"
          style={{borderRadius: '25px'}}
        >
          <Flex gap="4px" align="center">
            <IconCalendar
              style={{width: rem(32), height: rem(32)}}
              stroke="1"
            />
            <Text fw="bold" data-testid={`service-duration-text-${productId}`}>
              {durationToTime(product.duration?.value || 0)}
            </Text>
          </Flex>

          <PriceBadge
            compareAtPrice={product.variants.nodes[0].compareAtPrice}
            price={product.variants.nodes[0].price}
          />
        </Group>
      </Flex>
    </Card>
  );
}
