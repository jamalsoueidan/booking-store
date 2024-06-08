import {Group, RangeSlider, Stack, Text} from '@mantine/core';
import {useSearchParams} from '@remix-run/react';
import {IconMoneybag} from '@tabler/icons-react';
import {useEffect, useState} from 'react';

export function AddPriceFilter({min, max}: {min: number; max: number}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState([0, max]);

  const onChange = (value: number[] | null) => {
    setSearchParams(
      (prev) => {
        if (value === null) {
          prev.delete('price');
        } else {
          prev.set('price', value.join(','));
        }
        return prev;
      },
      {preventScrollReset: true},
    );
    setValue(value as any);
  };

  useEffect(() => {
    const value = searchParams.get('price')?.split(',').map(Number);
    setValue(value as any);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack gap="xs" mb="lg">
      <Group gap="xs">
        <IconMoneybag />
        <Text fw="bold">Pris:</Text>
      </Group>
      <RangeSlider
        value={value as any}
        onChange={setValue}
        onChangeEnd={onChange}
        min={0}
        max={max}
        label={(value: number) => `${value} kr`}
        marks={[
          {
            value: 10,
            label: `fra ${0} kr`,
          },
          {
            value: max - 10,
            label: `til ${max} kr`,
          },
        ]}
      />
    </Stack>
  );
}