import {
  Alert,
  Button,
  Mark,
  rem,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
} from '@mantine/core';
import {
  Link,
  useLoaderData,
  useOutletContext,
  useSearchParams,
} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {json, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconArrowRight, IconCheck, IconHeart, IconX} from '@tabler/icons-react';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
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

  const heading = `Velkommen til din konto`;

  const isOfficialBusinessPartner = searchParams.has('business');

  return (
    <>
      <AccountTitle heading={heading} />

      <AccountContent>
        {isOfficialBusinessPartner ? (
          <Alert
            variant="light"
            color="green"
            mb="xl"
            icon={<IconHeart style={{width: rem(34), height: rem(34)}} />}
          >
            <Text>
              Du er nu tilmeldt som en business-konto på vores hjemmeside.
            </Text>
            <Text>
              Mens vi gennemgår og aktiverer din profil, opfordrer vi dig til at
              udfylde de resterende felter. Du kan gøre dette ved at tilføje
              lokation, vagtplan, ydelser og eventuelt uploade et billede. Dette
              vil sikre, at din konto er klar til at byde potentielle kunder
              velkommen, så snart den er godkendt.
            </Text>
          </Alert>
        ) : null}

        {isBusiness ? <BusinessAccount status={status} /> : <BuyerAccount />}
      </AccountContent>
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
            Udfyld alle felter under profil side.
          </Text>
          <Button
            size="compact-xs"
            radius="lg"
            component={Link}
            to="../public"
            rightSection={<IconArrowRight size="14" />}
          >
            Opdatere profil
          </Button>
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
            Opret de steder, hvor du vil tilbyde dine ydelser fra, så dine
            følgere har mulighed for at vælge den mest passende lokation,{' '}
          </Text>
          <Button
            size="compact-xs"
            radius="lg"
            component={Link}
            to="../locations/create"
            rightSection={<IconArrowRight size="14" />}
          >
            Opret lokation
          </Button>
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
            tid.
          </Text>
          <Button
            size="compact-xs"
            radius="lg"
            component={Link}
            to="../schedules/create"
            rightSection={<IconArrowRight size="14" />}
          >
            Opret vagtplan
          </Button>
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
            vælge det, de har brug for.
          </Text>
          <Button
            size="compact-xs"
            radius="lg"
            component={Link}
            to="../services/create"
            rightSection={<IconArrowRight size="14" />}
          >
            Tilføj ydelser
          </Button>
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
            Upload et billede af dig selv, så dine følgere kan sætte ansigt på
            personen bag ydelserne,
          </Text>
          <Button
            size="compact-xs"
            radius="lg"
            component={Link}
            to="../upload"
            rightSection={<IconArrowRight size="14" />}
          >
            Upload et billed
          </Button>
        </Timeline.Item>
      </Timeline>
    </>
  );
}

function BuyerAccount() {
  return (
    <Stack>
      <Text>
        Du er nu officielt oprettet og logget ind på dit personlige dashboard.
        Herfra har du adgang til en række funktioner til at gøre din oplevelse
        så glidende og behagelig som muligt. Du kan gennemse din{' '}
        <Link to="/account/orders">købshistorik</Link>,{' '}
        <Link to="/account/password">opdatere dit kodeord</Link>, og se dine
        fremtidige bookinger med talentfulde makeupartister, hårstylister og
        meget mere.{' '}
      </Text>

      <Text>
        <Mark>
          Hvis du har en passion for skønhed og ønsker at dele dine egne
          talenter med verden
        </Mark>
        , giver vi dig en unik mulighed. Du kan nemt konvertere din konto til en{' '}
        <Link to="../business">business konto</Link> - helt gratis! Som business
        bruger kan du udbyde dine egne ydelser på vores platform og tjene penge,
        alt imens du udvider din kundekreds og bygger dit brand. At{' '}
        <Mark>skifte til en business konto</Mark> er enkelt og ligetil.
      </Text>
      <Text>
        Vi er her for at støtte dig på hvert skridt af vejen. Så hvis du har
        spørgsmål eller brug for hjælp undervejs, tøv ikke med at{' '}
        <Link to="/pages/contact">kontakte os</Link>. Velkommen ombord, og lad
        os sammen skabe skønhed!
      </Text>
      <div>
        <Button size="xl" component={Link} to="../business">
          Skift til Business Konto!
        </Button>
      </div>
    </Stack>
  );
}
