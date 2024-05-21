import {Flex, Radio, rem, Stack, Text, UnstyledButton} from '@mantine/core';
import {useUncontrolled} from '@mantine/hooks';
import {type CustomerLocation} from '~/lib/api/model';
import {LocationIcon} from '../LocationIcon';
import classes from './ArtistLocationRadioCard.module.css';

interface AristLocationRadioCardProps {
  checked?: boolean;
  value: string;
  defaultChecked?: boolean;
  onChange?(checked: boolean): void;
  location: CustomerLocation;
}

export function AristLocationRadioCard({
  checked,
  defaultChecked,
  value,
  onChange,
  className,
  children,
  location,
  ...others
}: AristLocationRadioCardProps &
  Omit<
    React.ComponentPropsWithoutRef<'button'>,
    keyof AristLocationRadioCardProps
  >) {
  const [isChecked, handleChange] = useUncontrolled({
    value: checked,
    defaultValue: defaultChecked,
    finalValue: false,
    onChange,
  });

  return (
    <UnstyledButton
      {...others}
      onClick={() => handleChange(!isChecked)}
      data-checked={isChecked || undefined}
      className={classes.button}
    >
      <Flex
        gap={{base: 'xs', sm: 'md'}}
        w="100%"
        justify="center"
        align="center"
      >
        <LocationIcon
          location={location}
          style={{width: rem(60), height: rem(60), strokeWidth: rem(1)}}
        />
        <Stack gap="0" style={{flex: 1}}>
          <Text tt="uppercase" fw={600} fz={{base: 'md', sm: 'xl'}}>
            {location.name}
          </Text>
          <Text c="black" fw={500} fz="xs" lineClamp={1}>
            {location.fullAddress}
          </Text>
        </Stack>
        <Radio
          checked={isChecked}
          value={value}
          color="gray"
          onChange={() => {}}
          tabIndex={-1}
        />
      </Flex>
    </UnstyledButton>
  );
}
