import {Carousel, type Embla} from '@mantine/carousel';
import {
  ActionIcon,
  Button,
  Flex,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {MonthPickerInput, type DateValue} from '@mantine/dates';
import 'dayjs/locale/da';

import {useSearchParams} from '@remix-run/react';
import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronDown,
} from '@tabler/icons-react';
import {addDays, format} from 'date-fns';
import {da} from 'date-fns/locale';
import {useCallback, useState} from 'react';
import type {
  UserAvailability,
  UserAvailabilityMulti,
  UserAvailabilitySlot,
} from '~/lib/api/model';

type TreatmentPickDatetimeProps = {
  availability: UserAvailabilityMulti[];
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

  const onPickDate = (date: DateValue) => {
    if (date) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('calendar', addDays(date, 1).toJSON());
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

  const selectedCalendar = searchParams.get('calendar') || availability[0].date;

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

  const days = availability.map((availability) => (
    <AvailabilityDay
      key={availability.date}
      onClick={onChangeDate(availability)}
      availability={availability}
      selected={selectedDate}
    />
  ));

  const selectedSlotFrom = searchParams.get('fromDate');

  const slots = availability
    .find(({date}) => date === selectedDate)
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
        <div>
          <MonthPickerInput
            locale="da"
            minDate={new Date()}
            value={new Date(selectedCalendar)}
            onChange={onPickDate}
            rightSection={<IconChevronDown />}
            rightSectionPointerEvents="none"
          />
        </div>
        <Flex justify="flex-end" gap="lg" w="100%">
          <ActionIcon variant="default" onClick={scrollPrev} size="lg">
            <IconArrowLeft />
          </ActionIcon>
          <ActionIcon variant="default" onClick={scrollNext} size="lg">
            <IconArrowRight />
          </ActionIcon>
        </Flex>
      </SimpleGrid>
      {days ? (
        <Carousel
          slideSize={{base: '100px'}}
          slideGap="sm"
          withControls={false}
          align="start"
          getEmblaApi={setEmbla}
        >
          {days}
        </Carousel>
      ) : null}

      {slots ? (
        <div>
          <Title order={4} mb="sm" fw={400} size="md">
            Vælge tid:
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
            {format(new Date(availability.date), 'E', {locale: da})}
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
