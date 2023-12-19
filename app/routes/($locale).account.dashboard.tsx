import {
  Button,
  Divider,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  Title,
} from '@mantine/core';
import {
  Link,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconCheck, IconX} from '@tabler/icons-react';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {type CustomerStatus} from '~/lib/api/model';
import {getCustomer} from '~/lib/get-customer';
import {type AccountOutlet} from './($locale).account';

export async function loader({context}: LoaderFunctionArgs) {
  const customer = await getCustomer({context});

  const status = await getBookingShopifyApi().customerStatus(
    parseGid(customer.id).id,
  );

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
  const {customer, isBusiness} = useOutletContext<AccountOutlet>();
  const {status} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const heading = customer?.firstName
    ? `Velkommen ${customer?.firstName}`
    : `Velkommen til din konto`;

  const isOfficialBusinessPartner = searchParams.has('business');

  return (
    <>
      <Title>{heading}</Title>

      <Divider my={{base: 'xs', md: 'md'}} />

      {isOfficialBusinessPartner ? (
        <div className="flex items-center justify-center mb-6 bg-green-100 rounded">
          <p className="m-4 text-sm text-green-900">
            Du har nu registeret dig som en selvstændig partner på vores
            hjemmeside, nu mangler du bare oprette din uge vagtplan og tilføje
            de ydelser du tilbyder.
          </p>
        </div>
      ) : null}

      {isBusiness ? <BusinessAccount status={status} /> : <BuyerAccount />}
    </>
  );
}

function BusinessAccount({status}: {status: CustomerStatus}) {
  return (
    <>
      <Text>Brug denne personlige guide til at få din side op og køre.</Text>

      <Timeline bulletSize={34} mt="md" lineWidth={2}>
        <Timeline.Item
          title="Profile"
          bullet={
            <ThemeIcon
              size={30}
              variant="filled"
              color={status.profile ? 'green' : 'red'}
              radius="xl"
            >
              {status.profile ? (
                <IconCheck size="1.4rem" />
              ) : (
                <IconX size="1.4rem" />
              )}
            </ThemeIcon>
          }
        >
          <Text c="dimmed" size="sm">
            Udfyld alle felter under profil side,{' '}
            <Link to="../public">Opdatere profil</Link>.
          </Text>
        </Timeline.Item>
        <Timeline.Item
          title="Lokationer"
          bullet={
            <ThemeIcon
              size={30}
              variant="filled"
              color={status.locations ? 'green' : 'red'}
              radius="xl"
            >
              {status.locations ? (
                <IconCheck size="1.4rem" />
              ) : (
                <IconX size="1.4rem" />
              )}
            </ThemeIcon>
          }
        >
          <Text c="dimmed" size="sm">
            Tilføj de steder, hvor du vil tilbyde dine ydelser, så dine følgere
            har mulighed for at vælge den mest passende lokation,{' '}
            <Link to="../locations/create">Opret lokation</Link>.
          </Text>
        </Timeline.Item>
        <Timeline.Item
          title="Vagtplan"
          bullet={
            <ThemeIcon
              size={30}
              variant="filled"
              color={status.schedules ? 'green' : 'red'}
              radius="xl"
            >
              {status.schedules ? (
                <IconCheck size="1.4rem" />
              ) : (
                <IconX size="1.4rem" />
              )}
            </ThemeIcon>
          }
        >
          <Text c="dimmed" size="sm">
            Opret din vagtplan, så dine følgere ved, hvornår de kan booke din
            tid, <Link to="../schedules/create">Opret vagtplan</Link>.
          </Text>
        </Timeline.Item>
        <Timeline.Item
          title="Ydelser"
          bullet={
            <ThemeIcon
              size={30}
              variant="filled"
              color={status.services ? 'green' : 'red'}
              radius="xl"
            >
              {status.services ? (
                <IconCheck size="1.4rem" />
              ) : (
                <IconX size="1.4rem" />
              )}
            </ThemeIcon>
          }
        >
          <Text c="dimmed" size="sm">
            Tilføj dine ydelser, så dine følgere kan se, hvad du tilbyder, og
            vælge det, de har brug for,{' '}
            <Link to="../services/create">Tilføj ydelser</Link>
          </Text>
        </Timeline.Item>
        <Timeline.Item
          title="Billed"
          bullet={
            <ThemeIcon
              size={30}
              variant="filled"
              color={status.profileImage ? 'green' : 'red'}
              radius="xl"
            >
              {status.profileImage ? (
                <IconCheck size="1.4rem" />
              ) : (
                <IconX size="1.4rem" />
              )}
            </ThemeIcon>
          }
        >
          <Text c="dimmed" size="sm">
            Tilføj et billede af dig selv, så dine følgere kan sætte ansigt på
            personen bag ydelserne,
            <Link to="../upload">Upload et billed</Link>
          </Text>
        </Timeline.Item>
      </Timeline>
    </>
  );
}

function BuyerAccount() {
  return (
    <Stack>
      <Text>
        Hvis du ønsker register dig som skønhedsekspert bedes du trykke på
        knappen.
      </Text>
      <div>
        <Button component={Link} to="../business">
          Register dig!
        </Button>
      </div>
    </Stack>
  );
}
