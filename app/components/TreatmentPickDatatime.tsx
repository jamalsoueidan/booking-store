import {Carousel, type Embla} from '@mantine/carousel';
import {
  ActionIcon,
  Button,
  Flex,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';

import {useSearchParams} from '@remix-run/react';
import {IconArrowLeft, IconArrowRight} from '@tabler/icons-react';
import {format, isValid, parse, set} from 'date-fns';
import {da} from 'date-fns/locale';
import {useCallback, useState} from 'react';
import type {
  UserAvailability,
  UserAvailabilityMulti,
  UserAvailabilitySlot,
} from '~/lib/api/model';

type TreatmentPickDatetimeProps = {
  availability?: UserAvailabilityMulti[];
};

export default function TreatmentPickDatetime({
  availability,
}: TreatmentPickDatetimeProps) {
  const [embla, setEmbla] = useState<Embla | null>(null);

  const scrollPrev = useCallback(() => {
    if (embla) embla.scrollPrev();
  }, [embla]);

  const scrollNext = useCallback(() => {
    if (embla) embla.scrollNext();
  }, [embla]);

  const [searchParams, setSearchParams] = useSearchParams();

  const onPickDate = (month: string | null) => {
    if (month) {
      const monthDate = parse(month, 'MMMM', new Date());
      const startOfMonthDate = set(monthDate, {
        hours: 2,
        minutes: 0,
        seconds: 0,
      });
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('calendar', startOfMonthDate.toJSON());
      newSearchParams.delete('date');
      newSearchParams.delete('fromDate');
      newSearchParams.delete('toDate');
      setSearchParams(newSearchParams, {
        state: {
          key: 'booking',
        },
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
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('date', availability.date);
    newSearchParams.delete('fromDate');
    newSearchParams.delete('toDate');
    setSearchParams(newSearchParams, {
      state: {
        key: 'booking',
      },
    });
  };

  const onChangeSlot = (slot: UserAvailabilitySlot) => () => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('fromDate', slot.from);
    newSearchParams.set('toDate', slot.to);
    setSearchParams(newSearchParams, {
      state: {
        key: 'booking',
      },
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
        <Select
          onChange={onPickDate}
          value={format(new Date(selectedCalendar), 'MMMM').toLowerCase()}
          data={[
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
          ]}
        />
        <Flex justify="flex-end" gap="lg" w="100%">
          <ActionIcon variant="default" onClick={scrollPrev} size="lg">
            <IconArrowLeft />
          </ActionIcon>
          <ActionIcon variant="default" onClick={scrollNext} size="lg">
            <IconArrowRight />
          </ActionIcon>
        </Flex>
      </SimpleGrid>
      {days && days.length > 0 ? (
        <div>
          <Title order={4} mb="sm" fw={600} size="md">
            Hvornår skal vi mødes?
          </Title>
          <Carousel
            slideSize={{base: '100px'}}
            slideGap="sm"
            withControls={false}
            align="start"
            containScroll="keepSnaps"
            dragFree={true}
            getEmblaApi={setEmbla}
          >
            {days}
          </Carousel>
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
    <Carousel.Slide key={availability.date}>
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
    </Carousel.Slide>
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
