import {Group, RangeSlider, Stack, Text} from '@mantine/core';
import {useSearchParams} from '@remix-run/react';
import {IconMoneybag} from '@tabler/icons-react';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';

export function AddPriceFilter({min, max}: {min: number; max: number}) {
  const {t} = useTranslation(['global']);
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
        <Text fw="bold">{t('price_label')}</Text>
      </Group>
      <RangeSlider
        value={value as any}
        onChange={setValue}
        onChangeEnd={onChange}
        min={0}
        max={max}
        label={(value: number) => `${value} kr`}
        labelAlwaysOn
        styles={{label: {bottom: '-38px', top: 'unset'}}}
      />
    </Stack>
  );
}
