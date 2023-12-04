import {Carousel} from '@mantine/carousel';
import {Button, SimpleGrid, Stack, Text, Title} from '@mantine/core';

import {useSearchParams} from '@remix-run/react';
import {format} from 'date-fns';
import {da} from 'date-fns/locale';
import {MultilineButton} from '~/components/MultilineButton';
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
  const [searchParams, setSearchParams] = useSearchParams();

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
    <Stack gap="xl">
      {days ? (
        <Carousel
          slideSize={{base: '100px'}}
          align="start"
          slideGap="sm"
          controlsOffset="xs"
          controlSize={40}
          containScroll="trimSnaps"
          style={{paddingLeft: '60px', paddingRight: '60px'}}
        >
          {days}
        </Carousel>
      ) : null}

      {slots ? (
        <div>
          <Title order={3} mb="sm">
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
  return (
    <Carousel.Slide key={availability.date}>
      <MultilineButton
        onClick={onClick}
        variant={
          availability.date.substring(0, 10) === selected?.substring(0, 10)
            ? 'filled'
            : 'light'
        }
      >
        <Text size="sm" ta="center" fw={500}>
          {format(new Date(availability.date), 'EEEE', {locale: da})}
        </Text>
        <Text size="md" ta="center" fw={500}>
          {format(new Date(availability.date), 'PP', {locale: da}).slice(0, -6)}
        </Text>
      </MultilineButton>
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
  return (
    <Button
      variant={slot.from === selected ? 'filled' : 'light'}
      onClick={onClick}
    >
      {format(new Date(slot.from), 'HH:mm', {locale: da})}
    </Button>
  );
}
