import {
  Accordion,
  Alert,
  Button,
  Card,
  Flex,
  Grid,
  rem,
  RingProgress,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {Link, useLoaderData, useOutletContext} from '@remix-run/react';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconCheck, IconCircle, IconHeart} from '@tabler/icons-react';
import {AccordionGuide} from '~/components/AccordionGuide';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {CUSTOMER_DETAILS_QUERY} from '~/graphql/customer-account/CustomerDetailsQuery';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {CustomerStatus, User} from '~/lib/api/model';
import {getCustomer} from '~/lib/get-customer';
import {type AccountOutlet} from './account';

export async function loader({context}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});

  const {data, errors} = await context.customerAccount.query(
    CUSTOMER_DETAILS_QUERY,
  );

  if (errors?.length || !data?.customer) {
    throw new Error('Customer not found');
  }

  const status = await getBookingShopifyApi().customerStatus(customerId);

  return json(
    {
      status: status.payload,
    },
    {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    },
  );
}

export default function AccountIndex() {
  const {customer, isBusiness, user} = useOutletContext<AccountOutlet>();
  const {status} = useLoaderData<typeof loader>();

  const heading = `Velkommen, ${customer.firstName} ${customer.lastName}`;

  return (
    <>
      <AccountTitle heading={heading} />

      <AccountContent>
        {isBusiness ? (
          <BusinessAccount status={status} user={user} />
        ) : (
          <BuyerAccount />
        )}
      </AccountContent>
    </>
  );
}

function BusinessAccount({
  status,
  user,
}: {
  status: CustomerStatus;
  user?: User | null;
}) {
  const totalCount = Object.keys(status).length;
  let finishedCount = 0;

  for (const key in status) {
    if ((status as any)[key] === true) {
      finishedCount++;
    }
  }

  return (
    <Grid gutter={{base: 'sm', md: 'xl'}}>
      <Grid.Col span={{sm: 12, md: 8}} order={{base: 2, md: 1}}>
        <Card shadow="lg" radius="lg" p="0" withBorder>
          <Flex gap="xs" justify="space-between" px="lg" py="sm">
            <Flex direction="column" justify="center">
              <Title order={3} fw="600">
                Kom i gang med BySisters
              </Title>
              <Text>Brug denne guide til at få din side op og køre.</Text>
            </Flex>
            <RingProgress
              size={74}
              thickness={9}
              label={
                <Text size="xl" ta="center" data-testid="status-text">
                  {finishedCount}/{totalCount}
                </Text>
              }
              sections={[
                {value: (finishedCount / totalCount) * 100, color: 'green'},
              ]}
            />
          </Flex>

          <AccordionGuide variant="filled">
            <Accordion.Item value="profile" data-testid="profil-accordion">
              <Accordion.Control
                icon={IconCheckOrX(status.profile, 'profile')}
                data-testid="profil-control"
              >
                Færdiggøre din profil
              </Accordion.Control>
              <Accordion.Panel>
                <Text size="sm">Udfyld alle felter under profil side.</Text>
                <Button
                  size="xs"
                  component={Link}
                  to="../public"
                  data-testid="update-profile-button"
                >
                  Opdatere profil
                </Button>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="locations" data-testid="locations-accordion">
              <Accordion.Control
                icon={IconCheckOrX(status.locations, 'locations')}
                data-testid="locations-control"
              >
                Opret en lokation
              </Accordion.Control>
              <Accordion.Panel>
                <Text size="sm">
                  Opret de steder, hvor du vil tilbyde dine ydelser fra, så dine
                  følgere har mulighed for at vælge den mest passende lokation,{' '}
                </Text>
                <Button
                  size="xs"
                  component={Link}
                  to="../locations/create"
                  data-testid="create-location-button"
                >
                  Opret lokation
                </Button>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="schedules" data-testid="schedules-accordion">
              <Accordion.Control
                icon={IconCheckOrX(status.schedules, 'schedules')}
                data-testid="schedules-control"
              >
                Opret en vagtplan
              </Accordion.Control>
              <Accordion.Panel>
                <Text size="sm">
                  Opret din vagtplan, så dine følgere ved, hvornår de kan booke
                  din tid.
                </Text>
                <Button
                  size="xs"
                  component={Link}
                  to="../schedules#create"
                  data-testid="create-schedule-button"
                >
                  Opret vagtplan
                </Button>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item value="services" data-testid="services-accordion">
              <Accordion.Control
                icon={IconCheckOrX(status.services, 'services')}
                data-testid="services-control"
              >
                Tilføj en ydelse
              </Accordion.Control>
              <Accordion.Panel>
                <Text size="sm">
                  Tilføj dine ydelser, så dine følgere kan se, hvad du tilbyder,
                  og vælge det, de har brug for.
                </Text>
                <Button
                  size="xs"
                  component={Link}
                  to="../services/create"
                  data-testid="create-service-button"
                >
                  Tilføj ydelser
                </Button>
              </Accordion.Panel>
            </Accordion.Item>
            <Accordion.Item
              value="profileImage"
              data-testid="profil-image-accordion"
            >
              <Accordion.Control
                icon={IconCheckOrX(status.profileImage, 'profile-image')}
                data-testid="profile-image-control"
              >
                Upload dit billed
              </Accordion.Control>
              <Accordion.Panel>
                <Text size="sm">
                  Upload et billede af dig selv, så dine følgere kan sætte
                  ansigt på personen bag ydelserne,
                </Text>
                <Button
                  size="xs"
                  component={Link}
                  to="../upload"
                  data-testid="upload-image-button"
                >
                  Upload et billed
                </Button>
              </Accordion.Panel>
            </Accordion.Item>
          </AccordionGuide>
        </Card>
      </Grid.Col>
      {!!user && !user?.active ? (
        <Grid.Col span={{sm: 12, md: 4}} order={{base: 1, md: 2}}>
          <Alert
            variant="light"
            color="green"
            icon={<IconHeart style={{width: rem(34), height: rem(34)}} />}
            data-testid="business-notification"
          >
            <Text fw="bold">
              Du er nu tilmeldt som en business-konto på vores hjemmeside.
            </Text>
            <br />
            <Text>
              Mens vi gennemgår og aktiverer din profil, opfordres du til at
              besøge og udfylde siderne for lokation, vagtplan, ydelser og
              eventuelt uploade et billede, for at gøre din konto klar til
              potentielle kunder.
            </Text>
          </Alert>
        </Grid.Col>
      ) : null}
    </Grid>
  );
}

