import {
  Button,
  Divider,
  Flex,
  rem,
  Select,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import {
  Link,
  Outlet,
  useLoaderData,
  useLocation,
  useNavigate,
  useParams,
} from '@remix-run/react';
import {json, redirect, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {IconMoodSad} from '@tabler/icons-react';
import {useEffect} from 'react';
import MobileModal from '~/components/MobileModal';
import {AccountButton} from '~/components/account/AccountButton';
import {AccountContent} from '~/components/account/AccountContent';
import {AccountTitle} from '~/components/account/AccountTitle';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import {getCustomer} from '~/lib/get-customer';
import {AccountSchedulesCreate} from './account.schedules.create';

export async function loader({context, request}: LoaderFunctionArgs) {
  const customerId = await getCustomer({context});
  const response = await getBookingShopifyApi().customerScheduleList(
    customerId,
    context,
  );

  const url = new URL(request.url);
  if (url.pathname === '/account/schedules' && response.payload.length > 0) {
    return redirect(response.payload[0]._id);
  }
  return json(response.payload);
}

export default function AccountSchedulesIndex() {
  const loaderData = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const location = useLocation();
  const [opened, {open, close}] = useDisclosure(false);
  const params = useParams();

  const selectScheduleMarkup =
    loaderData.length > 1 ? (
      <>
        <Flex gap="xs">
          <Select
            //variant={location.pathname.includes(d._id) ? 'outline' : 'light'}
            size="md"
            label="Vælge vagtplan du vil redigere"
            description="Tryk på select for at opdatere den pågældende vagtplan"
            value={params.scheduleHandle}
            onChange={(value) => {
              if (value) {
                navigate(value);
              }
            }}
            data={loaderData.map((d) => ({
              value: d._id,
              label: d.name,
            }))}
          ></Select>
        </Flex>
        <Divider my="xl" />
      </>
    ) : null;

  const closeModal = () => {
    navigate('#');
  };

  useEffect(() => {
    if (location.hash === '#create') {
      open();
    } else {
      close();
    }
  }, [close, location.hash, open]);

  return (
    <>
      <AccountTitle heading="Vagtplaner">
        {loaderData.length > 0 ? (
          <AccountButton to="#create" data-testid="create-schedule-button">
            Opret ny vagtplan
          </AccountButton>
        ) : null}
      </AccountTitle>

      <AccountContent>
        {loaderData.length === 0 ? (
          <Flex gap="lg" direction="column" justify="center" align="center">
            <ThemeIcon variant="white" size={rem(100)}>
              <IconMoodSad stroke={1} style={{width: '100%', height: '100%'}} />
            </ThemeIcon>
            <Title ta="center">Du har ingen vagtplaner</Title>
            <Button
              component={Link}
              to="#create"
              data-testid="empty-create-button"
            >
              Tilføj vagtplan
            </Button>
          </Flex>
        ) : (
          selectScheduleMarkup
        )}

        <Outlet />

        <MobileModal
          opened={opened}
          onClose={closeModal}
          title="Opret vagtplan"
        >
          <AccountSchedulesCreate />
        </MobileModal>
      </AccountContent>
    </>
  );
}
