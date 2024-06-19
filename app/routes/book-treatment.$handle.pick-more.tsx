import {
  ActionIcon,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
  Title,
  rem,
} from '@mantine/core';
import {
  Link,
  Outlet,
  useOutletContext,
  useSearchParams,
} from '@remix-run/react';

import {parseGid} from '@shopify/hydrogen';

import {IconCheck, IconPlus} from '@tabler/icons-react';
import {useMemo} from 'react';
import {type PickMoreTreatmentProductFragment} from 'storefrontapi.generated';
import {durationToTime} from '~/lib/duration';
import {useTranslations} from '~/providers/Translation';
import {BookingDetails} from './book-treatment.$handle';

export default function ArtistTreatments() {
  const {t, tc} = useTranslations();
  const [searchParams] = useSearchParams();
  const {products} = useOutletContext<{
    products: PickMoreTreatmentProductFragment[];
  }>();

  return (
    <>
      <Grid.Col span={{base: 12, md: 7}}>
        <Stack gap="xl">
          <div>
            <Text size="sm" c="dimmed">
              {t('artist_booking_steps', {step: 3, total: 4})}
            </Text>
            <Title order={1} fw={600} size="h2">
              {t('artist_booking_pickmore_title')}
            </Title>
            <Text c="dimmed">{t('artist_booking_pickmore_subtitle')}</Text>
          </div>

          {products.length > 0 ? (
            <>
              <Stack gap="md">
                {products.map((product) => (
                  <ArtistServiceProduct key={product.id} product={product} />
                ))}
              </Stack>

              <Outlet />
            </>
          ) : (
            <Text>
              {tc('artist_booking_pickmore_empty', {
                1: <Text component="span" fw="bold" />,
              })}
            </Text>
          )}
        </Stack>
      </Grid.Col>
      <BookingDetails>
        <Button
          variant="fill"
          color="black"
          component={Link}
          to={`../pick-datetime?${searchParams.toString()}`}
          relative="route"
          prefetch="render"
          size="lg"
        >
          {t('continue')}
        </Button>
      </BookingDetails>
    </>
  );
}

function ArtistServiceProduct({
  product,
}: {
  product: PickMoreTreatmentProductFragment;
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const productID = parseGid(product.id).id;
  const isChecked = searchParams.getAll('productIds').includes(productID);

  const onClick = () => {
    setSearchParams(
      (prev) => {
        const existingItems = prev.getAll('productIds');
        if (existingItems.includes(productID)) {
          prev.delete('productIds');
          existingItems.forEach((item) => {
            if (item !== productID) {
              prev.append('productIds', item);
            }
          });
        } else {
          prev.append('productIds', productID);
        }
        return prev;
      },
      {preventScrollReset: true, replace: true},
    );
  };

  const onClickOptions = () => {
    setSearchParams(
      (prev) => {
        prev.append('modal', product.handle || '');
        return prev;
      },
      {preventScrollReset: true, replace: true},
    );
  };

  const variant = product.variants.nodes[0];

  const discountString = useMemo(() => {
    if (
      variant.compareAtPrice?.amount &&
      variant.compareAtPrice?.amount !== '0.0'
    ) {
      const discountAmount =
        parseInt(variant.compareAtPrice?.amount) -
        parseInt(variant.price.amount);
      const discountPercentage = Math.abs(
        (discountAmount / parseInt(variant.compareAtPrice?.amount)) * 100,
      );
      return `Spar ${discountPercentage.toFixed(0)}%`;
    }
    return null;
  }, [variant.compareAtPrice?.amount, variant.price.amount]);

  return (
    <Card
      withBorder
      radius="md"
      onClick={product?.options?.value ? onClickOptions : onClick}
    >
      <Grid>
        <Grid.Col span={10}>
          <Title order={4} mb={rem(4)} fw={500}>
            {product.title}
          </Title>
          <Text c="dimmed" size="sm">
            {durationToTime(product.duration?.value || 0)}
          </Text>

          <Group>
            <Text size="sm">
              {product.options?.value ? 'fra' : ''} {variant.price.amount} kr
            </Text>
            {discountString ? (
              <Text c="green.9" size="sm">
                {discountString}
              </Text>
            ) : null}
          </Group>
        </Grid.Col>
        <Grid.Col span={2}>
          <Flex justify="center" align="center" h="100%">
            {isChecked ? (
              <ActionIcon variant="filled">
                <IconCheck />
              </ActionIcon>
            ) : (
              <ActionIcon variant="light">
                <IconPlus />
              </ActionIcon>
            )}
          </Flex>
        </Grid.Col>
      </Grid>
    </Card>
  );
}