function BuyerAccount() {
  return (
    <Stack>
      <Text>
        Du er nu officielt oprettet og logget ind på dit personlige dashboard.
        Herfra har du adgang til en række funktioner til at gøre din oplevelse
        så glidende og behagelig som muligt. Du kan gennemse din{' '}
        <Link to="/account/orders">købshistorik</Link>, og se dine fremtidige
        bookinger med skønhedseksperter.{' '}
      </Text>

      <Text>
        <strong>
          Hvis du elsker skønhed og vil dele dine talenter med verden, har vi en
          unik mulighed for dig.{' '}
        </strong>
        Du kan gratis konvertere din konto til en{' '}
        <Link to="../business">businesskonto</Link>. Efterfølgende kan du
        tilbyde dine ydelser på vores platform, tjene penge, udvide din
        kundekreds og bygge dit brand.
      </Text>
      <Text>
        Vi er her for at støtte dig på hvert skridt af vejen. Så hvis du har
        spørgsmål eller brug for hjælp undervejs, tøv ikke med at{' '}
        <Link to="/pages/contact">kontakte os</Link>. <br />
        <br />
        Velkommen ombord, og lad os sammen skabe skønhed!
      </Text>
      <div>
        <Button
          size="xl"
          component={Link}
          to="../business"
          data-testid="change-business-button"
        >
          Skift til Business Konto!
        </Button>
      </div>
    </Stack>
  );
}

function IconCheckOrX(boolean: boolean, name: string) {
  return boolean ? (
    <ThemeIcon radius="lg" color="green" size="xs">
      <IconCheck
        style={{
          width: '100%',
          height: '100%',
        }}
        data-testid={`${name}-icon-check`}
      />
    </ThemeIcon>
  ) : (
    <ThemeIcon radius="lg" color="gray.2" size="xs">
      <IconCircle
        style={{
          width: '100%',
          height: '100%',
        }}
        data-testid={`${name}-icon-uncheck`}
      />
    </ThemeIcon>
  );
}
