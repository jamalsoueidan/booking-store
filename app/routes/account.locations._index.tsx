import {
  Button,
  Card,
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
import {
  IconBuildingStore,
  IconGps,
  IconHome,
  IconMoodSad,
  IconPlus,
} from '@tabler/icons-react';

import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerLocationIsDefault} from '~/lib/api/model';
import {getCustomer} from '~/lib/get-customer';

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});
  const response = await getBookingShopifyApi().customerLocationList(
    customerId,
    context,
  );

  return json(response.payload);
}

export default function AccountLocationsIndex() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <>
      <AccountTitle heading="Lokationer">
        {loaderData.length > 0 ? (
          <AccountButton
            to={'create'}
            leftSection={<IconPlus size={14} />}
            data-testid="create-button"
          >
            Opret lokation
          </AccountButton>
        ) : null}
      </AccountTitle>

      <AccountContent>
        {loaderData.length === 0 ? (
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
            >
              Opret lokation
            </Button>
          </Flex>
        ) : null}

        <SimpleGrid cols={{base: 1, md: 2, lg: 3}} data-testid="locations-grid">
          {loaderData.map((d) => (
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
    </>
  );
}

export type AccountLocationProps = {
  data: CustomerLocationIsDefault;
};

export const AccountLocation = ({data}: AccountLocationProps) => {
  const markup =
    data.locationType === 'destination' ? (
      <div style={{position: 'relative'}}>
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
        <div style={{position: 'absolute', top: 0, right: 0}}>
          <IconGps style={{width: rem(32), height: rem(32)}} />
        </div>
      </div>
    ) : (
      <div style={{position: 'relative'}}>
        <div style={{position: 'absolute', top: 0, right: 0}}>
          {data.originType === 'commercial' ? (
            <IconBuildingStore style={{width: rem(32), height: rem(32)}} />
          ) : (
            <IconHome style={{width: rem(32), height: rem(32)}} />
          )}
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
              <Text size="xs">Arbejdsstedstype</Text>
              <Text fw={600} size="xs">
                {data.originType === 'commercial' ? 'Butik' : 'Eget sted'}
              </Text>
            </div>
          </SimpleGrid>
        </Stack>
      </div>
    );

  return (
    <UnstyledButton
      component={Link}
      to={`${data._id}/edit`}
      data-testid={`edit-button-${data._id}`}
    >
      {markup}
    </UnstyledButton>
  );
};
