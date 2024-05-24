import {ActionIcon, Flex, Group, type GroupProps, Text} from '@mantine/core';
import {useNavigate} from '@remix-run/react';
import {Money} from '@shopify/hydrogen';
import {IconArrowLeft} from '@tabler/icons-react';
import {durationToTime} from '~/lib/duration';

export const TreatmentStepper = ({
  totalDuration,
  totalPrice,
  withBackButton = true,
  children,
  ...props
}: {
  totalDuration?: number;
  totalPrice?: number;
  withBackButton?: boolean;
  children: React.ReactNode;
} & GroupProps) => {
  const navigate = useNavigate();

  return (
    <Group justify="space-between" {...props}>
      <Group gap="xs">
        {totalPrice ? (
          <Text fw={500} tt="uppercase" fz={{base: 16, sm: 20}}>
            <Money
              as="span"
              data={{
                __typename: 'MoneyV2',
                amount: totalPrice?.toString(),
                currencyCode: 'DKK',
              }}
            />
          </Text>
        ) : null}
        {totalDuration ? (
          <Text c="dimmed" fz={{base: 12, sm: 16}}>
            {durationToTime(totalDuration ?? 0)}
          </Text>
        ) : null}
      </Group>
      <Flex gap={{base: 'xs', sm: 'md'}}>
        {withBackButton ? (
          <ActionIcon variant="default" size="lg" onClick={() => navigate(-1)}>
            <IconArrowLeft style={{width: '70%', height: '70%'}} stroke={1.5} />
          </ActionIcon>
        ) : null}
        {children}
      </Flex>
    </Group>
  );
};
