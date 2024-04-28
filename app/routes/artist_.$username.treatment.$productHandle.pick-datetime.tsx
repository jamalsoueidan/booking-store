import {
  Button,
  Flex,
  ScrollArea,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
  type SelectProps,
} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {
  Await,
  Link,
  useLoaderData,
  useLocation,
  useSearchParams,
  type ShouldRevalidateFunctionArgs,
} from '@remix-run/react';
import {parseGid} from '@shopify/hydrogen';
import {defer, type LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {format, isValid, parse, set} from 'date-fns';
import {da} from 'date-fns/locale';
import {Suspense} from 'react';
import {ArtistShell} from '~/components/ArtistShell';
import {TreatmentStepper} from '~/components/TreatmentStepper';
import {PRODUCT_VALIDATE_HANDLER_QUERY} from '~/data/queries';
import {getBookingShopifyApi} from '~/lib/api/bookingShopifyApi';
import type {
  UserAvailability,
  UserAvailabilityMulti,
  UserAvailabilitySlot,
} from '~/lib/api/model';
import {parseOptionsQueryParameters} from './artist_.$username.treatment.$productHandle._index';

export function shouldRevalidate({
  currentUrl,
  nextUrl,
}: ShouldRevalidateFunctionArgs) {
  const currentSearchParams = currentUrl.searchParams;
  const nextSearchParams = nextUrl.searchParams;

  const currentParamsCopy = new URLSearchParams(currentSearchParams);
  const nextParamsCopy = new URLSearchParams(nextSearchParams);

  currentParamsCopy.delete('date');
  currentParamsCopy.delete('fromDate');
  currentParamsCopy.delete('toDate');
  nextParamsCopy.delete('date');
  nextParamsCopy.delete('fromDate');
  nextParamsCopy.delete('toDate');

  return currentParamsCopy.toString() !== nextParamsCopy.toString();
}

export async function loader({params, request, context}: LoaderFunctionArgs) {
  const {productHandle, username} = params;
  const {storefront} = context;
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const productIds = searchParams.getAll('productIds');
  const calendar = searchParams.get('calendar') || new Date().toJSON();
  const locationId = searchParams.get('locationId') as string | undefined;
  const shippingId = searchParams.get('shippingId') as string | undefined;
  const optionIds = searchParams.getAll('options');

  if (!username || !productHandle || !locationId) {
    throw new Response('Expected artist handle to be defined', {status: 400});
  }

  const {product} = await storefront.query(PRODUCT_VALIDATE_HANDLER_QUERY, {
    variables: {productHandle},
  });

  if (!product?.id) {
    throw new Response('Expected product handle to be defined', {status: 404});
  }

  const availability = getBookingShopifyApi().userAvailabilityGenerate(
    username,
    locationId,
    {
      productIds: [parseGid(product.id).id, ...productIds],
      fromDate: calendar.substring(0, 10),
      shippingId: shippingId ? shippingId : undefined, //stringify ignore undefined values but not NULL
      optionIds: parseOptionsQueryParameters(url.search),
    },
  );

  return defer({availability});
}

export default function ArtistTreatmentPickDatetime() {
  const {availability} = useLoaderData<typeof loader>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isDisabled =
    !searchParams.has('fromDate') ||
    (searchParams.get('fromDate') === '' && !searchParams.has('toDate')) ||
    searchParams.get('toDate') === '';

  return (
    <>
      <ArtistShell.Main>
        <Suspense
          fallback={
            <Stack gap="lg">
              <SimpleGrid cols={2}>
                <Skeleton height={30} width="80%" />
                <Flex gap="lg" justify="flex-end">
                  <Skeleton height={30} width={30} />
                  <Skeleton height={30} width={30} />
                </Flex>
              </SimpleGrid>
              <Flex gap="lg">
                <Skeleton height={30} style={{flex: 1}} />
                <Skeleton height={30} style={{flex: 1}} />
                <Skeleton height={30} style={{flex: 1}} />
                <Skeleton height={30} style={{flex: 1}} />
                <Skeleton height={30} style={{flex: 1}} />
                <Skeleton height={30} style={{flex: 1}} />
                <Skeleton height={30} style={{flex: 1}} />
              </Flex>
            </Stack>
          }
        >
          <Await resolve={availability}>
            {({payload}) => <TreatmentPickDatetime availability={payload} />}
          </Await>
        </Suspense>
      </ArtistShell.Main>
      <ArtistShell.Footer>
        <TreatmentStepper
          currentStep={3}
          totalSteps={3}
          pageTitle="Tidsbestilling"
        >
          <Button
            variant="default"
            component={Link}
            to={`../completed${location.search}`}
            disabled={isDisabled}
          >
            Færdig
          </Button>
        </TreatmentStepper>
      </ArtistShell.Footer>
    </>
  );
}

type TreatmentPickDatetimeProps = {
  availability?: UserAvailabilityMulti[];
};

function TreatmentPickDatetime({availability}: TreatmentPickDatetimeProps) {
  const isMobile = useMediaQuery('(max-width: 48em)');
  const [searchParams, setSearchParams] = useSearchParams();

  const onPickDate = (month: string | null) => {
    if (month) {
      const monthDate = parse(month, 'MMMM', new Date());
      const startOfMonthDate = set(monthDate, {
        hours: 2,
        minutes: 0,
        seconds: 0,
      });

      setSearchParams((prev) => {
        prev.delete('date');
        prev.delete('fromDate');
        prev.delete('toDate');
        prev.set('calendar', startOfMonthDate.toJSON());
        return prev;
      });
    }
  };

  const urlDate = new Date(String(searchParams.get('date')));
  const selectedCalendar = isValid(urlDate)
    ? String(searchParams.get('date'))
    : availability && availability.length > 0
    ? availability[0].date
    : new Date().toJSON();

  const onChangeDate = (availability: UserAvailability) => () => {
    setSearchParams((prev) => {
      prev.set('date', availability.date);
      prev.delete('fromDate');
      prev.delete('toDate');
      return prev;
    });
  };

  const onChangeSlot = (slot: UserAvailabilitySlot) => () => {
    setSearchParams((prev) => {
      prev.set('fromDate', slot.from);
      prev.set('toDate', slot.to);
      return prev;
    });
  };

  const selectedDate = searchParams.get('date');

  const days = availability?.map((availability) => (
    <AvailabilityDay
      key={availability.date}
      onClick={onChangeDate(availability)}
      availability={availability}
      selected={selectedDate}
    />
  ));

  const selectedSlotFrom = searchParams.get('fromDate');

  const slots = availability
    ?.find(({date}) => date === selectedDate)
    ?.slots?.map((slot) => (
      <AvailabilityTime
        key={slot.from}
        onClick={onChangeSlot(slot)}
        slot={slot}
        selected={selectedSlotFrom}
      />
    ));

  return (
    <Stack gap="lg">
      <SimpleGrid cols={2}>
        <MonthSelector
          onChange={onPickDate}
          value={format(new Date(selectedCalendar), 'MMMM').toLowerCase()}
        />
      </SimpleGrid>
      {days && days.length > 0 ? (
        <div>
          <Title order={4} mb="sm" fw={600} size="md">
            Hvornår skal vi mødes?
          </Title>
          <ScrollArea
            h="auto"
            w="100%"
            type={isMobile ? 'always' : 'auto'}
            pb="lg"
          >
            <Flex gap="sm">{days}</Flex>
          </ScrollArea>
        </div>
      ) : (
        <>Prøv en anden måned</>
      )}

      {slots ? (
        <div>
          <Title order={4} mb="sm" fw={600} size="md">
            Vælg tidspunkt på dagen:
          </Title>
          <SimpleGrid cols={3} spacing="sm">
            {slots}
          </SimpleGrid>
        </div>
      ) : null}
    </Stack>
  );
}

function AvailabilityDay({
  availability,
  selected,
  onClick,
}: {
  availability: UserAvailability;
  selected: string | null;
  onClick: () => void;
}) {
  const isSelected =
    availability.date.substring(0, 10) === selected?.substring(0, 10);
  return (
    <Button
      onClick={onClick}
      color={isSelected ? 'black' : '#e5e5e5'}
      bg={isSelected ? '#e5e5e5' : undefined}
      variant="outline"
      h="56"
    >
      <Stack gap="2" justify="center">
        <Text size="xs" ta="center" fw={isSelected ? 700 : 400} c="black">
          {format(new Date(availability.date), 'EEEE', {locale: da})}
        </Text>
        <Text size="sm" ta="center" fw={isSelected ? 700 : 400} c="black">
          {format(new Date(availability.date), 'd. LLL', {locale: da})}
        </Text>
      </Stack>
    </Button>
  );
}

function AvailabilityTime({
  slot,
  selected,
  onClick,
}: {
  slot: UserAvailabilitySlot;
  selected?: string | null;
  onClick: () => void;
}) {
  const isSelected = slot.from === selected;
  return (
    <Button
      onClick={onClick}
      color={isSelected ? 'black' : '#e5e5e5'}
      bg={isSelected ? '#e5e5e5' : undefined}
      variant="outline"
    >
      <Text size="sm" ta="center" fw={isSelected ? 700 : 400} c="black">
        {format(new Date(slot.from), 'HH:mm', {locale: da})}
      </Text>
    </Button>
  );
}

function MonthSelector(props: SelectProps) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();

  const months = [
    {label: 'Januar', value: 'january'},
    {label: 'Februar', value: 'february'},
    {label: 'Marts', value: 'march'},
    {label: 'April', value: 'april'},
    {label: 'Maj', value: 'may'},
    {label: 'Juni', value: 'june'},
    {label: 'Juli', value: 'july'},
    {label: 'August', value: 'august'},
    {label: 'September', value: 'september'},
    {label: 'Oktober', value: 'october'},
    {label: 'November', value: 'november'},
    {label: 'December', value: 'december'},
  ];

  const data = months.map((month, index) => ({
    ...month,
    disabled: index < currentMonth,
  }));

  return <Select data={data} {...props} />;
}
