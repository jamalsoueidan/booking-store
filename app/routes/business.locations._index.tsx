import {
  Button,
  Card,
  Container,
  Flex,
  rem,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import {Link, useLoaderData} from '@remix-run/react';

import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconMoodSad, IconPlus} from '@tabler/icons-react';

import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {LocationIcon} from '~/components/LocationIcon';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerLocationIsDefault} from '~/lib/api/model';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});
  const {payload: locations} =
    await getBookingShopifyApi().customerLocationList(customerId);

  return json({locations});
}

export default function AccountLocationsIndex() {
  const {locations} = useLoaderData<typeof loader>();

  return (
    <Container size="md" my={{base: rem(80), sm: rem(100)}}>
      <AccountTitle linkBack="/business" heading="Lokationer">
        <AccountButton
          to={'create'}
          leftSection={<IconPlus size={14} />}
          data-testid="create-button"
        >
          Opret lokation
        </AccountButton>
      </AccountTitle>

      <AccountContent>
        {!locations || locations.length === 0 ? (
          <Flex gap="lg" direction="column" justify="center" align="center">
            <ThemeIcon variant="white" size={rem(100)}>
              <IconMoodSad stroke={1} style={{width: '100%', height: '100%'}} />
            </ThemeIcon>
            <Title ta="center" order={2} data-testid="empty-title">
              Du har ingen lokationer
            </Title>
            <Button
              component={Link}
              to="create"
              data-testid="empty-create-button"
              leftSection={<IconPlus size={14} />}
            >
              Opret lokation
            </Button>
          </Flex>
        ) : null}

        <SimpleGrid cols={{base: 1, md: 2, lg: 3}} data-testid="locations-grid">
          {locations?.map((d) => (
            <Card
              key={d._id}
              padding="sm"
              radius="md"
              h="100%"
              withBorder
              data-testid={`location-item-${d._id}`}
            >
              <AccountLocation data={d} />
            </Card>
          ))}
        </SimpleGrid>
      </AccountContent>
    </Container>
  );
}

export type AccountLocationProps = {
  data: CustomerLocationIsDefault;
};

export const AccountLocation = ({data}: AccountLocationProps) => {
  const markup =
    data.locationType === 'destination' ? (
      <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', top: 0, right: 0}}>
          <LocationIcon
            location={data}
            style={{width: rem(32), height: rem(32)}}
          />
        </div>
        <Stack>
          <div>
            <Title order={3} data-testid="name-title">
              {data.name}
            </Title>
            <Text c="dimmed" data-testid="address-text">
              {data.fullAddress}
            </Text>
          </div>
          <SimpleGrid cols={3}>
            <div>
              <Text size="xs">Udgifter</Text>
              <Text fw={600} size="xs">
                {data.startFee} DKK
              </Text>
            </div>
            <div>
              <Text size="xs">Timepris for kørsel</Text>
              <Text fw={600} size="xs">
                {data.distanceHourlyRate} DKK
              </Text>
            </div>
            <div>
              <Text size="xs">Pris pr. kilometer:</Text>
              <Text fw={600} size="xs">
                {data.fixedRatePerKm} DKK
              </Text>
            </div>
            <div>
              <Text size="xs">Gratis. kilometer:</Text>
              <Text fw={600} size="xs">
                {data.distanceForFree} km
              </Text>
            </div>
            <div>
              <Text size="xs">Min. kilometer:</Text>
              <Text fw={600} size="xs">
                {data.minDriveDistance} km
              </Text>
            </div>
            <div>
              <Text size="xs">Max. kilometer:</Text>
              <Text fw={600} size="xs">
                {data.maxDriveDistance} km
              </Text>
            </div>
          </SimpleGrid>
        </Stack>
      </div>
    ) : (
      <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', top: 0, right: 0}}>
          <LocationIcon
            location={data}
            style={{width: rem(32), height: rem(32)}}
          />
        </div>

        <Stack>
          <div>
            <Title order={3} data-testid="name-title">
              {data.name}
            </Title>
            <Text c="dimmed" data-testid="address-text">
              {data.fullAddress}
            </Text>
          </div>
          <SimpleGrid cols={1}>
            <div>
              <Text size="xs">Arbejdsstedssted</Text>
              <Text fw={600} size="xs">
                {data.locationType === 'commercial' && 'Salon/Klink'}
                {data.locationType === 'home' && 'Hjemmefra'}
                {data.locationType === 'virtual' && 'Videochat/Opkld'}
              </Text>
            </div>
          </SimpleGrid>
        </Stack>
      </div>
    );

  return (
    <UnstyledButton
      component={Link}
      to={data._id}
      data-testid={`edit-button-${data._id}`}
    >
      {markup}
    </UnstyledButton>
  );
};
